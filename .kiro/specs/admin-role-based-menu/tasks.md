# Implementation Plan: admin-role-based-menu

## Overview

SoFit admin-front에 역할 기반 메뉴/접근 제어 시스템을 구현한다. AdminRole 타입 정의, Permission_Config 중앙 설정, 메뉴 필터링 유틸, useAuthMe 훅, RoleGuard 컴포넌트, ForbiddenPage, Sidebar 리팩토링, Placeholder 페이지, 라우터 확장, 그리고 property-based/example-based 테스트를 순차적으로 구현한다.

## Tasks

- [x] 1. 프로젝트 설정 및 타입 정의
  - [x] 1.1 fast-check devDependency 추가
    - `admin-front/package.json`에 `fast-check` 패키지를 devDependencies에 추가하고 `npm install` 실행
    - _Requirements: Testing Strategy_

  - [x] 1.2 AdminRole 타입 및 isValidRole 유틸 정의
    - `src/types/index.ts`에 `AdminRole` 타입, `VALID_ROLES` 상수, `isValidRole()` 타입 가드 함수 추가
    - `AdminRole = 'ADMIN_DEV' | 'ADMIN_BANK_TELLER' | 'ADMIN_BANK_MANAGER'`
    - `isValidRole(value: unknown): value is AdminRole` — VALID_ROLES 배열에 포함 여부로 판단
    - _Requirements: 1.4, 1.5_

  - [x] 1.3 Permission_Config 정의
    - `src/constants/permissions.ts` 파일 생성
    - `MenuItemConfig`, `MenuGroupConfig` 인터페이스 정의
    - `MENU_CONFIG: MenuGroupConfig[]` — 대출/관리/시스템 카테고리별 메뉴 항목과 allowedRoles 정의
    - `ROUTE_PERMISSIONS: Record<string, AdminRole[]>` — 경로별 허용 역할 매핑
    - `ROLE_DISPLAY_NAMES: Record<AdminRole, string>` — 역할 한글 표시명 매핑
    - _Requirements: 3.1, 3.2, 3.3, 2.5_

- [x] 2. 핵심 유틸 및 훅 구현
  - [x] 2.1 getFilteredMenuGroups 유틸 구현
    - `src/utils/menuFilter.ts` 파일 생성
    - `getFilteredMenuGroups(role: AdminRole): MenuGroupConfig[]` 함수 구현
    - MENU_CONFIG에서 각 그룹의 items를 역할 기준으로 필터링, items가 0개인 그룹은 제거
    - _Requirements: 2.1, 3.5, 6.4_

  - [x] 2.2 useAuthMe 커스텀 훅 구현
    - `src/hooks/useAuthMe.ts` 파일 생성
    - React Query `useQuery` 기반으로 `/api/auth/me` 호출
    - queryKey: `AUTH_KEYS.me` 활용
    - `AuthMeResponse` 인터페이스 정의 (`id`, `name`, `role`)
    - `isValidRole()` 검증 포함 — 유효하지 않은 역할이면 에러 처리
    - _Requirements: 1.1, 1.2, 1.3, 1.5_

- [x] 3. Checkpoint - 핵심 유틸/훅 검증
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. UI 컴포넌트 구현
  - [x] 4.1 ForbiddenPage 구현
    - `src/pages/error/ForbiddenPage.tsx` 파일 생성
    - "접근 권한이 없습니다" 메시지 표시
    - "대시보드로 이동" 버튼 (`/dashboard`로 navigate)
    - "이전 페이지" 버튼 (히스토리 존재 시 `history.back()`, 없으면 `/dashboard`)
    - _Requirements: 4.2, 4.3, 4.5_

  - [x] 4.2 RoleGuard 컴포넌트 구현
    - `src/components/common/RoleGuard.tsx` 파일 생성
    - Props: `allowedRoles: AdminRole[]`, `children: React.ReactNode`
    - `useAuthMe` 훅으로 현재 사용자 역할 조회
    - 로딩 중: 로딩 스피너 표시
    - 에러/미인증: `/login` 리다이렉트
    - 역할 미허용: `ForbiddenPage` 렌더링
    - 역할 허용: `children` 렌더링
    - _Requirements: 4.1, 4.4, 4.6, 5.5, 5.6_

  - [x] 4.3 Placeholder 페이지 3개 생성
    - `src/pages/placeholder/ReviewHistoryPage.tsx` — "심사 내역 조회" 제목만 표시
    - `src/pages/placeholder/ManagerApprovalPage.tsx` — "지점장 결재" 제목만 표시
    - `src/pages/placeholder/LoanDetailPage.tsx` — "대출 상세" 제목만 표시 (useParams로 id 표시)
    - _Requirements: 5.1, 5.2, 5.3_

