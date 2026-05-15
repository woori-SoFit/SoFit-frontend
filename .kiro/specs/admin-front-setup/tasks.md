# Implementation Plan: admin-front-setup

## Overview

admin-front React 프로젝트의 초기 세팅을 구현한다. Vite + React + TypeScript 기반 프로젝트에 react-router-dom, @tanstack/react-query, zustand, axios 등 핵심 의존성을 설치하고, 디렉토리 구조 생성, 디자인 토큰 정의, 공통 컴포넌트(Sidebar, AdminLayout), 라우터, 페이지(로그인, 대시보드, Placeholder), 상태 관리, 테스트 환경을 순차적으로 구성한다.

## Tasks

- [x] 1. 의존성 설치 및 빌드 설정
  - [x] 1.1 핵심 라이브러리 설치
    - `react-router-dom`, `@tanstack/react-query`, `zustand`, `axios`를 dependencies에 추가
    - `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`을 devDependencies에 추가
    - package.json scripts에 `"test": "vitest --run"` 명령어 추가
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 13.2_

  - [x] 1.2 Vite path alias 및 테스트 환경 설정
    - vite.config.ts에 `resolve.alias`로 `@/` → `src/` 매핑 추가
    - vite.config.ts에 `test` 블록 추가 (environment: "jsdom", globals: true, setupFiles: "./src/setupTests.ts")
    - tsconfig.app.json에 `paths` 설정 추가 (`"@/*": ["./src/*"]`)
    - _Requirements: 13.1_

- [x] 2. 디렉토리 구조 및 기반 파일 생성
  - [x] 2.1 src 하위 디렉토리 및 기반 파일 생성
    - `src/api/index.ts` (barrel export 빈 파일)
    - `src/components/common/` 디렉토리 생성
    - `src/constants/queryKeys.ts` 생성
    - `src/pages/auth/`, `src/pages/dashboard/`, `src/pages/placeholder/` 디렉토리 생성
    - `src/router/routes.tsx` 생성
    - `src/stores/authStore.ts` 생성
    - `src/types/index.ts` 생성 (MenuItem 인터페이스 정의)
    - `src/setupTests.ts` 생성 (`import "@testing-library/jest-dom"`)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 13.3_

- [ ] 3. 디자인 토큰 및 스타일 설정
  - [x] 3.1 index.css에 @theme 디자인 토큰 정의
    - `@import "tailwindcss"` 유지
    - `@theme` 블록에 brand colors, sidebar colors, semantic colors, neutral, text, border, typography, radius, shadow 토큰 정의
    - html/body/#root 높이 100% 설정, Pretendard 폰트 패밀리 설정
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [x] 4. API 및 상태 관리 설정
  - [x] 4.1 Axios 인스턴스 생성
    - `src/api/axiosInstance.ts` 생성
    - baseURL을 `import.meta.env.VITE_API_BASE_URL`에서 읽기
    - `withCredentials: true`, `Content-Type: application/json` 설정
    - 401 응답 인터셉터에서 `/login`으로 리다이렉트
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [x] 4.2 QueryClient 설정 및 main.tsx 엔트리포인트 구성
    - QueryClient 생성 (staleTime: 300000, retry: 1, refetchOnWindowFocus: false)
    - QueryClientProvider로 앱 감싸기
    - RouterProvider에 router 전달
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [x] 4.3 Zustand store 및 queryKeys 상수 구현
    - `src/stores/authStore.ts`에 useAuthStore 구현 (isLoginModalOpen 상태)
    - `src/constants/queryKeys.ts`에 AUTH_KEYS, LOAN_KEYS 상수 정의
    - _Requirements: 12.1, 12.2, 12.3_

- [ ] 5. Checkpoint
  - 빌드(`tsc -b && vite build`)가 정상 통과하는지 확인. 문제 발생 시 사용자에게 질문.

- [x] 6. 공통 컴포넌트 구현
  - [x] 6.1 Sidebar 컴포넌트 구현
    - `src/components/common/Sidebar.tsx` 생성
    - 상단 로고(`@/assets/main-logo.svg`), 4개 메뉴(대출 현황 대시보드, 사용자 관리, API 로그, S등급 배치 관리)
    - NavLink로 라우팅, 활성 메뉴 시각적 구분 (bg-white/10)
    - 진한 남색 배경(bg-sidebar-dark), 고정 너비 240px
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8_

  - [x] 6.2 AdminLayout 컴포넌트 구현
    - `src/components/common/AdminLayout.tsx` 생성
    - 좌측 Sidebar 고정 배치, 우측 `<Outlet />` 콘텐츠 영역
    - flex h-screen 레이아웃, 콘텐츠 영역 흰색 배경
    - 반응형 브레이크포인트 없이 데스크톱 전용
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 7. 페이지 구현
  - [x] 7.1 라우터 구성
    - `src/router/routes.tsx`에 createBrowserRouter 정의
    - `/login` → LoginPage (AdminLayout 미적용)
    - `/` → AdminLayout 적용, index → Navigate to /dashboard
    - `/dashboard`, `/users`, `/api-logs`, `/batch` 경로 매핑
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_

  - [x] 7.2 LoginPage 구현
    - `src/pages/auth/LoginPage.tsx` 생성
    - 독립 전체 화면, 중앙 정렬 로그인 폼
    - 로고, 아이디 입력 필드, 비밀번호 입력 필드, 로그인 버튼
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [x] 7.3 DashboardPage 구현
    - `src/pages/dashboard/DashboardPage.tsx` 생성
    - 페이지 제목 "대출 현황 대시보드"
    - 테이블 헤더(신청번호, 사업자명, 상품명, 신청금액, 신청일, 상태)
    - 빈 상태 메시지 "조회된 대출 신청 내역이 없습니다."
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

  - [x] 7.4 Placeholder 페이지 3개 구현
    - `src/pages/placeholder/UsersPage.tsx` — "사용자 관리" 제목 + "준비 중입니다." 메시지
    - `src/pages/placeholder/ApiLogsPage.tsx` — "API 로그" 제목 + "준비 중입니다." 메시지
    - `src/pages/placeholder/BatchPage.tsx` — "S등급 배치 관리" 제목 + "준비 중입니다." 메시지
    - _Requirements: 10.1, 10.2, 10.3_

- [ ] 8. Checkpoint
  - 빌드 및 lint 통과 확인. 모든 라우트가 올바르게 연결되었는지 확인. 문제 발생 시 사용자에게 질문.

- [ ] 9. Final Checkpoint
  - 빌드 성공 확인. 문제 발생 시 사용자에게 질문.

## Notes

- 각 태스크는 특정 requirements를 참조하여 추적 가능
- Checkpoints에서 빌드 실패 시 즉시 수정
- 모든 코드는 TypeScript로 작성
- Tailwind CSS v4 (@tailwindcss/vite 플러그인) 사용 중이므로 @theme 문법 적용
- 테스트 코드는 이번 스펙에서 제외 (추후 별도 진행)
- 브랜치: `feat/SOFIT-60-admin-front-setup`
- 큰 태스크 단위로 커밋 진행

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2"] },
    { "id": 2, "tasks": ["2.1", "3.1"] },
    { "id": 3, "tasks": ["4.1", "4.3"] },
    { "id": 4, "tasks": ["4.2", "6.1"] },
    { "id": 5, "tasks": ["6.2"] },
    { "id": 6, "tasks": ["7.1", "7.2", "7.3", "7.4"] }
  ]
}
```
