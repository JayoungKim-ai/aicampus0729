import os
import math
import httpx
from dotenv import load_dotenv
from database import SessionLocal, Festival, Review
from fastapi import HTTPException     
from schemas import ReviewCreate, ReviewListOut, ReviewOut
from datetime import datetime
import csv
import io
from fastapi.responses import StreamingResponse
from fastapi import APIRouter
router = APIRouter(prefix="/festivals", tags=["축제"])

API_URL = "https://api.data.go.kr/openapi/tn_pubr_public_cltur_fstvl_api"



from datetime import date

# -------------------------------------------------------------
# 공용함수
# -------------------------------------------------------------
def calc_status(start_date, end_date, today):
    """진행 상태는 저장하지 않고 조회 시점에 계산한다."""
    if not start_date or not end_date:
        return "종료"
    if today < start_date:
        return "예정"
    if today > end_date:
        return "종료"
    if today == end_date:
        return "오늘 종료"      # 진행중이지만 오늘이 마지막 날
    return "진행중"


def to_summary(row, today):
    """DB 행 → 목록용 딕셔너리."""
    return {
        "id": row.id,
        "name": row.name,
        "region": row.region,
        "place": row.place,
        "address": row.land_address or row.road_address,   # 지번 없으면 도로명
        "start_date": row.start_date,
        "end_date": row.end_date,
        "status": calc_status(row.start_date, row.end_date, today),
    }

# -------------------------------------------------------------
# 축제 목록 /festivals
# -------------------------------------------------------------
from schemas import FestivalListOut
@router.get("", response_model=FestivalListOut)
def list_festivals(region: str | None = None,
                    date_: str | None = None,
                    keyword: str | None = None,
                    status: str | None = None,
                    page:int=1, 
                    size:int=20):
    db = SessionLocal()
    today = date.today().isoformat() # yyyy-mm-dd
    try:        
        query = db.query(Festival)

        if region:
          query = query.filter(Festival.region == region)    # 정확히 일치

        if keyword:
            query = query.filter(Festival.name.like(f"%{keyword}%")) # 부분 일치

        if date_:
            # 그날 열려 있는 축제: 시작일 <= 그날 <= 종료일
            query = query.filter(Festival.start_date <= date_,
                                 Festival.end_date >= date_)
            
        if status == "예정":
            query = query.filter(Festival.start_date > today)
        elif status == "진행중":
            query = query.filter(Festival.start_date <= today,
                                 Festival.end_date >= today)
        elif status == "종료":
            query = query.filter(Festival.end_date < today)

        total = query.count() # 총 데이터 수
        query = query.order_by(Festival.id.asc())
        query = query.offset((page-1)*size)
        query = query.limit(size)
        rows = query.all()
        return {"total":total, 
                "page":page, 
                "size": size, 
                "items":[to_summary(r, today) for r in rows]}
    finally:
        db.close()
# -------------------------------------------------------------
# 지역목록
# -------------------------------------------------------------
from sqlalchemy import func # SQL의 함수를 파이썬에서 부르는 창구
from schemas import RegionOut

@router.get("/regions", response_model=list[RegionOut])
def list_regions():
    db = SessionLocal()
    try:
        rows = (db.query(Festival.region, func.count().label("count")) # 지역, 그 지역의 데이터 갯수
                  .filter(Festival.region.isnot(None))    # 지역이 비어 있는 행은 제외
                  .group_by(Festival.region)              # 같은 지역끼리 한 덩어리로 묶기
                  .order_by(func.count().desc())          # 개수가 많은 지역 순으로 정렬
                  .all())                                 # 여기서 실행
        return [{"name": r.region, "count": r.count} for r in rows]
    finally:
        db.close()

# -------------------------------------------------------------
# 축제 상세
# -------------------------------------------------------------
from schemas import FestivalDetail
@router.get("/detail/{festival_id}", response_model=FestivalDetail)
def get_festival(festival_id: int):
    today = date.today().isoformat()
    db = SessionLocal()
    try:
        row = db.query(Festival).filter(Festival.id == festival_id).first()

        if row is None:
            raise HTTPException(status_code=404, detail="축제를 찾을 수 없습니다")

        detail = to_summary(row, today)      # 요약 8개를 먼저 채우고
        detail.update({                      # 상세 항목을 더한다
            "content":    row.content,
            "host_org":   row.host_org,
            "manage_org": row.manage_org,
            "phone":      row.phone,
            "homepage":   row.homepage,
            "latitude":   row.latitude,
            "longitude":  row.longitude,
        })
        return detail
    finally:
        db.close()
        
# -------------------------------------------------------------
# 공공데이터 불러와서 DB에 저장
# -------------------------------------------------------------
# 주소 표기가 흔들리는 경우를 표준 이름으로 통일한다.
# (실제 데이터를 확인한 결과 아래 네 가지만 어긋났다)
REGION_ALIASES = {
    "강원도": "강원특별자치도",
    "서울시": "서울특별시",
    "충남":   "충청남도",
    "울릉군": "경상북도",      # 시·군 이름이 첫 어절에 온 경우
}

def extract_region(road, land):
    """도로명 주소 우선, 없으면 지번 주소에서 광역시·도만 뽑는다."""
    address = (road or land or "").strip()
    if not address:
        return None
    first = address.split()[0]                 # 첫 어절 = 광역시·도
    return REGION_ALIASES.get(first, first)    # 표에 있으면 바꾸고, 없으면 그대로

def to_float(v):
    """위도·경도용: 값이 있으면 실수로, 비었거나 이상하면 None."""
    try:
        return float(v)
    except (TypeError, ValueError):
        return None


