# AI 목표 달성 도우미

AI 기반 목표 관리 및 코칭 웹 애플리케이션입니다.

## 프로젝트 개요

사용자가 개인 목표를 설정하고 추적하며, AI 코칭을 통해 목표 달성을 지원하는 웹 애플리케이션입니다.

## 주요 기능

### 1. 인증 시스템
- 이메일 기반 로그인/회원가입
- 가상 인증 (데모 계정: test@example.com / password)

### 2. 대시보드
- 전체 목표 진행률 요약
- 주간 활동 차트
- 최근 목표 리스트
- AI 인사이트 카드

### 3. 목표 관리 (CRUD)
- 목표 생성 (정량적/습관형)
- 목표 조회 (필터링, 정렬)
- 목표 수정
- 목표 삭제
- 일일 기록 추가

### 4. 시각화 및 통계
- 주간 활동 바 차트
- 카테고리별 분포 파이 차트
- 월별 추이 라인 차트
- 목표별 진행률 바 차트
- 활동 히트맵

### 5. AI 코칭
- 대화형 인터페이스
- 목표 관련 조언 및 피드백
- 대화 기록 저장
- 추천 질문 제공

## 기술 스택

- **Frontend Framework**: Next.js 15.5.4 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 프로젝트 구조

```
ai-goal-assistant/
├── app/                      # Next.js App Router
│   ├── page.tsx             # 홈페이지 (리다이렉트)
│   ├── login/               # 로그인 페이지
│   ├── register/            # 회원가입 페이지
│   ├── dashboard/           # 대시보드
│   ├── goals/               # 목표 관리
│   │   ├── page.tsx        # 목표 리스트
│   │   ├── new/            # 목표 생성
│   │   └── [id]/           # 목표 상세
│   ├── statistics/          # 통계 페이지
│   └── ai-coach/            # AI 코칭 페이지
├── components/
│   └── layout/
│       └── DashboardLayout.tsx  # 공통 레이아웃
├── store/
│   └── useStore.ts          # Zustand 전역 상태
├── types/
│   └── index.ts             # TypeScript 타입 정의
├── lib/
│   └── mockData.ts          # 가상 데이터 및 헬퍼 함수
└── public/                  # 정적 파일
```

## 시작하기

### 설치

```bash
cd ai-goal-assistant
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 빌드

```bash
npm run build
```

### 프로덕션 실행

```bash
npm start
```

## 데모 계정

- 이메일: test@example.com
- 비밀번호: password

## 데이터 저장

현재 버전은 **가상 데이터**를 사용하며, Zustand를 통해 클라이언트 메모리에 저장됩니다.
- 로그인 시 localStorage에 인증 정보 저장
- 페이지 새로고침 시 데이터는 초기화됨

## 주요 페이지

### 1. 로그인 페이지 (`/login`)
- 이메일/비밀번호 입력
- 데모 계정 정보 제공

### 2. 대시보드 (`/dashboard`)
- 통계 카드 (진행 중, 완료, 평균 진행률, 주간 활동)
- 주간 활동 차트
- 목표 리스트
- AI 인사이트

### 3. 목표 관리 (`/goals`)
- 목표 리스트 (전체/진행중/완료 필터)
- 목표 생성 (`/goals/new`)
- 목표 상세 (`/goals/[id]`)

### 4. 통계 (`/statistics`)
- 카테고리별 분포
- 월별 추이
- 목표별 진행률
- 활동 히트맵

### 5. AI 코칭 (`/ai-coach`)
- 대화 인터페이스
- 가상 AI 응답
- 대화 기록 관리

## 다음 단계 (백엔드 개발)

현재는 프론트엔드 프로토타입입니다. 실제 운영을 위해 다음 단계가 필요합니다:

### 1. 백엔드 API 개발
- **기술 스택**: Node.js + Express 또는 NestJS
- **데이터베이스**: PostgreSQL (Supabase 추천)
- **ORM**: Prisma

### 2. 인증 시스템
- JWT 기반 인증
- 비밀번호 해싱 (bcrypt)
- 이메일 인증
- 세션 관리

### 3. API 엔드포인트
```
POST   /api/auth/register      - 회원가입
POST   /api/auth/login         - 로그인
POST   /api/auth/logout        - 로그아웃

GET    /api/goals              - 목표 리스트
POST   /api/goals              - 목표 생성
GET    /api/goals/:id          - 목표 상세
PUT    /api/goals/:id          - 목표 수정
DELETE /api/goals/:id          - 목표 삭제

GET    /api/goals/:id/records  - 일일 기록 조회
POST   /api/goals/:id/records  - 일일 기록 추가

GET    /api/conversations      - 대화 리스트
POST   /api/conversations      - 대화 생성
POST   /api/conversations/:id/messages - 메시지 추가
```

### 4. AI 통합
- OpenAI API 연동 (GPT-4)
- 프롬프트 엔지니어링
- 토큰 사용량 관리

### 5. 배포
- **Frontend**: Vercel
- **Backend**: Railway, Render, AWS
- **Database**: Supabase, Railway
- 환경 변수 설정

### 6. 추가 기능
- 푸시 알림
- 이메일 리마인더
- 소셜 로그인 (Google, 카카오)
- 데이터 내보내기
- 다크 모드

## 환경 변수 (향후 필요)

```env
# Database
DATABASE_URL=

# JWT
JWT_SECRET=
JWT_EXPIRES_IN=7d

# OpenAI
OPENAI_API_KEY=

# Email
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
```

## 라이선스

MIT

## 문의

프로젝트 관련 문의사항은 이슈를 등록해주세요.
