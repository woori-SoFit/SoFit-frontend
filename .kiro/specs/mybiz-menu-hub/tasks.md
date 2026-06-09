# Implementation Plan: MyBiz Menu Hub

## Overview

마이 비즈 데이터 대시보드 진입 전에 "메뉴 선택 화면(MenuHub)"을 삽입하여, 사용자가 원하는 카테고리의 상세 데이터를 선택적으로 확인할 수 있도록 한다. BizDataPage의 연결 완료 분기를 기존 BizDashboard에서 MenuHub로 교체하고, 카테고리별 상세 화면은 `/biz-data/dashboard?category={category}` 쿼리 파라미터로 라우팅한다.

## Tasks

- [ ] 1. 타입 정의 및 데이터 모델 생성
  - [ ] 1.1 MenuHub 타입 및 상수 정의
    - `src/types/menuHub.ts` 파일 생성
    - `MenuCategory` 타입 (`"sales" | "profit" | "customer" | "industry" | "loan-check"`) 정의
    - `MenuItem` 인터페이스 (`id`, `title`, `description`) 정의
    - `MENU_ITEMS` 상수 배열 (5개 메뉴 카드 데이터) 정의
    - `DashboardSearchParams` 타입 정의
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [ ] 2. 상태 관리 및 API 연동
  - [ ] 2.1 Zustand store 생성 (menuHubStore)
    - `src/stores/menuHubStore.ts` 파일 생성
    - `selectedMonth: string`, `setSelectedMonth`, `reset` 액션 정의
    - 초기값은 빈 문자열 (useAvailableMonths에서 최신 월 설정)
    - _Requirements: 7.1, 7.4_

  - [ ] 2.2 useAvailableMonths 훅 생성
    - `src/hooks/useAvailableMonths.ts` 파일 생성
    - React Query `useQuery`로 `fetchMyBizDashboard()` 호출 후 `availableMonths` 필드 select
    - 에러 시 빈 배열 반환, `isLoading`, `isError` 상태 노출
    - _Requirements: 2.2, 2.7, 8.6, 8.7_

- [ ] 3. MenuCard 컴포넌트 구현
  - [ ] 3.1 MenuCard 컴포넌트 생성
    - `src/components/bizData/MenuCard.tsx` 파일 생성
    - Props: `title: string`, `description?: string`, `onPress: () => void`
    - 둥근 모서리, 배경색, 좌우 패딩 카드 스타일 (Tailwind CSS 유틸리티 클래스만 사용)
    - 제목: 볼드 텍스트, 설명: text-secondary 보조 색상 작은 텍스트
    - description 미제공 시 제목만 수직 중앙 정렬
    - 우측 chevron 아이콘 (lucide-react `ChevronRight`)
    - 눌림 상태: `active:bg-gray-50` 배경색 변경
    - 접근성: `role="button"`, `aria-label={title}`
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 3.8_

  - [ ]* 3.2 MenuCard Property 테스트 작성
    - **Property 4: MenuCard 접근성 속성 및 조건부 렌더링**
    - fast-check으로 임의 title/description 생성하여 role, aria-label, 조건부 렌더링 검증
    - **Validates: Requirements 4.3, 4.6**

  - [ ]* 3.3 MenuCard 단위 테스트 작성
    - 제목/설명 렌더링 확인
    - description 없을 때 설명 요소 미렌더 확인
    - onPress 콜백 호출 확인
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [ ] 4. MonthNavigation 컴포넌트 구현
  - [ ] 4.1 MonthNavigation 컴포넌트 생성
    - `src/components/bizData/MonthNavigation.tsx` 파일 생성
    - Props: `availableMonths: string[]`, `selectedMonth: string`, `onMonthChange: (month: string) => void`
    - 선택된 월을 "YYYY.MM" 형식으로 표시
    - 좌측 화살표(이전 월), 우측 화살표(다음 월) 네비게이션
    - 첫 번째 월(가장 최신)일 때 오른쪽 화살표 disabled
    - 마지막 월(가장 과거)일 때 왼쪽 화살표 disabled
    - availableMonths 빈 배열 시 현재 시스템 월 표시 + 양쪽 disabled
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_

  - [ ]* 4.2 MonthNavigation Property 테스트 작성 — 초기값
    - **Property 1: MonthNavigation 초기값은 항상 가장 최신 월**
    - fast-check으로 임의 non-empty availableMonths 생성, 초기 selectedMonth가 배열 첫 요소와 동일한지 검증
    - **Validates: Requirements 2.2**

  - [ ]* 4.3 MonthNavigation Property 테스트 작성 — 이동 범위
    - **Property 2: MonthNavigation 이동은 배열 범위 내에서만 동작**
    - fast-check으로 배열 + 현재 인덱스 + 방향(left/right) 생성, 이동 결과가 항상 배열 내 값인지 검증
    - **Validates: Requirements 2.3, 2.4, 2.5, 2.6**

  - [ ]* 4.4 MonthNavigation 단위 테스트 작성
    - "YYYY.MM" 형식 표시 확인
    - 경계에서 화살표 disabled 확인
    - 월 변경 콜백 호출 확인
    - _Requirements: 2.3, 2.4, 2.5, 2.6, 2.7_

