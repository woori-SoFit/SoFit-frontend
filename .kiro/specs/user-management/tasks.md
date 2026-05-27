# Implementation Plan: 사용자 관리 (User Management)

## Overview

admin-front 앱에 사용자 관리 페이지를 구현합니다. 기존 프로젝트 패턴(api/, hooks/, components/, pages/)을 따르며, React Query 기반 서버 상태 관리와 공통 컴포넌트(DataTable, LoadingState, ErrorState, RoleGuard)를 재사용합니다. 순수 유틸리티 함수를 먼저 구현하고, API → 훅 → 컴포넌트 → 페이지 순서로 점진적으로 통합합니다.

## Tasks

- [x] 1. 타입 정의 및 쿼리 키 확장
  - [x] 1.1 사용자 관리 타입 정의 파일 생성
    - `src/types/user.ts` 파일 생성
    - UserRole, UserStatus, UserTab, UserListParams, UserListItem, PaginatedUserResponse, UserStatistics, UserFilters, UserDownloadParams 타입/인터페이스 정의
    - `src/types/index.ts`에서 re-export 추가
    - _Requirements: 2.1, 3.1, 4.1, 6.1, 7.1, 8.1, 11.1_

  - [x] 1.2 USER_KEYS 쿼리 키 상수 추가
    - `src/constants/queryKeys.ts`에 USER_KEYS 객체 추가 (all, list, statistics, departments)
    - 기존 LOAN_KEYS 패턴과 동일한 구조 사용
    - _Requirements: 11.2, 11.3_

- [x] 2. 유틸리티 함수 구현
  - [x] 2.1 사용자 관리 유틸리티 함수 모듈 생성
    - `src/utils/userUtils.ts` 파일 생성
    - `calculatePercentage(part, total)` — 비율 계산 함수
    - `calculateRowNumber(totalCount, currentPage, pageSize, rowIndex)` — 순번 계산 함수
    - `formatLastLogin(dateString | null)` — 날짜 포맷팅 함수
    - `generatePageNumbers(totalPages, currentPage)` — 페이지 번호 생성 함수
    - `shouldTriggerSearch(keyword)` — 검색 트리거 판정 함수
    - `buildUserListParams(tab, filters, page, size)` — API 파라미터 빌드 함수
    - `getRoleBadgeConfig(role)` — 역할 뱃지 설정 반환 함수
    - `getStatusIndicatorConfig(status)` — 상태 인디케이터 설정 반환 함수
    - _Requirements: 2.3, 2.4, 2.5, 2.6, 2.7, 4.5, 4.6, 4.7, 6.4, 6.5, 6.6, 7.1, 7.2, 7.3, 7.4, 8.1, 8.2, 8.3, 9.7, 11.5_

  - [ ]* 2.2 Property 테스트: 비율 계산 정확성
    - **Property 1: 비율 계산 정확성**
    - **Validates: Requirements 2.3, 2.4, 2.5, 2.6, 2.7**
    - fast-check로 임의의 partCount, totalCount에 대해 calculatePercentage 검증

  - [ ]* 2.3 Property 테스트: 역할 뱃지 매핑
    - **Property 3: 역할 뱃지 매핑**
    - **Validates: Requirements 7.1, 7.2, 7.3, 7.4**
    - fast-check로 임의의 역할 문자열에 대해 getRoleBadgeConfig 검증

  - [ ]* 2.4 Property 테스트: 상태 인디케이터 매핑
    - **Property 4: 상태 인디케이터 매핑**
    - **Validates: Requirements 8.1, 8.2, 8.3**
    - fast-check로 임의의 상태 문자열에 대해 getStatusIndicatorConfig 검증

  - [ ]* 2.5 Property 테스트: 검색 트리거 판정
    - **Property 5: 검색어 길이 기반 검색 트리거 판정**
    - **Validates: Requirements 4.5, 4.6**
    - fast-check로 임의의 문자열에 대해 shouldTriggerSearch 검증

  - [ ]* 2.6 Property 테스트: 필터 조합 → API 파라미터 구성
    - **Property 6: 필터 조합 → API 파라미터 구성**
    - **Validates: Requirements 4.7, 11.5**
    - fast-check로 임의의 탭/필터 조합에 대해 buildUserListParams 검증

  - [ ]* 2.7 Property 테스트: 테이블 순번 계산
    - **Property 7: 테이블 순번 계산**
    - **Validates: Requirements 6.4**
    - fast-check로 임의의 totalCount, currentPage, pageSize, rowIndex에 대해 calculateRowNumber 검증

  - [ ]* 2.8 Property 테스트: 날짜 포맷팅
    - **Property 8: 날짜 포맷팅**
    - **Validates: Requirements 6.5, 6.6**
    - fast-check로 임의의 ISO 8601 날짜 문자열 및 null에 대해 formatLastLogin 검증

  - [ ]* 2.9 Property 테스트: 페이지 번호 생성
    - **Property 9: 페이지 번호 생성**
    - **Validates: Requirements 9.7**
    - fast-check로 임의의 totalPages, currentPage에 대해 generatePageNumbers 검증

