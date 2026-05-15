# Design Document: admin-front-setup

## Architecture Overview

admin-front는 데스크톱 전용 관리자 SPA로, 좌측 고정 사이드바(240px) + 우측 콘텐츠 영역의 단일 레이아웃 구조를 사용한다. user-front의 디렉토리 패턴과 기술 스택 구성을 참고하되, 모바일 대응 없이 데스크톱 전용으로 설계한다.

```
┌─────────────────────────────────────────────────────┐
│  Browser (Desktop Only)                             │
├──────────┬──────────────────────────────────────────┤
│          │                                          │
│ Sidebar  │         Content Area (Outlet)            │
│  240px   │                                          │
│  fixed   │   ┌──────────────────────────────────┐   │
│          │   │  Page Component                   │   │
│  Logo    │   │  (DashboardPage, Placeholder...)  │   │
│  Menu×4  │   │                                   │   │
│          │   └──────────────────────────────────┘   │
│          │                                          │
├──────────┴──────────────────────────────────────────┤
│  /login → 독립 전체 화면 (AdminLayout 미적용)        │
└─────────────────────────────────────────────────────┘
```

### 기술 스택

| 영역 | 라이브러리 | 버전 |
|------|-----------|------|
| UI 프레임워크 | React | ^19 |
| 라우팅 | react-router-dom | ^7 |
| 서버 상태 | @tanstack/react-query | ^5 |
| 클라이언트 상태 | zustand | ^5 |
| HTTP 클라이언트 | axios | ^1 |
| 스타일링 | Tailwind CSS (@tailwindcss/vite) | ^4 |
| 테스트 | vitest + @testing-library/react | ^3 / ^16 |
| 빌드 | Vite | ^8 |

---

## Components

### 1. 디렉토리 구조

```
admin-front/src/
├── api/
│   ├── axiosInstance.ts      # 공통 Axios 인스턴스
│   └── index.ts              # API 함수 barrel export
├── components/
│   └── common/
│       ├── AdminLayout.tsx    # 사이드바 + 콘텐츠 레이아웃
│       └── Sidebar.tsx        # 좌측 고정 사이드바
├── constants/
│   └── queryKeys.ts          # React Query 캐시 키 상수
├── pages/
│   ├── auth/
│   │   └── LoginPage.tsx     # 로그인 페이지
│   ├── dashboard/
│   │   └── DashboardPage.tsx # 대출 현황 대시보드
│   └── placeholder/
│       ├── UsersPage.tsx     # 사용자 관리 placeholder
│       ├── ApiLogsPage.tsx   # API 로그 placeholder
│       └── BatchPage.tsx     # S등급 배치 관리 placeholder
├── router/
│   └── routes.tsx            # createBrowserRouter 라우트 정의
├── stores/
│   └── authStore.ts          # 인증 관련 클라이언트 상태
├── types/
│   └── index.ts              # 공통 타입 정의
├── assets/
│   └── main-logo.svg         # (기존) 로고 이미지
├── index.css                 # @theme 디자인 토큰 + 기본 스타일
├── main.tsx                  # 엔트리포인트 (Provider 구성)
└── setupTests.ts             # 테스트 전역 설정
```

### 2. AdminLayout 컴포넌트

데스크톱 전용 단일 레이아웃. Sidebar를 좌측에 고정 배치하고, 우측에 `<Outlet />`으로 페이지 콘텐츠를 렌더링한다.

```tsx
// components/common/AdminLayout.tsx
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export function AdminLayout() {
  return (
    <div className="flex h-screen">
      {/* 좌측 고정 사이드바 */}
      <Sidebar />

      {/* 우측 콘텐츠 영역 */}
      <main className="flex-1 overflow-y-auto bg-white">
        <Outlet />
      </main>
    </div>
  );
}
```

### 3. Sidebar 컴포넌트

진한 남색 배경의 고정 사이드바. 상단에 로고, 하단에 4개 메뉴를 렌더링한다. 현재 경로에 따라 활성 메뉴를 시각적으로 구분한다.

