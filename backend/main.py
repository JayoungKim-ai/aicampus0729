from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import os
import httpx
from dotenv import load_dotenv
load_dotenv()

import math

from routers import festivals
# ──────────────────────────────────────────────
# 1) FastAPI 앱 인스턴스 생성
# ──────────────────────────────────────────────
# FastAPI() 를 호출하면 웹 애플리케이션 객체가 만들어집니다.
# 이 app 객체에 API 경로(라우트)를 등록하고, 서버를 실행합니다
app = FastAPI()
app.include_router(festivals.router)

# ──────────────────────────────────────────────
# 2) CORS 설정
# ──────────────────────────────────────────────
# CORS(Cross-Origin Resource Sharing)란?
# → 브라우저의 보안 정책으로, 다른 출처(도메인, 포트)에서 오는 요청을 기본적으로 차단합니다.
# → React(포트 5173)에서 FastAPI(포트 8000)로 요청하면 "출처가 다르다"고 판단하여 차단됩니다.
# → 이 설정을 통해 특정 프론트엔드 주소에서 오는 요청을 허용합니다.


# 허용할 프론트엔드 주소 목록
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,           # 위에서 지정한 주소만 허용
    allow_credentials=True,
    allow_methods=["*"],             # 모든 HTTP 메서드(GET, POST 등) 허용
    allow_headers=["*"],             # 모든 헤더 허용
)

# ──────────────────────────────────────────────
# 3) API 엔드포인트(라우트) 정의
# ──────────────────────────────────────────────
# "/" 경로로 GET 요청이 들어오면 아래 함수를 실행
@app.get("/")
def home():
    return {"message":"여기는 home입니다"}
    
# ──────────────────────────────────────────────
# 4) 헬스체크 엔드포인트
# ──────────────────────────────────────────────
# "/health" 경로로 GET 요청이 들어오면 서버가 정상임을 알려줍니다.
# 모니터링 도구나 프론트엔드가 "서버 살아있니?" 하고 확인할 때 사용합니다.
@app.get("/health")
def health_check():
    return {"status": "ok"}

# ──────────────────────────────────────────────
# 5) 경로파라미터 연습
# ──────────────────────────────────────────────
@app.get("/greet/{name}")
def greet(name:str):
    return {"message":f"{name}님, 환영합니다."}

# ──────────────────────────────────────────────
# 6) 쿼리파라미터 연습
# ──────────────────────────────────────────────
@app.get("/search/")
def search(keyword:str, asc:bool=True):
    return {"keyword":keyword, "asc":asc}

# # ──────────────────────────────────────────────
# # 7) 전국문화축제 (공공데이터API)
# # ──────────────────────────────────────────────
# @app.get("/festivals")
# def get_festivals(page:int=1, fstvlStartDate:str="2026-07-31"):
#     # 1. 공공데이터 포털의 API 요청(전국문화축제 데이터)

#     # api 엔드포인트
#     url = "https://api.data.go.kr/openapi/tn_pubr_public_cltur_fstvl_api"

#     # .env에서 키 꺼내기
#     service_key = os.getenv("FESTIVAL_SERVICE_KEY")  

#     # 요청 파라미터
#     params = {                                  
#         "serviceKey": service_key,        
#         "pageNo": page,
#         "numOfRows": "100",
#         "type": "json",
#         "fstvlStartDate":fstvlStartDate
#     }   
#     response = httpx.get(url, params=params)
#     data = response.json()
    
#     # 2. 데이터를 JSON 형태로 리턴
#     return data["response"]["body"]["items"]

# # ──────────────────────────────────────────────
# # 8) 전국문화축제 (공공데이터API) - sync
# # ──────────────────────────────────────────────
# # 위도·경도용: 값이 있으면 실수로, 비었거나 없으면 None
# def to_float(v):
#     try:
#         return float(v)
#     except (TypeError, ValueError):
#         return None
    
# @app.get("/festivals/sync")
# def get_festivals_sync():
#     import math

# 		# api 엔드포인트
#     url = "https://api.data.go.kr/openapi/tn_pubr_public_cltur_fstvl_api"
    
#     # .env에서 키 꺼내기
#     service_key = os.getenv("FESTIVAL_SERVICE_KEY")  

#     # 한번에 가져올 데이터 갯수
#     num_rows = 100

#     # 1페이지 요청 → 전체 개수 파악 =====================
#     first_params = {
#         "serviceKey": service_key, "pageNo": 1,
#         "numOfRows": num_rows, "type": "json",
#     }
#     first = httpx.get(url, params=first_params)
#     if first.status_code != 200:
#         return {"error": "축제 API 요청 실패"}
#     body = first.json()["response"]["body"]
#     total_count = int(body["totalCount"])  
#     total_pages = math.ceil(total_count / num_rows)
#     all_items = list(body["items"]) 

#     # 2페이지부터 반복 수집 =====================
#     for page in range(2,total_pages+1):
#       params = {
#             "serviceKey": service_key, "pageNo": page,
#             "numOfRows": num_rows, "type": "json",
#       }
#       response = httpx.get(url, params=params)
#       if response.status_code != 200:
#             return {"error": f"{page}페이지 요청 실패"}
#       all_items.extend(response.json()["response"]["body"]["items"])

#     # DB에 저장 (비우고 다시 넣기) =====================
#     db = SessionLocal()
#     db.query(Festival).delete()
#     for it in all_items:
#         db.add(Festival(
#             name=it.get("fstvlNm"),
#             place=it.get("opar"),
#             start_date=it.get("fstvlStartDate"),
#             end_date=it.get("fstvlEndDate"),
#             content=it.get("fstvlCo"),
#             manage_org=it.get("mnnstNm"),
#             host_org=it.get("auspcInsttNm"),
#             sponsor_org=it.get("suprtInsttNm"),
#             phone=it.get("phoneNumber"),
#             homepage=it.get("homepageUrl"),
#             related_info=it.get("relateInfo"),
#             road_address=it.get("rdnmadr"),
#             land_address=it.get("lnmadr"),
#             latitude=to_float(it.get("latitude")),     # ★③ 문자열 → 실수/None
#             longitude=to_float(it.get("longitude")),   # ★③
#             reference_date=it.get("referenceDate"),
#             provider_code=it.get("insttCode"),         # ★② insttCode (camelCase!)
#             provider_name=it.get("insttNm"),           # ★② insttNm
#         ))
#     db.commit()
#     saved = db.query(Festival).count()
#     db.close()

#     return {"total_count": total_count, "saved": saved}

# # ──────────────────────────────────────────────
# # 9) 전국문화축제 (공공데이터API) - db에서 불러오기
# # ──────────────────────────────────────────────
# @app.get("/festivals/list", response_model=list[FestivalOut])
# def read_festivals(page:int=1, size:int=20, name:str|None=None, start_date:str|None=None):
#     db = SessionLocal()

#     # Festival 테이블에서 조회
#     query = db.query(Festival)

#     # 만약 name 검색어가 있다면 먼저 필터링
#     if name:
#         query = query.filter(Festival.name.like(f"%{name}%"))

#     # 만약 start_date 검색어가 있다면 먼저 필터링
#     if start_date:
#         query = query.filter(Festival.start_date==start_date)
        
    
#     # 페이지네이션
#     offset = (page-1)*20
#     rows = query.offset(offset).limit(size).all()
#     db.close()

#     return rows