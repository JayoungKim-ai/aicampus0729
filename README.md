# myapp20260729

풀스택 웹 애플리케이션 학습·실습 저장소입니다.
자바스크립트 문법 연습부터 React 프론트엔드, FastAPI 백엔드, 그리고 공공데이터를 활용한
**전국 문화축제 조회 서비스**까지 단계적으로 만들어가고 있습니다.

---

## 📁 폴더 구성

```
myapp20260729/
├── JS연습/          # 자바스크립트 핵심 문법 실습 파일
├── frontend/        # React 19 + Vite + Tailwind CSS v4
└── backend/         # FastAPI + SQLAlchemy + SQLite
```

---

## 🚀 시작하기 (처음 받는 경우)

### 0. 사전 준비

| 도구    | 확인 명령          | 비고                      |
| ------- | ------------------ | ------------------------- |
| Git     | `git --version`    | 저장소 내려받기           |
| Node.js | `node -v`          | 20 이상 권장 (프론트엔드) |
| Python  | `python --version` | 3.11 이상 권장 (백엔드)   |

### 1. 저장소 클론

```bash
cd C:\workspace                                          # 원하는 위치로 이동
git clone https://github.com/JayoungKim-ai/aicampus0729.git
cd aicampus0729
```

> 💡 `node_modules`와 `.venv`는 깃에 올리지 않습니다(용량이 크고 PC마다 다름).
> 그래서 클론 직후에는 폴더가 없고, 아래 설치 과정에서 새로 만들어집니다.
> `package.json` / `requirements.txt`가 **"설치 목록표"** 라고 생각하면 됩니다.

### 2. 프론트엔드 패키지 설치

```bash
cd frontend
npm install        # package.json 목록대로 node_modules 생성
npm run dev        # http://localhost:5173
```

### 3. 백엔드 패키지 설치

```bash
cd ../backend

python -m venv .venv               # 가상환경 생성 (이 프로젝트 전용 파이썬 방)
.venv\Scripts\activate             # Windows (PowerShell/CMD)
# source .venv/bin/activate        # macOS / Linux

pip install -r requirements.txt    # requirements.txt 목록대로 설치
```

> 💡 **가상환경(venv)이 왜 필요한가요?**
> 프로젝트마다 필요한 패키지 버전이 다릅니다. 컴퓨터 전체에 설치하면 서로 충돌하므로,
> 프로젝트별로 "전용 서랍"을 하나씩 만들어 그 안에만 설치하는 것입니다.
> 터미널 앞에 `(.venv)`가 보이면 활성화된 상태입니다.

### 4. 환경변수 파일(.env) 만들기 ⚠️ 필수

> **클론만 해서는 백엔드가 동작하지 않습니다.**
> API 키가 담긴 `backend/.env` 파일은 `.gitignore`에 등록되어 있어 **깃에 올라가지 않습니다.**
> (키가 깃허브에 공개되면 다른 사람이 마음대로 쓸 수 있기 때문입니다.)
> 그래서 저장소를 새로 받은 사람은 **`.env`를 직접 만들어야 합니다.**

**① 서비스키 발급**