```tsx
// components/common/Sidebar.tsx
import { NavLink } from "react-router-dom";
import mainLogo from "@/assets/main-logo.svg";

interface MenuItem {
  label: string;
  path: string;
}

const MENU_ITEMS: MenuItem[] = [
  { label: "대출 현황 대시보드", path: "/dashboard" },
  { label: "사용자 관리", path: "/users" },
  { label: "API 로그", path: "/api-logs" },
  { label: "S등급 배치 관리", path: "/batch" },
];

export function Sidebar() {
  return (
    <aside className="w-60 h-screen bg-sidebar-dark flex flex-col shrink-0">
      {/* 로고 영역 */}
      <div className="p-6">
        <img src={mainLogo} alt="SoFit 로고" className="h-8" />
      </div>

      {/* 메뉴 네비게이션 */}
      <nav className="flex-1 px-3 mt-4">
        {MENU_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
```

### 4. LoginPage 컴포넌트

AdminLayout 없이 독립 전체 화면으로 렌더링. 중앙 정렬된 로그인 폼(로고, 아이디, 비밀번호, 로그인 버튼)을 표시한다.

```tsx
// pages/auth/LoginPage.tsx
import mainLogo from "@/assets/main-logo.svg";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm p-8 bg-white rounded-xl shadow-card">
        {/* 로고 */}
        <div className="flex justify-center mb-8">
          <img src={mainLogo} alt="SoFit 로고" className="h-10" />
        </div>

        {/* 로그인 폼 */}
        <form className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-text-secondary mb-1">
              아이디
            </label>
            <input
              id="username"
              type="text"
              placeholder="아이디를 입력하세요"
              className="w-full px-4 py-3 border border-border-default rounded-lg text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-1">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              className="w-full px-4 py-3 border border-border-default rounded-lg text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors"
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  );
}
```

### 5. DashboardPage 컴포넌트

대출 현황 대시보드. 테이블 헤더와 빈 상태 메시지를 포함한 목업 테이블을 렌더링한다.

```tsx
// pages/dashboard/DashboardPage.tsx
const TABLE_COLUMNS = [
  "신청번호",
  "사업자명",
  "상품명",
  "신청금액",
  "신청일",
  "상태",
];

export default function DashboardPage() {
  // TODO: React Query로 대출 신청 목록 조회
  const applications: unknown[] = [];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-text-primary mb-6">
        대출 현황 대시보드
      </h1>

      <div className="bg-white rounded-lg border border-border-default overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-border-default">
            <tr>
              {TABLE_COLUMNS.map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 && (
              <tr>
                <td
                  colSpan={TABLE_COLUMNS.length}
                  className="px-4 py-12 text-center text-sm text-text-disabled"
                >
                  조회된 대출 신청 내역이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

### 6. Placeholder 페이지

미구현 페이지에 제목만 표시하는 공통 패턴.

```tsx
// pages/placeholder/UsersPage.tsx
export default function UsersPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-text-primary">사용자 관리</h1>
      <p className="mt-4 text-sm text-text-secondary">준비 중입니다.</p>
    </div>
  );
}
```

---

## Interfaces

### Router 구성

```tsx
// router/routes.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import { AdminLayout } from "@/components/common/AdminLayout";
import LoginPage from "@/pages/auth/LoginPage";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import UsersPage from "@/pages/placeholder/UsersPage";
import ApiLogsPage from "@/pages/placeholder/ApiLogsPage";
import BatchPage from "@/pages/placeholder/BatchPage";

export const router = createBrowserRouter([
  // 로그인 — AdminLayout 미적용
  { path: "/login", element: <LoginPage /> },

  // 인증된 관리자 화면 — AdminLayout 적용
  {
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/users", element: <UsersPage /> },
      { path: "/api-logs", element: <ApiLogsPage /> },
      { path: "/batch", element: <BatchPage /> },
    ],
  },
]);
```

### Axios 인스턴스

```typescript
// api/axiosInstance.ts
import axios, { type AxiosError } from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 401 응답 시 로그인 페이지로 리다이렉트
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
```

### QueryKeys 상수

```typescript
// constants/queryKeys.ts
export const AUTH_KEYS = {
  me: ["auth", "me"] as const,
} as const;

export const LOAN_KEYS = {
  all: ["loans"] as const,
  list: () => [...LOAN_KEYS.all, "list"] as const,
  detail: (id: number) => [...LOAN_KEYS.all, "detail", id] as const,
  applications: () => [...LOAN_KEYS.all, "applications"] as const,
  application: (id: number) => [...LOAN_KEYS.all, "application", id] as const,
} as const;
```

### Zustand Store

```typescript
// stores/authStore.ts
import { create } from "zustand";

