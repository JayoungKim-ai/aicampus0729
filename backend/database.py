from sqlalchemy import create_engine, Column, Integer, String, Text, Float, ForeignKey, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime

engine = create_engine("sqlite:///./festivals.db")
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

class Festival(Base):
    __tablename__ = "festivals"

    id = Column(Integer, primary_key=True, autoincrement=True)  # 자체 고유번호
    name         = Column(String, index=True)   # fstvlNm         축제명
    region       = Column(String, index=True)   # (주소에서 추출)   광역시·도
    place        = Column(String)   # opar            개최장소
    start_date   = Column(String, index=True)   # fstvlStartDate  축제시작일자
    end_date     = Column(String, index=True)   # fstvlEndDate    축제종료일자
    content      = Column(Text)     # fstvlCo         축제내용 (길어서 Text)
    manage_org   = Column(String)   # mnnstNm         주관기관명
    host_org     = Column(String)   # auspcInsttNm    주최기관명
    sponsor_org  = Column(String)   # suprtInsttNm    후원기관명
    phone        = Column(String)   # phoneNumber     전화번호
    homepage     = Column(String)   # homepageUrl     홈페이지주소
    related_info = Column(Text)     # relateInfo      관련정보
    road_address = Column(String)   # rdnmadr         소재지도로명주소
    land_address = Column(String)   # lnmadr          소재지지번주소
    latitude     = Column(Float)    # latitude        위도  (숫자!)
    longitude    = Column(Float)    # longitude       경도  (숫자!)
    reference_date = Column(String) # referenceDate   데이터기준일자
    provider_code  = Column(String) # instt_code      제공기관코드
    provider_name  = Column(String) # instt_nm        제공기관명


class Review(Base):
    """축제 후기. 로그인이 없으므로 nickname으로 작성자를 구분한다."""
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, autoincrement=True)
    # festivals.id 를 가리킨다. 어떤 축제에 대한 후기인지
    festival_id = Column(Integer, ForeignKey("festivals.id"), index=True, nullable=False)
    nickname = Column(String, nullable=False)   # 작성자 닉네임
    rating = Column(Integer, nullable=False)    # 별점 1~5
    content = Column(Text, nullable=False)      # 후기 본문    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)# 작성일시

Base.metadata.create_all(engine)