- [x] 3. Checkpoint - 유틸리티 함수 검증
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. API 모듈 및 커스텀 훅 구현
  - [x] 4.1 사용자 API 모듈 생성
    - `src/api/userApi.ts` 파일 생성
    - `fetchUsers(params)` — 사용자 목록 조회 (GET /api/admin/users)
    - `fetchUserStatistics()` — 통계 조회 (GET /api/admin/users/statistics)
    - `downloadUsersExcel(params)` — 엑셀 다운로드 (GET /api/admin/users/download, responseType: blob)
    - `fetchDepartments()` — 소속 목록 조회 (GET /api/admin/departments)
    - 공통 axiosInstance 사용
    - _Requirements: 2.10, 4.4, 5.2, 11.1_

  - [x] 4.2 useUserList 커스텀 훅 구현
    - `src/hooks/useUserList.ts` 파일 생성
    - useQuery 사용, queryKey에 params 포함
    - staleTime: 30,000ms, retry: 3
    - 기존 useLoanApplications 패턴 참조
    - _Requirements: 11.1, 11.2, 11.4, 11.5, 11.6, 11.7, 11.8_

  - [x] 4.3 useUserStatistics 커스텀 훅 구현
    - `src/hooks/useUserStatistics.ts` 파일 생성
    - useQuery 사용, USER_KEYS.statistics() 쿼리 키
    - staleTime: 30,000ms
    - _Requirements: 2.10, 11.3, 11.4_

  - [x] 4.4 useUserDownload 커스텀 훅 구현
    - `src/hooks/useUserDownload.ts` 파일 생성
    - useMutation 기반 엑셀 다운로드 처리
    - Blob 응답을 파일로 저장하는 로직 포함
    - _Requirements: 5.2, 5.5, 5.6, 5.7_

- [x] 5. 도메인 컴포넌트 구현
  - [x] 5.1 RoleBadge 컴포넌트 구현
    - `src/components/user-management/RoleBadge.tsx` 파일 생성
    - getRoleBadgeConfig 유틸 함수 활용
    - 파란색(관리자), 초록색(은행원), 주황색(고객), 회색(기타) pill 형태 뱃지
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [x] 5.2 StatusIndicator 컴포넌트 구현
    - `src/components/user-management/StatusIndicator.tsx` 파일 생성
    - getStatusIndicatorConfig 유틸 함수 활용
    - 초록색(활성), 빨간색(비활성), 회색(기타) 도트 + 텍스트
    - _Requirements: 8.1, 8.2, 8.3_

  - [x] 5.3 StatisticsCards 컴포넌트 구현
    - `src/components/user-management/StatisticsCards.tsx` 파일 생성
    - 5개 통계 카드 (전체, 관리자, 은행원, 고객, 비활성) 가로 균등 배치
    - calculatePercentage 유틸 함수 활용
    - 로딩 스켈레톤, 에러 상태 + 재시도 버튼 처리
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9_

  - [x] 5.4 UserTabs 컴포넌트 구현
    - `src/components/user-management/UserTabs.tsx` 파일 생성
    - 5개 탭 (전체, 관리자, 은행원, 고객, 비활성) 렌더링
    - 활성 탭 하단 강조 보더 표시
    - _Requirements: 3.1, 3.2, 3.7, 3.9_

  - [x] 5.5 SearchFilter 컴포넌트 구현
    - `src/components/user-management/SearchFilter.tsx` 파일 생성
    - 검색 입력 필드 (placeholder, maxLength 100)
    - 권한/상태/소속 드롭다운 필터 3개
    - 300ms 디바운스 적용
    - shouldTriggerSearch 유틸 함수 활용
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

  - [x] 5.6 Pagination 컴포넌트 구현
    - `src/components/user-management/Pagination.tsx` 파일 생성
    - first/prev/페이지번호(최대5개)/next/last 버튼
    - 페이지당 건수 드롭다운 (10, 20, 50)
    - generatePageNumbers 유틸 함수 활용
    - 비활성화 조건 처리 (첫/마지막 페이지, 0건)
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 9.9, 9.10_

  - [x] 5.7 ActionButtons 컴포넌트 구현
    - `src/components/user-management/ActionButtons.tsx` 파일 생성
    - 엑셀 다운로드 버튼 (비활성화 조건, 스피너)
    - 사용자 등록 버튼
    - _Requirements: 5.1, 5.3, 5.4, 5.5_

  - [x] 5.8 UserTable 컴포넌트 구현
    - `src/components/user-management/UserTable.tsx` 파일 생성
    - 공통 DataTable 컴포넌트 활용
    - 컬럼 정의: 번호, 아이디, 이름, 이메일, 권한(RoleBadge), 소속, 상태(StatusIndicator), 최근 로그인, 관리(수정 버튼)
    - calculateRowNumber, formatLastLogin 유틸 함수 활용
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8_