interface AuthState {
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoginModalOpen: false,
  openLoginModal: () => set({ isLoginModalOpen: true }),
  closeLoginModal: () => set({ isLoginModalOpen: false }),
}));
```

---

## Data Models

### MenuItem 타입

```typescript
// types/index.ts
export interface MenuItem {
  label: string;
  path: string;
}
```

### QueryClient 설정

```typescript
// main.tsx 내 QueryClient 설정
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,       // 5분
      retry: 1,                         // 1회 재시도
      refetchOnWindowFocus: false,      // 포커스 시 refetch 비활성화
    },
  },
});
```

---

## Design Tokens (index.css)

```css
@import "tailwindcss";

html, body, #root {
  height: 100%;
}

body {
  font-family: "Pretendard", "Apple SD Gothic Neo", -apple-system,
    BlinkMacSystemFont, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

@theme {
  /* ── Brand Colors ── */
  --color-primary: #0067ac;
  --color-primary-light: #3389c4;
  --color-primary-dark: #004f85;

  /* ── Sidebar ── */
  --color-sidebar-dark: #1b2a4a;
  --color-sidebar-hover: rgba(255 255 255 / 0.05);
  --color-sidebar-active: rgba(255 255 255 / 0.1);

  /* ── Semantic Colors ── */
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;

  /* ── Neutral ── */
  --color-gray-50: #f8fafc;
  --color-gray-100: #f1f5f9;
  --color-gray-200: #e2e8f0;
  --color-gray-300: #cbd5e1;
  --color-gray-400: #94a3b8;
  --color-gray-500: #64748b;
  --color-gray-600: #475569;
  --color-gray-700: #334155;
  --color-gray-800: #1e293b;
  --color-gray-900: #0f172a;

  /* ── Background ── */
  --color-bg-base: #f8fafc;
  --color-bg-surface: #ffffff;

  /* ── Text ── */
  --color-text-primary: #0f172a;
  --color-text-secondary: #475569;
  --color-text-disabled: #94a3b8;
  --color-text-inverse: #ffffff;

  /* ── Border ── */
  --color-border-default: #e2e8f0;
  --color-border-focus: #0067ac;

  /* ── Typography ── */
  --font-sans: "Pretendard", "Apple SD Gothic Neo", sans-serif;

  /* ── Border Radius ── */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;

  /* ── Shadow ── */
  --shadow-card: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
}
```

---

## Error Handling

### Axios 인터셉터 에러 처리

| 상태 코드 | 동작 |
|-----------|------|
| 401 Unauthorized | `/login`으로 리다이렉트 |
| 기타 에러 | `Promise.reject(error)` — 호출부에서 개별 처리 |

### React Query 에러 처리

- `retry: 1` — 네트워크 오류 시 1회 자동 재시도
- 개별 쿼리/뮤테이션에서 `onError` 콜백으로 UI 피드백 처리 (추후 구현)

---

## Testing Strategy

### 테스트 환경 구성

- **Runner**: Vitest (jsdom 환경)
- **렌더링**: @testing-library/react
- **Matcher**: @testing-library/jest-dom (setupTests.ts에서 전역 import)
- **설정 위치**: vite.config.ts `test` 블록

### 테스트 범위

이 초기 세팅 단계에서는 다음을 example-based 단위 테스트로 검증한다:

1. **Sidebar 렌더링**: 4개 메뉴 항목 모두 렌더링 확인, 활성 메뉴 스타일 확인
2. **라우팅**: 각 경로 접근 시 올바른 페이지 렌더링 확인, / → /dashboard 리다이렉트 확인
3. **LoginPage**: 아이디/비밀번호 입력 필드 및 로그인 버튼 존재 확인
4. **DashboardPage**: 테이블 헤더 렌더링, 빈 상태 메시지 표시 확인
5. **AxiosInstance**: baseURL, withCredentials, 401 리다이렉트 동작 확인

---

## Correctness Properties

*이 프로젝트는 UI 초기 세팅으로, 순수 함수나 데이터 변환 로직이 포함되지 않는다. 모든 요구사항이 설정 확인(SMOKE) 또는 특정 UI 렌더링 확인(EXAMPLE)에 해당하므로, property-based testing에 적합한 요구사항이 없다.*

*테스트는 example-based 단위 테스트로 충분히 커버된다.*

No testable properties — 이 초기 세팅 스펙의 모든 요구사항은 고정된 설정값 확인이나 특정 UI 요소 존재 확인으로, 입력에 따라 동작이 달라지는 범용 속성(property)이 존재하지 않는다.