- [ ] 5. GrowthBanner 컴포넌트 구현
  - [ ] 5.1 GrowthBanner 컴포넌트 생성
    - `src/components/bizData/GrowthBanner.tsx` 파일 생성
    - "내 성장 S 등급 보러가기" CTA 텍스트 표시
    - 탭 시 `/grade-report` 경로로 네비게이션 (useNavigate)
    - MenuCard와 다른 배경색 클래스 적용
    - 눌림 상태(active state) 시각적 피드백
    - `role="button"`, `aria-label="내 성장 S 등급 보러가기"` 접근성 속성
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

  - [ ]* 5.2 GrowthBanner 단위 테스트 작성
    - CTA 텍스트 렌더링 확인
    - 탭 시 네비게이션 호출 확인
    - 접근성 속성 확인
    - _Requirements: 5.2, 5.3, 5.6_

- [ ] 6. Checkpoint - 개별 컴포넌트 검증
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. MenuHub 루트 컴포넌트 구현
  - [ ] 7.1 MenuHub 컴포넌트 생성
    - `src/components/bizData/MenuHub.tsx` 파일 생성
    - 헤더 타이틀: "사장님, 무엇이 궁금하세요?" 텍스트 표시
    - `useAvailableMonths` 훅으로 월 목록 조회
    - `useMenuHubStore`에서 selectedMonth 읽기/쓰기
    - 초기 로드 시 availableMonths[0]을 selectedMonth로 설정
    - MonthNavigation 컴포넌트 렌더링 (availableMonths, selectedMonth, onMonthChange 전달)
    - MENU_ITEMS 기반 5개 MenuCard 수직 리스트 렌더링 (카드 간 간격 8dp 이상)
    - 각 카드 탭 시 `/biz-data/dashboard?category={id}`로 네비게이션 (useNavigate)
    - 하단에 GrowthBanner 렌더링
    - API 실패 시에도 정적 콘텐츠(MENU_ITEMS) 기반 카드 표시 유지
    - _Requirements: 2.1, 2.2, 3.1, 3.7, 3.8, 3.9, 5.1, 7.1_

  - [ ]* 7.2 MenuHub Property 테스트 작성 — 카드 네비게이션 매핑
    - **Property 3: 메뉴 카드 탭 시 올바른 카테고리로 네비게이션**
    - fast-check으로 MENU_ITEMS 중 임의 원소 선택, 탭 시 URL에 해당 id가 category 파라미터로 포함되는지 검증
    - **Validates: Requirements 3.7**

  - [ ]* 7.3 MenuHub Property 테스트 작성 — selectedMonth 유지
    - **Property 5: selectedMonth 상태 전달 및 복귀 시 유지**
    - fast-check으로 임의 YYYY-MM 문자열 생성, store 설정 후 카드 탭 전후로 store 값 유지 검증
    - **Validates: Requirements 7.1, 7.4**

  - [ ]* 7.4 MenuHub 단위 테스트 작성
    - 헤더 텍스트 렌더링 확인
    - 5개 카드 렌더링 확인 (제목, 설명)
    - GrowthBanner 렌더링 확인
    - _Requirements: 2.1, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 5.1_

