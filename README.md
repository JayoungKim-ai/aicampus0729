# aicampus0729

AI campus 학습 및 실습 프로젝트 저장소입니다. 자바스크립트 문법 연습과, React로 만든 팀 소개 웹페이지(TeamFlow)를 포함합니다.

## 📁 폴더 구성

```
aicampus0729/
├── JS연습/          # 자바스크립트 문법 실습 파일
└── frontend/        # React + Vite 팀 소개 웹앱 (TeamFlow)
```

## 📝 JS연습

바닐라 자바스크립트 핵심 문법을 주제별로 연습한 파일들입니다.

| 파일 | 주제 |
| --- | --- |
| 1_템플릿리터럴.js | 템플릿 리터럴 |
| 2_삼항연산자.js | 삼항 연산자 |
| 3_단축평가.js | 단축 평가 |
| 4_구조분해할당.js | 구조 분해 할당 |
| 5_배열메서드.js | 배열 메서드 |
| 6_스프레드연산자.js | 스프레드 연산자 |

## 💻 frontend (TeamFlow)

팀원을 소개하는 반응형 웹페이지입니다.

### 기술 스택

- **React 19**
- **Vite** — 개발 서버 및 빌드 도구
- **Tailwind CSS v4** — 스타일링

### 주요 구조

```
frontend/src/
├── components/      # Header, Footer, TeamInfo, TeamMember
├── pages/           # TeamPage
├── data/            # 팀원 데이터
├── App.jsx          # 루트 컴포넌트
└── main.jsx         # 진입점
```

### 실행 방법

```bash
cd frontend
npm install      # 최초 1회, 의존성 설치
npm run dev      # 개발 서버 실행
```

실행 후 터미널에 표시되는 주소(기본 http://localhost:5173)로 접속하면 됩니다.

### 기타 명령어

```bash
npm run build    # 배포용 빌드
npm run preview  # 빌드 결과 미리보기
npm run lint     # 코드 검사 (ESLint)
```