공공데이터포털(https://www.data.go.kr)에 가입 → **"전국문화축제 표준데이터"** 검색 →
활용신청 → 마이페이지에서 **일반 인증키(Decoding)** 복사

**② 파일 생성** — `backend` 폴더 안에 `.env` 라는 이름으로 파일을 만듭니다.

```env
# backend/.env
FESTIVAL_SERVICE_KEY=발급받은_서비스키를_여기에_붙여넣기
```

**작성 시 주의**

- 파일 이름은 `env.txt`, `.env.txt`가 아니라 정확히 **`.env`** (앞에 점, 확장자 없음)
- 위치는 반드시 **`backend/` 폴더 안** (`main.py`와 같은 위치)
- 값에 **따옴표를 쓰지 않습니다** → `FESTIVAL_SERVICE_KEY="abc"` (✕) / `FESTIVAL_SERVICE_KEY=abc` (○)
- `=` 앞뒤에 공백을 넣지 않습니다
- 발급받은 키는 **절대 깃에 올리거나 채팅으로 공유하지 마세요**

> 💡 `.env`는 "비밀 메모지"입니다. 코드는 모두에게 공개해도 되지만 열쇠는 각자 보관하는 셈이죠.
> 코드에서는 `os.getenv("FESTIVAL_SERVICE_KEY")` 로 꺼내 쓰기 때문에,
> 키가 바뀌어도 `.env`만 고치면 되고 소스 코드는 손대지 않아도 됩니다.

### 5. 실행 확인

```bash
# 터미널 1 — 백엔드
cd backend && .venv\Scripts\activate && fastapi dev main.py

# 터미널 2 — 프론트엔드
cd frontend && npm run dev
```

http://127.0.0.1:8000/docs 에서 **POST `/festivals/sync`** 를 한 번 실행해 데이터를 채운 뒤,
http://localhost:5173 에 접속하면 축제 목록이 보입니다.

### ❗ 자주 겪는 문제

| 증상                                    | 원인 / 해결                                                      |
| --------------------------------------- | ---------------------------------------------------------------- |
| `'npm'은(는) 내부 또는 외부 명령...`    | Node.js 미설치 → 설치 후 터미널 재시작                           |
| `ModuleNotFoundError: fastapi`          | 가상환경 미활성화 → `.venv\Scripts\activate` 후 다시 실행        |
| 활성화 시 `실행 정책` 오류 (PowerShell) | `Set-ExecutionPolicy -Scope Process RemoteSigned` 실행 후 재시도 |
| 화면에 `서버연결실패` 표시              | 백엔드 서버가 꺼져 있음 → 터미널 1에서 실행 확인                 |
| 목록이 비어 있음                        | `POST /festivals/sync` 미실행                                    |
| `/festivals/sync` 실행 시 502 오류      | `.env` 없음 / 키 오타 / 따옴표 포함 → 4단계 다시 확인            |
| `.env`를 만들었는데도 키를 못 읽음      | 파일 위치가 `backend/`가 맞는지, 이름이 `.env.txt`가 아닌지 확인 |

---

## 📝 JS연습

바닐라 자바스크립트 핵심 문법을 주제별로 연습한 파일들입니다.

| 파일                 | 주제                              |
| -------------------- | --------------------------------- |
| 1\_템플릿리터럴.js   | 템플릿 리터럴                     |
| 2\_삼항연산자.js     | 삼항 연산자                       |
| 3\_단축평가.js       | 단축 평가                         |
| 4\_구조분해할당.js   | 구조 분해 할당                    |
| 5\_배열메서드.js     | 배열 메서드 (map, filter, find …) |
| 6\_스프레드연산자.js | 스프레드 연산자                   |
| 7\_비동기.js         | Promise / async·await / fetch     |

---

## 💻 frontend

### 기술 스택

- **React 19** — UI 라이브러리
- **Vite** — 개발 서버 및 빌드 도구
- **Tailwind CSS v4** — 스타일링 (`@tailwindcss/vite` 플러그인 방식)
- **lucide-react**, **react-icons** — 아이콘

### 폴더 구조

```
frontend/src/
├── components/
│   ├── Header.jsx         # 상단 네비게이션 (헬스체크 표시 포함)
│   ├── Footer.jsx         # 하단 푸터
│   ├── TeamInfo.jsx       # 팀 소개 섹션
│   ├── TeamMember.jsx     # 팀원 카드 (props로 데이터 전달)
│   ├── TodoItem.jsx       # 할 일 한 건
│   ├── FestivalItem.jsx   # 축제 카드 한 건
│   └── HealthChk.jsx      # 백엔드 /health 호출 → 서버 연결 확인
├── pages/
│   ├── TeamPage.jsx       # 팀 소개 페이지
│   ├── TestPage.jsx       # 이벤트 처리 · 제어 컴포넌트 연습
│   ├── CounterPage.jsx    # useState 기본 (증가/감소/초기화)
│   ├── TodoList.jsx       # 투두리스트 (추가/완료/삭제/필터 + localStorage)
│   └── FestivalPage.jsx   # 축제 목록 (useEffect + fetch로 API 연동)
├── data/teamMember.js     # 팀원 더미 데이터
├── App.jsx                # 루트 컴포넌트 (표시할 페이지를 여기서 교체)
└── main.jsx               # 진입점
```

> 💡 화면을 바꿔 보려면 `App.jsx`에서 `<FestivalPage />` 자리를
> `<TeamPage />`, `<TodoList />`, `<CounterPage />` 등으로 바꿔 주세요.

### 실행 방법

```bash
cd frontend
npm install      # 최초 1회, 의존성 설치
npm run dev      # 개발 서버 실행
```

실행 후 터미널에 표시되는 주소(기본 http://localhost:5173)로 접속합니다.

### 기타 명령어

```bash
npm run build    # 배포용 빌드
npm run preview  # 빌드 결과 미리보기
npm run lint     # 코드 검사 (ESLint)
```

---

## ⚙️ backend

FastAPI로 만든 REST API 서버입니다. 공공데이터포털의 **전국문화축제 표준데이터**를
내려받아 SQLite에 저장하고, 조건 검색·페이지네이션이 가능한 API로 제공합니다.

### 기술 스택

- **FastAPI** — 웹 프레임워크 (자동 문서 `/docs` 제공)
- **SQLAlchemy** — ORM (파이썬 클래스 ↔ DB 테이블 연결)
- **SQLite** — 파일 하나로 동작하는 가벼운 DB (`festivals.db`)
- **httpx** — 외부 API 호출
- **python-dotenv** — `.env`에서 API 키 불러오기

### 폴더 구조

```
backend/
├── main.py              # 앱 생성 · CORS 설정 · 기본/연습용 라우트
├── database.py          # DB 연결(engine, SessionLocal) + Festival 모델
├── schemas.py           # 응답 형태 정의 (Pydantic)
├── routers/
│   └── festivals.py     # /festivals 관련 API 모음
├── requirements.txt
├── .env                 # FESTIVAL_SERVICE_KEY (git에 올리지 않음)
└── festivals.db         # SQLite 데이터 파일
```

### API 목록

| 메서드 | 경로                     | 설명                                         |
| ------ | ------------------------ | -------------------------------------------- |
| GET    | `/`                      | 동작 확인용 기본 응답                        |
| GET    | `/health`                | 서버 상태 확인 (프론트 HealthChk에서 사용)   |
| GET    | `/greet/{name}`          | 경로 파라미터 연습                           |
| GET    | `/search/?keyword=&asc=` | 쿼리 파라미터 연습                           |
| GET    | `/festivals`             | 축제 목록 조회 (필터 + 페이지네이션)         |
| GET    | `/festivals/regions`     | 지역별 축제 개수 목록                        |
| GET    | `/festivals/detail/{id}` | 축제 상세 조회                               |
| POST   | `/festivals/sync`        | 공공데이터 API를 호출해 DB에 저장(전체 갱신) |

**`GET /festivals` 쿼리 파라미터**

| 이름            | 예시                 | 설명                        |
| --------------- | -------------------- | --------------------------- |
| `region`        | 서울특별시           | 광역시·도 정확히 일치       |
| `keyword`       | 불꽃                 | 축제명 부분 일치            |
| `date_`         | 2026-08-05           | 그날 열려 있는 축제         |
| `status`        | 진행중 / 예정 / 종료 | 오늘 기준 진행 상태         |
| `page` / `size` | 1 / 20               | 페이지 번호 / 페이지당 개수 |

> 📌 **status(진행 상태)는 DB에 저장하지 않습니다.** 조회 시점의 오늘 날짜와
> 시작일·종료일을 비교해 그때그때 계산합니다(`진행중`, `오늘 종료`, `예정`, `종료`).
> 날짜가 지나면 저장값이 틀려지기 때문입니다.

### 환경변수 설정 ⚠️

`backend/.env` 파일을 만들고 공공데이터포털에서 발급받은 키를 넣습니다.

```env
FESTIVAL_SERVICE_KEY=발급받은_서비스키
```

- `.env`는 `.gitignore`에 등록되어 있어 **깃에 올라가지 않습니다.**
  저장소를 새로 클론한 경우 이 파일은 없으므로 **직접 만들어야 합니다.**
- 키를 코드에 직접 쓰지 말고 반드시 `.env`에서 불러오세요.
- 자세한 발급·작성 방법은 위 [🚀 시작하기 → 4. 환경변수 파일(.env) 만들기](#4-환경변수-파일env-만들기-️-필수) 참고

### 실행 방법

```bash
cd backend
python -m venv .venv              # 최초 1회, 가상환경 생성
.venv\Scripts\activate            # (Windows) 가상환경 활성화
pip install -r requirements.txt   # 최초 1회, 패키지 설치

fastapi dev main.py               # 개발 서버 실행 (http://127.0.0.1:8000)
```

- API 자동 문서: http://127.0.0.1:8000/docs
- 최초 실행 후 데이터가 비어 있다면 `/docs`에서 **POST `/festivals/sync`** 를 한 번 실행해
  공공데이터를 내려받아 저장하세요.

---

## 🔗 프론트엔드 ↔ 백엔드 연결

```
React (localhost:5173)  ──fetch──▶  FastAPI (127.0.0.1:8000)  ──httpx──▶  공공데이터포털 API
        ▲                                    │
        └────────── JSON 응답 ───────────────┘                        SQLite (festivals.db)
```

- 포트가 다르면 브라우저가 요청을 막기 때문에(**CORS**), `main.py`에서
  `http://localhost:5173`, `http://127.0.0.1:5173`을 허용하도록 설정해 두었습니다.
- 두 서버를 **각각 다른 터미널에서 동시에** 실행해야 화면에 데이터가 나옵니다.

### 실행 순서 요약

```bash
# 터미널 1 — 백엔드
cd backend && .venv\Scripts\activate && fastapi dev main.py

# 터미널 2 — 프론트엔드
cd frontend && npm run dev
```

---

## 🧭 학습 진행 순서

1. **JS연습** — 자바스크립트 문법 (템플릿 리터럴 → 비동기)
2. **frontend** — 컴포넌트 · props → useState(Counter, Todo) → useEffect + fetch
3. **backend** — FastAPI 기본 라우트 → 파라미터 → 외부 API 호출 → DB 저장 → 라우터 분리
4. **연동** — CORS 설정 후 React에서 FastAPI 데이터 표시 (FestivalPage)
