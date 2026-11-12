이 프로젝트는 모투 관리자 페이지입니다. Vite + React + TypeScript SPA이고, 데스크톱(1440px) 기준으로 디자인되어 있습니다.
앱(motu-frontend, Expo)과 같은 팀 컨벤션을 따르되, 웹 환경에 맞게 바꾼 부분은 아래에 적어 두었습니다.

## 명령어

```bash
npm install          # 의존성 설치
npm run dev          # 개발 서버 실행
npm run lint         # 린트
npm run typecheck    # 타입 체크
npm run format       # Prettier 포맷
npm run build        # 타입 체크 + 프로덕션 빌드
```

작업을 완료하기 전에 반드시 린트와 타입 체크를 통과시킵니다.

## 참고 자료

- 디자인: Figma `2차 개발 디자인` 섹션의 `15 · 관리자 공통 컴포넌트` ~ `23 · 관리자 회원 관리`
- API 문서: https://nginx-production-3e28.up.railway.app/api/docs (OpenAPI JSON: `/api/docs-json`)
- 코드·Git 컨벤션은 Notion에서 관리합니다(motu-frontend `README.md`의 컨벤션 섹션 참고).

## 화면 이동 & 라우팅

- 라우트는 `src/routes/router.tsx`에서 정의하고, 경로 상수는 `src/constants/routes.ts`에 둡니다.
- 화면(페이지) 파일은 `src/pages/<도메인>/<이름>Page.tsx`에 두고 `export default` 합니다.
- `Link`, `NavLink`, `useNavigate`, `useParams`는 `react-router`에서 import 합니다. (`react-router-dom` 아님)
- 로그인이 필요한 화면은 `ProtectedRoute` → `AdminLayout` 아래에 추가하고, 헤더 제목은 `handle: title('제목')`으로 지정합니다.
- 사이드바 메뉴(7개, 순서 고정)는 `src/constants/menus.ts`에서 관리합니다.

## 코드 컨벤션 요약

**구조**

- `src/pages/`에는 화면 파일만 둡니다. 화면 전용 컴포넌트는 `src/components/<도메인>/`에 둡니다.
- 여러 화면에서 쓰는 컴포넌트는 `src/components/common/`에 둡니다. 새로 만들기 전에 이미 있는 공통 컴포넌트를 먼저 확인합니다.
- import는 절대경로 `@/`를 사용합니다. → `import { api } from '@/apis/instance';`

**네이밍**

| 대상 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 파일 / 컴포넌트 | PascalCase | `StatCard.tsx` |
| 페이지 파일 | PascalCase + `Page` | `ListingsPage.tsx` |
| 페이지 폴더 | kebab-case | `pages/not-found/` |
| 그 외 파일 (훅, 유틸, api 등) | camelCase | `formatPrice.ts` |
| 상수 | UPPER_SNAKE_CASE | `SIDEBAR_MENUS` |
| 타입 | PascalCase, `I` 접두사 X | `ButtonProps` |
| Zustand 스토어 / Query 훅 | `use<Name>Store` / `use<Name>Query`, `use<Name>Mutation` | `useAuthStore`, `useLogoutMutation` |
| Zod 스키마 | `<name>Schema` | `loginSchema` |
| 이벤트 핸들러 | 내부 `handle~`, props `on~` | `handleClick`, `onClick` |
| boolean | `is` / `has` / `can` 접두사 | `isSelected` |

**컴포넌트 · TypeScript**

- 함수형 컴포넌트만 사용합니다. 페이지는 `export default`, 그 외는 named export를 사용합니다.
- Props 타입은 `<컴포넌트명>Props`로 컴포넌트 위에 선언합니다.
- `any` 대신 `unknown`을 쓰고 좁혀서 사용합니다. 객체 타입은 `type`을 기본으로 씁니다.
- 타입만 가져올 때는 `import type`을 사용합니다. (ESLint `consistent-type-imports`)
- 폼/요청 데이터 타입은 Zod 스키마에서 추론합니다. → `z.infer<typeof loginSchema>`

**스타일링**

- Tailwind `className`으로 스타일링합니다. 인라인 `style`은 동적인 값에만 씁니다.
- 색상·텍스트 스타일은 `tailwind.config.js` 토큰(`motu-*`, `text-title-lg` 등)을 사용하고 임의값(`bg-[#123456]`)은 피합니다.
- 조건부 클래스는 `cn()`(`src/utils/cn.ts`)으로 합칩니다.
- 아이콘은 Figma에서 내려받은 SVG를 `src/assets/icons/`에 두고 `<img>`로 사용합니다. 활성/비활성 색이 다르면 별도 파일로 둡니다.

**상태 · API · 폼**

- 서버 데이터는 TanStack Query, 여러 화면이 공유하는 클라이언트 상태는 Zustand, 폼 입력값은 React Hook Form, 컴포넌트 내부 상태는 `useState`로 관리합니다.
- 서버 데이터를 Zustand에 복사해서 저장하지 않습니다.
- axios 인스턴스는 `src/apis/instance.ts` 하나만 씁니다. 흐름은 `apis/`(요청 함수) → `queries/`(Query 훅) → 컴포넌트이고, 컴포넌트에서 axios를 직접 호출하지 않습니다.
- 서버 응답은 `{ success, data }`로 감싸져 있으므로 요청 함수에서 `data.data`를 반환합니다. 에러 메시지는 `getApiErrorMessage()`로 꺼냅니다.
- 폼은 React Hook Form + `zodResolver`로 작성합니다. 스키마는 `src/schemas/`에 두고 에러 메시지는 한글로 씁니다.

**보안**

- Access 토큰은 메모리, Refresh 토큰은 `sessionStorage`에만 보관합니다(`src/utils/tokenStorage.ts`). `localStorage`나 Zustand persist에 토큰을 저장하지 않습니다.
- `VITE_` 환경 변수는 브라우저 번들에 포함되므로 비밀키를 넣지 않습니다.

**포맷**

- 포맷은 Prettier 결과를 그대로 따릅니다(Tailwind 클래스 순서는 `prettier-plugin-tailwindcss`가 정렬).