- [x] 5. Sidebar 리팩토링 및 라우터 확장
  - [x] 5.1 Sidebar 리팩토링
    - `src/components/common/Sidebar.tsx` 수정
    - 하드코딩된 `MENU_GROUPS` 제거, `getFilteredMenuGroups(role)` 유틸 사용
    - `useAuthMe` 훅으로 사용자 이름/역할 조회
    - 사이드바 상단에 사용자 이름 + `ROLE_DISPLAY_NAMES[role]` 한글 표시명 렌더링
    - 로딩 중 처리, 에러 시 빈 메뉴 또는 리다이렉트
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 6.1, 6.2, 6.3, 6.4, 6.5_

  - [x] 5.2 라우터 확장
    - `src/router/routes.tsx` 수정
    - 새 라우트 추가: `/review-history`, `/manager-approval`, `/loan/:id`
    - 모든 라우트에 `RoleGuard` 적용 (allowedRoles는 `ROUTE_PERMISSIONS`에서 참조)
    - catch-all 라우트 `*` → `/dashboard` 리다이렉트 추가
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.7_

- [ ] 6. Checkpoint - UI 컴포넌트 및 라우팅 검증
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Property-Based 테스트
  - [ ]* 7.1 isValidRole property 테스트 작성
    - `src/__tests__/isValidRole.property.test.ts` 파일 생성
    - **Property 1: 잘못된 역할 값 거부**
    - 임의의 문자열이 'ADMIN_DEV', 'ADMIN_BANK_TELLER', 'ADMIN_BANK_MANAGER' 중 하나가 아닌 경우 false 반환 검증
    - fast-check `fc.string()` 으로 임의 문자열 생성, 유효 역할 제외 후 `isValidRole` false 확인
    - **Validates: Requirements 1.5**

  - [ ]* 7.2 getFilteredMenuGroups property 테스트 작성
    - `src/__tests__/menuFilter.property.test.ts` 파일 생성
    - **Property 2: 역할별 메뉴 필터링 정확성**
    - 임의의 유효 역할에 대해 반환된 모든 메뉴 항목의 allowedRoles가 해당 역할을 포함하는지 검증
    - Permission_Config에서 해당 역할을 포함하는 모든 항목이 결과에 포함되는지 검증
    - **Validates: Requirements 2.1, 3.5**

  - [ ]* 7.3 MENU_CONFIG 구조 불변 조건 property 테스트 작성
    - `src/__tests__/permissions.property.test.ts` 파일 생성
    - **Property 3: Permission_Config 구조 불변 조건**
    - MENU_CONFIG 내 모든 메뉴 항목의 allowedRoles 배열이 최소 1개 이상의 유효한 AdminRole 값을 포함하는지 검증
    - **Validates: Requirements 3.1**

- [ ] 8. Example-Based 테스트
  - [ ]* 8.1 RoleGuard 컴포넌트 테스트 작성
    - `src/__tests__/RoleGuard.test.tsx` 파일 생성
    - 역할 허용 시 children 렌더링 확인
    - 역할 미허용 시 ForbiddenPage 렌더링 확인
    - 미인증 시 /login 리다이렉트 확인
    - React Testing Library + MemoryRouter + QueryClientProvider wrapper 활용
    - _Requirements: 4.1, 4.6, 5.5, 5.6_

  - [ ]* 8.2 ForbiddenPage 컴포넌트 테스트 작성
    - `src/__tests__/ForbiddenPage.test.tsx` 파일 생성
    - "접근 권한이 없습니다" 메시지 존재 확인
    - "대시보드로 이동" 버튼 존재 및 동작 확인
    - "이전 페이지" 버튼 존재 확인
    - _Requirements: 4.2, 4.3, 4.5_

  - [ ]* 8.3 Sidebar 역할별 렌더링 테스트 작성
    - `src/__tests__/Sidebar.test.tsx` 파일 생성
    - ADMIN_DEV: 모든 카테고리(대출, 관리, 시스템) 메뉴 표시 확인
    - ADMIN_BANK_TELLER: 대출(지점장 결재 제외), 관리만 표시 확인
    - ADMIN_BANK_MANAGER: 대출(지점장 결재 포함), 관리만 표시 확인
    - 사용자 이름 + 역할 한글 표시명 렌더링 확인
    - _Requirements: 2.2, 2.3, 2.4, 2.5, 6.1, 6.2, 6.3, 6.4_

- [ ] 9. Final checkpoint - 전체 테스트 통과 확인
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- 기술 스택: React 19, TypeScript, React Router v7, React Query v5, Zustand v5, Tailwind CSS v4, Vitest, fast-check
- 새 페이지들은 placeholder만 구현 (실제 콘텐츠는 별도 스펙에서 구현)

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["1.3"] },
    { "id": 2, "tasks": ["2.1", "2.2"] },
    { "id": 3, "tasks": ["4.1", "4.3"] },
    { "id": 4, "tasks": ["4.2"] },
    { "id": 5, "tasks": ["5.1", "5.2"] },
    { "id": 6, "tasks": ["7.1", "7.2", "7.3"] },
    { "id": 7, "tasks": ["8.1", "8.2", "8.3"] }
  ]
}
```