- [x] 6. Checkpoint - 컴포넌트 구현 검증
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. 페이지 조합 및 라우팅 통합
  - [x] 7.1 UserManagementPage 페이지 컴포넌트 구현
    - `src/pages/user-management/UserManagementPage.tsx` 파일 생성
    - 로컬 상태 관리: activeTab, filters, currentPage, pageSize
    - 하위 컴포넌트 조합: StatisticsCards, UserTabs, SearchFilter, ActionButtons, UserTable, Pagination
    - useUserList, useUserStatistics, useUserDownload 훅 연결
    - 탭/검색/필터 변경 시 페이지 초기화 로직
    - 로딩/에러/빈 상태 처리 (LoadingState, ErrorState 활용)
    - 페이지 헤더 "사용자 관리" h1 표시
    - _Requirements: 1.1, 1.2, 1.3, 3.3, 3.4, 3.5, 3.6, 3.8, 3.10, 3.11, 4.8, 4.9, 5.6, 5.7, 6.9, 10.1, 10.2, 10.3, 10.4, 10.5_

  - [x] 7.2 라우터에 UserManagementPage 등록
    - `src/router/routes.tsx`에서 기존 placeholder UsersPage를 UserManagementPage로 교체
    - PAGE_COMPONENTS 매핑 업데이트
    - 기존 ROUTE_CONFIG의 users 항목 allowedRoles 확인 (접근 권한 제어)
    - _Requirements: 12.1, 12.2, 12.3, 12.4_

  - [ ]* 7.3 Property 테스트: 필터 변경 시 페이지 초기화
    - **Property 2: 필터 변경 시 페이지 초기화**
    - **Validates: Requirements 3.8, 4.8, 9.5**
    - fast-check로 임의의 필터 변경 이벤트에 대해 페이지 초기화 동작 검증

- [x] 8. Final checkpoint - 전체 통합 검증
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- 기존 placeholder `UsersPage`를 실제 구현으로 교체하는 방식으로 진행
- 공통 컴포넌트(DataTable, LoadingState, ErrorState, RoleGuard)는 이미 존재하므로 재사용
- 사용자 등록 모달과 수정 모달은 별도 스펙으로 분리 가능 (현재 스펙에서는 모달 열기 트리거까지만 구현)

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["2.1"] },
    { "id": 2, "tasks": ["2.2", "2.3", "2.4", "2.5", "2.6", "2.7", "2.8", "2.9", "4.1"] },
    { "id": 3, "tasks": ["4.2", "4.3", "4.4", "5.1", "5.2"] },
    { "id": 4, "tasks": ["5.3", "5.4", "5.5", "5.6", "5.7"] },
    { "id": 5, "tasks": ["5.8"] },
    { "id": 6, "tasks": ["7.1"] },
    { "id": 7, "tasks": ["7.2", "7.3"] }
  ]
}
```