@router.post("/sync")
def sync_festivals():
    service_key = os.getenv("FESTIVAL_SERVICE_KEY")
    num_rows = 100

    # ① 1페이지를 받아 전체 개수를 파악한다
    first = httpx.get(API_URL, params={
        "serviceKey": service_key, "pageNo": 1,
        "numOfRows": num_rows, "type": "json",
    })
    if first.status_code != 200:
        raise HTTPException(status_code=502, detail="축제 API 요청 실패")
    
    body = first.json()["body"]

    total_count = int(body["totalCount"])
    total_pages = math.ceil(total_count / num_rows)
    all_items = list(body["items"]["item"])

    # ② 2페이지부터 반복 수집
    for page in range(2, total_pages + 1):
        response = httpx.get(API_URL, params={
            "serviceKey": service_key, "pageNo": page,
            "numOfRows": num_rows, "type": "json",
        })
        if response.status_code != 200:
            raise HTTPException(status_code=502, detail=f"{page}페이지 요청 실패")
        all_items.extend(response.json()["body"]["items"]["item"])

    # ③ DB에 저장 (전부 지우고 다시 넣기)
    db = SessionLocal()
    try:
        db.query(Festival).delete()

        seen = set()          # 같은 축제가 두 번 들어오는 것을 막는다
        for it in all_items:
            key = (it.get("fstvlNm"), it.get("fstvlStartDate"), it.get("opar"))
            if key in seen:
                continue
            seen.add(key)

            db.add(Festival(
                name=it.get("fstvlNm"),
                place=it.get("opar"),
                start_date=it.get("fstvlStartDate"),
                end_date=it.get("fstvlEndDate"),
                content=it.get("fstvlCo"),
                manage_org=it.get("mnnstNm"),
                host_org=it.get("auspcInsttNm"),
                sponsor_org=it.get("suprtInsttNm"),
                phone=it.get("phoneNumber"),
                homepage=it.get("homepageUrl"),
                related_info=it.get("relateInfo"),
                road_address=it.get("rdnmadr"),
                land_address=it.get("lnmadr"),
                region=extract_region(it.get("rdnmadr"), it.get("lnmadr")),   # ← 추가
                latitude=to_float(it.get("latitude")),
                longitude=to_float(it.get("longitude")),
                reference_date=it.get("referenceDate"),
                provider_code=it.get("insttCode"),
                provider_name=it.get("insttNm"),
            ))

        db.commit()
        saved = db.query(Festival).count()
    finally:
        db.close()

    return {"total_count": total_count, "saved": saved, "skipped": total_count - saved}




# -------------------------------------------------------------
# 축제 후기
# -------------------------------------------------------------

def get_festival_or_404(db, festival_id: int):
    """축제가 없으면 404, 있으면 Festival 행 반환."""
    festival = db.query(Festival).filter(Festival.id == festival_id).first()
    if festival is None:
        raise HTTPException(status_code=404, detail="축제를 찾을 수 없습니다")
    return festival


@router.get("/{festival_id}/reviews", response_model=ReviewListOut)
def list_reviews(festival_id: int):
    """해당 축제 후기 목록 (최신순)."""
    db = SessionLocal()
    try:
        get_festival_or_404(db, festival_id)

        rows = (
            db.query(Review)
            .filter(Review.festival_id == festival_id)
            .order_by(Review.created_at.desc())
            .all()
        )
        return {"total": len(rows), "items": rows}
    finally:
        db.close()


@router.post("/{festival_id}/reviews", response_model=ReviewOut, status_code=201)
def create_review(festival_id: int, body: ReviewCreate):
    """후기 작성. body = nickname, rating, content."""
    db = SessionLocal()
    try:
        get_festival_or_404(db, festival_id)

        review = Review(
            festival_id=festival_id,
            nickname=body.nickname.strip(),
            rating=body.rating,
            content=body.content.strip(),
            created_at=datetime.utcnow(),
        )
        db.add(review)
        db.commit()
        db.refresh(review)  # id, created_at 등 DB 값 다시 읽기
        return review
    finally:
        db.close()



@router.get("/download")
def download_festivals(
    region: str | None = None,
    date_: str | None = None,
    keyword: str | None = None,
    status: str | None = None,
):
    today = date.today().isoformat()
    db = SessionLocal()
    try:
        # list_festivals 와 동일한 필터 로직
        query = db.query(Festival)
        if region:
            query = query.filter(Festival.region == region)
        if keyword:
            query = query.filter(Festival.name.like(f"%{keyword}%"))
        if date_:
            query = query.filter(
                Festival.start_date <= date_,
                Festival.end_date >= date_,
            )
        if status == "예정":
            query = query.filter(Festival.start_date > today)
        elif status == "진행중":
            query = query.filter(
                Festival.start_date <= today,
                Festival.end_date >= today,
            )
        elif status == "종료":
            query = query.filter(Festival.end_date < today)
        rows = query.order_by(Festival.id.asc()).all()
        items = [to_summary(r, today) for r in rows]
        # CSV를 메모리에 작성
        buffer = io.StringIO()
        writer = csv.writer(buffer)
        writer.writerow(["id", "축제명", "지역", "장소", "주소", "시작일", "종료일", "상태"])
        for item in items:
            writer.writerow([
                item["id"], item["name"], item["region"], item["place"],
                item["address"], item["start_date"], item["end_date"], item["status"],
            ])
        # UTF-8 BOM: 한글이 깨지지 않게
        content = "\ufeff" + buffer.getvalue()
        return StreamingResponse(
            iter([content.encode("utf-8")]),
            media_type="text/csv; charset=utf-8",
            headers={
                "Content-Disposition": "attachment; filename=festivals.csv"
            },
        )
    finally:
        db.close()