# motu-frontend-admin-
2026 마스외전 하반기 프로젝트 모투 관리자 페이지

<br>

## Tech Stack

| 구분 | 사용 기술 |
|------|-----------|
| 빌드 도구 | Vite |
| 프레임워크 | React 19 (SPA) |
| 언어 | TypeScript |
| 화면 이동 | React Router |
| 스타일링 | Tailwind CSS v3 |
| 클라이언트 상태 관리 | Zustand |
| 서버 상태 관리 | TanStack Query |
| HTTP 요청 | Axios |
| 폼 관리 | React Hook Form |
| 유효성 검증 | Zod |
| 린트 / 포맷 | ESLint + Prettier |

<br>

## 시작하기

```bash
# 1. 의존성 설치
npm install

# 2. 환경 변수 설정 (.env 는 커밋하지 않습니다)
cp .env.example .env

# 3. 개발 서버 실행
npm run dev
```

- 환경 변수는 `VITE_` 접두사로 작성합니다. 이 값은 브라우저 번들에 포함되므로 비밀키를 넣지 않습니다.
- 로그인 화면 구현 전까지는 로그인 화면의 **개발용: 로그인 없이 둘러보기** 버튼(개발 서버에서만 노출)으로 레이아웃을 확인합니다.

<br>

## 스크립트

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 타입 검사 후 프로덕션 빌드 (`dist/`) |
| `npm run preview` | 빌드 결과물 미리보기 |
| `npm run lint` | ESLint 검사 |
| `npm run typecheck` | 타입 검사 |
| `npm run format` | Prettier 포맷 적용 |
| `npm run format:check` | Prettier 포맷 검사 |

<br>

## 폴더 구조

```
src/
  apis/                 # axios 인스턴스, API 요청 함수
  queries/              # TanStack Query 훅 (useXxxQuery, useXxxMutation)
  stores/               # Zustand 스토어
  schemas/              # Zod 스키마
  components/
    common/             #   공용 컴포넌트 (Figma 15 · 관리자 공통 컴포넌트)
    layout/             #   AdminLayout(헤더·사이드바), AuthLayout
    <도메인>/           #   화면 전용 컴포넌트 (listing/, member/ ...)
  pages/                # 화면 (라우트 단위)
  routes/               # 라우터 설정, 인증 가드
  hooks/                # 공용 커스텀 훅
  constants/            # 상수 (라우트 경로, 사이드바 메뉴 등)
  types/                # 공용 타입
  utils/                # 유틸 함수
  assets/               # 아이콘 등 정적 파일
  styles/               # 전역 CSS
```

- import는 절대경로 `@/`를 사용합니다. → `import { api } from '@/apis/instance';`

<br>

## 라우트

| 경로 | 메뉴 | 화면 |
|------|------|------|
| `/login` | - | 관리자 로그인 |
| `/` | 대시보드 | 운영 현황 |
| `/listings` | 상장 승인 | 상장 신청 목록 |
| `/products` | 상품 관리 | 상장 상품 목록 |
| `/monitoring` | 거래 모니터링 | 거래 및 주문 모니터링 |
| `/notices` | 공지 관리 | 공지 목록 |
| `/admins` | 관리자 계정 | 관리자 계정 목록 |
| `/members` | 회원 관리 | 회원 관리 |

- 경로는 `src/constants/routes.ts`, 사이드바 메뉴는 `src/constants/menus.ts`에서 관리합니다.
- 헤더의 페이지 제목은 `src/routes/router.tsx`의 라우트 `handle.title`로 지정합니다.
- 로그인이 필요한 화면은 `ProtectedRoute` 아래에, 로그인 전 화면은 `PublicOnlyRoute` 아래에 둡니다.

<br>

## 인증 · 토큰

서버(`/api/auth/*`)는 토큰을 응답 body로 내려줍니다(쿠키 미사용). 관리자도 공용 로그인 API를 쓰고 `user.role === 'ADMIN'`으로 구분합니다.

| 토큰 | 보관 위치 | 이유 |
|------|-----------|------|
| Access 토큰 | 메모리 (`tokenStorage`) | 저장소에 남기지 않아 XSS로 탈취되기 어렵습니다. |
| Refresh 토큰 | `sessionStorage` | 탭을 닫으면 사라지고, 새로고침 시 세션 복구에만 씁니다. |

