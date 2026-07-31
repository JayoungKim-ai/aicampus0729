from pydantic import BaseModel

# DB에서 꺼낸 축제를 어떤 JSON 형태로 응답할지 정의
class FestivalOut(BaseModel):
    id: int
    name: str | None
    place: str | None
    start_date: str | None
    end_date: str | None
    content: str | None
    phone: str | None
    homepage: str | None
    road_address: str | None
    latitude: float | None
    longitude: float | None

    class Config:
        from_attributes = True   # SQLAlchemy 객체 → 자동 변환 허용