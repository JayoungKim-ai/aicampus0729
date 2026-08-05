from pydantic import BaseModel, Field
from datetime import datetime

class FestivalSummary(BaseModel):
    """목록에 쓰는 요약 정보. 카드에 보이는 것만 담는다."""
    id: int
    name: str | None
    region: str | None
    place: str | None
    address: str | None       # 지번 주소 (없으면 도로명 주소)
    start_date: str | None
    end_date: str | None
    status: str               # 오늘종료 | 예정 | 진행중 | 종료  (저장하지 않고 계산한 값)

class FestivalListOut(BaseModel):
    """목록 응답 전체"""
    total: int                # 조건에 맞는 전체 건수 (현재 페이지 개수가 아님)
    page: int
    size: int
    items: list[FestivalSummary]

class FestivalDetail(FestivalSummary):
    """상세에 쓰는 전체 정보. 요약을 물려받고 추가로 필요한 항목을 더한다."""
    content: str | None
    host_org: str | None          # 주최기관
    manage_org: str | None     # 주관기관
    phone: str | None
    homepage: str | None
    latitude: float | None
    longitude: float | None

class RegionOut(BaseModel):
    """지역 선택 상자에 넣을 항목."""
    name: str
    count: int



class ReviewCreate(BaseModel):
    """후기 작성 요청 body."""
    nickname: str = Field(min_length=1, max_length=20, description="닉네임")
    # ge=1, le=5 → 1 이상 5 이하만 허용
    rating: int = Field(ge=1, le=5, description="별점 1~5")
    content: str = Field(min_length=1, max_length=1000, description="후기 내용")
    
class ReviewOut(BaseModel):
    """후기 응답."""
    id: int
    festival_id: int
    nickname: str
    rating: int
    content: str
    created_at: datetime
    # SQLAlchemy 모델 → Pydantic 변환 허용
    class Config:
        from_attributes = True

class ReviewListOut(BaseModel):
    """특정 축제 후기 목록."""
    total: int
    items: list[ReviewOut]