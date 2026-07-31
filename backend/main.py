from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# ──────────────────────────────────────────────
# 1) FastAPI 앱 인스턴스 생성
# ──────────────────────────────────────────────
# FastAPI() 를 호출하면 웹 애플리케이션 객체가 만들어집니다.
# 이 app 객체에 API 경로(라우트)를 등록하고, 서버를 실행합니다
app = FastAPI()


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