- `localStorage`나 Zustand persist에는 토큰을 저장하지 않습니다.
- 새로고침하면 `useRestoreSession`이 Refresh 토큰으로 Access 토큰을 다시 받습니다.
- API가 `AUTH_TOKEN_EXPIRED`로 401을 주면 `apis/instance.ts`의 인터셉터가 한 번만 재발급하고 원래 요청을 다시 보냅니다. 재발급에 실패하면 로그인 화면으로 이동합니다.

<br>

## 컨벤션

코드·Git 컨벤션은 motu-frontend와 같습니다. 요약은 `AGENTS.md`를 참고합니다.

### 폰트

Pretendard(`pretendard` 패키지)를 `src/main.tsx`에서 불러오고 `tailwind.config.js`의 `fontFamily.sans`로 등록했습니다. 굵기는 Tailwind 기본 클래스(`font-medium`, `font-bold`)를 사용합니다.

### 텍스트 스타일

Figma 관리자 디자인의 텍스트 스타일을 `fontSize` 토큰으로 등록했습니다.

| 토큰 | 크기 / 행간 | 굵기 |
|------|-------------|------|
| `text-display-lg` | 24 / 32 | Bold |
| `text-title-lg` | 18 / 24 | Bold |
| `text-title-md` | 16 / 22 | Bold |
| `text-title-sm` | 15 / 20 | Bold |
| `text-body-md` | 14 / 20 | Medium |
| `text-body-sm` | 13 / 18 | Medium |
| `text-label-md` | 12 / 16 | Medium |
| `text-label-sm` | 11 / 14 | Medium |

```tsx
<h2 className="text-title-lg font-bold text-motu-text-primary">거래량 추이</h2>
```

### 색상

색상 토큰은 `tailwind.config.js`의 `theme.extend.colors`에 등록되어 있고, 앱(motu-frontend)과 같은 이름을 씁니다. 임의값(`bg-[#123456]`)은 피합니다.

| Figma 변수 | 토큰 | 색상 |
|------------|------|------|
| `cta/default` | `motu-black` | `#2E3138` |
| `text/primary` | `motu-text-primary` | `#191F28` |
| `text/secondary` | `motu-text-secondary` | `#4E5968` |
| `text/tertiary` | `motu-text-tertiary` | `#8B95A1` |
| `surface/page` | `motu-bg` | `#F2F4F6` |
| `brand/surface` | `motu-bg-secondary` | `#EDEFF2` |
| `accent/default` | `motu-tonal` | `#D9DDE3` |
| `border/default`, `surface/disabled` | `motu-border` | `#E5E8EB` |
| `cta/neutral` | `motu-grey-chip` | `#E8ECF0` |
| `danger/default` | `motu-btn-red` | `#E5484D` |
| `danger/surface` | `motu-red-light` | `#FDECEE` |
| `success/default` | `motu-success` | `#1A7F5A` |
| `success/surface` | `motu-success-light` | `#E6F4EE` |
| `up/default` | `motu-red` | `#F04452` |
| `blue-500` | `motu-blue` | `#2175F3` |

### 공통 컴포넌트

`src/components/common/`에 Figma `15 · 관리자 공통 컴포넌트`를 구현했습니다.

| 컴포넌트 | Figma | 비고 |
|----------|-------|------|
| `Button` | admin/button | `variant`: primary · secondary · danger · neutral, `size`: md · sm, `disabled` |
| `Badge` | admin/badge | `tone`: neutral(접수·검토중) · success(승인·정상) · danger(보완 요청·반려·정지) · muted(임시 저장·종료) |
| `Chip` | admin/chip | 탭·기간 선택용, `isSelected` |
| `Notice` | admin/notice | `tone`: neutral · danger · success |
| `Field` | admin/field | 라벨 + 입력 박스 + 에러 문구 |
| `TextInput` · `Select` · `DateField` · `TextArea` | admin/field 입력 박스 | `readOnly`면 읽기 전용 스타일 |
| `InfoRow` | admin/info-row | `<dl>` 안에서 사용 |
| `StatCard` | admin/stat-card | 지표 카드 |