- [ ] 8. BizDataPage 수정 및 라우팅 연동
  - [ ] 8.1 BizDataPage 수정 — MenuHub 렌더링
    - `src/pages/bizData/BizDataPage.tsx` 수정
    - `isConnected === true` 분기에서 기존 `<BizDashboard />` 대신 `<MenuHub />` 렌더링
    - 기존 BizDashboard 컴포넌트 코드는 별도 파일 또는 상세 화면용으로 유지
    - 로딩 중 CharacterLoadingSpinner 표시 유지
    - 에러 시 IntroSection(미연결 상태) 표시 유지
    - _Requirements: 1.1, 1.2, 1.4, 1.5_

  - [ ] 8.2 상세 대시보드 페이지 생성 및 라우팅 등록
    - `src/pages/bizData/BizDashboardPage.tsx` 파일 생성
    - `useSearchParams`로 `category` 쿼리 파라미터 추출
    - `useMenuHubStore`에서 `selectedMonth` 읽기
    - 해당 월+카테고리 데이터 React Query로 조회
    - 로딩/에러/빈 데이터 상태 처리 (로딩 인디케이터, 에러 메시지+재시도, 안내 메시지)
    - 뒤로가기 버튼 → `/biz-data` 네비게이션
    - `src/router/routes.tsx`에 `{ path: "/biz-data/dashboard", element: <BizDashboardPage /> }` 추가
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 7.2, 7.3, 7.5_

  - [ ] 8.3 BizDataCollectPage 완료 후 네비게이션 확인
    - `src/pages/bizData/BizDataCollectPage.tsx`에서 수집 완료 시 `returnTo` 없으면 `/biz-data`로 네비게이션 확인
    - 필요시 네비게이션 로직 수정
    - _Requirements: 1.3_

- [ ] 9. Checkpoint - 통합 검증
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. 코드 품질 및 빌드 검증
  - [ ] 10.1 TypeScript strict 모드 컴파일 및 빌드 확인
    - `npm run build` 실행하여 exit code 0 확인
    - `any` 타입, `@ts-ignore`, 인라인 style 미사용 확인
    - 파일명 컨벤션 준수 확인 (PascalCase 컴포넌트, camelCase 훅/유틸)
    - Tailwind CSS 유틸리티만 사용, `@theme` 디자인 토큰만 사용 확인
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7_

  - [ ]* 10.2 통합 테스트 작성
    - BizDataPage → MenuHub → 카드 탭 → BizDashboardPage → 뒤로가기 전체 플로우
    - BizDataCollectPage 완료 → MenuHub 진입 네비게이션 확인
    - _Requirements: 1.1, 1.3, 6.6, 7.4_

- [ ] 11. Final Checkpoint - 전체 테스트 및 빌드 통과
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties (fast-check 라이브러리 사용)
- Unit tests validate specific examples and edge cases (Vitest + React Testing Library)
- 기존 BizDashboard 코드는 BizDashboardPage로 이동/리팩토링하여 재활용
- 메뉴 카드 정적 데이터는 API 실패 시에도 네비게이션 가능하도록 프론트엔드에 하드코딩
- 색상은 `src/index.css`의 `@theme` 블록 디자인 토큰만 사용

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "2.1"] },
    { "id": 1, "tasks": ["2.2", "3.1", "5.1"] },
    { "id": 2, "tasks": ["3.2", "3.3", "4.1", "5.2"] },
    { "id": 3, "tasks": ["4.2", "4.3", "4.4"] },
    { "id": 4, "tasks": ["7.1"] },
    { "id": 5, "tasks": ["7.2", "7.3", "7.4", "8.1"] },
    { "id": 6, "tasks": ["8.2", "8.3"] },
    { "id": 7, "tasks": ["10.1", "10.2"] }
  ]
}
```
