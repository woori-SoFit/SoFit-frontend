# Implementation Plan: Loan Dashboard

## Overview

대출 현황 대시보드 페이지를 구현합니다. 타입 정의 → 유틸리티 → Mock 데이터 → API 레이어 → 커스텀 훅 → UI 컴포넌트 → 페이지 조합 순서로 점진적으로 구축하며, 각 단계에서 테스트를 병행합니다.

## Tasks

- [x] 1. 타입 정의 및 유틸리티 구현
  - [x] 1.1 ReviewStatus 타입과 LoanApplication 인터페이스 정의
    - `src/types/index.ts`에 `ReviewStatus` 타입 유니온과 `LoanApplication` 인터페이스 추가
    - ReviewStatus: 'UNDER_REVIEW' | 'MANAGER_REVIEW' | 'APPROVED' | 'REJECTED'
    - LoanApplication: id, applicationDate, applicantName, businessName, productName, reviewStatus 필드 포함
    - _Requirements: 6.2, 6.4_

  - [x] 1.2 formatDate 유틸리티 함수 구현
    - `src/utils/formatDate.ts` 파일 생성
    - ISO 8601 날짜 문자열("YYYY-MM-DD")을 "YYYY.MM.DD" 형식으로 변환
    - 유효하지 않은 날짜 형식 입력 시 원본 문자열 그대로 반환 (graceful degradation)
    - _Requirements: 3.4_

  - [ ]* 1.3 formatDate property-based 테스트 작성
    - `src/utils/formatDate.test.ts` 파일 생성
    - **Property 3: 날짜 포맷 변환은 YYYY.MM.DD 패턴을 준수한다**
    - **Validates: Requirements 3.4**
    - fast-check로 유효한 ISO 날짜 문자열을 생성하여 출력이 `/^\d{4}\.\d{2}\.\d{2}$/` 패턴과 일치하는지, 연/월/일 값이 보존되는지 검증

- [x] 2. Mock 데이터 레이어 구현
  - [x] 2.1 Mock 대출 신청 데이터 생성
    - `src/mocks/loanApplications.ts` 파일 생성
    - `getMockLoanApplications(): LoanApplication[]` 함수 export
    - UNDER_REVIEW, MANAGER_REVIEW, APPROVED, REJECTED 4가지 상태를 각각 최소 1건 이상 포함하는 총 4건 이상의 샘플 데이터 제공
    - TypeScript 타입 검사를 통과하는 LoanApplication 배열 반환
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [ ]* 2.2 Mock 데이터 유효성 단위 테스트 작성
    - `src/mocks/loanApplications.test.ts` 파일 생성
    - 4가지 ReviewStatus가 각각 최소 1건 이상 포함되는지 검증
    - 모든 항목이 LoanApplication 인터페이스 필수 필드를 포함하는지 검증
    - _Requirements: 6.3, 6.4_

- [x] 3. API 레이어 및 React Query 훅 구현
  - [x] 3.1 대출 신청 목록 조회 API 함수 구현
    - `src/api/loanApi.ts` 파일 생성
    - `fetchLoanApplications(): Promise<LoanApplication[]>` 함수 구현
    - 현재는 Mock 데이터 함수를 호출하여 반환 (향후 axiosInstance를 통한 실제 API 호출로 교체)
    - `src/api/index.ts` barrel export에 추가
    - _Requirements: 8.3_

  - [x] 3.2 useLoanApplications 커스텀 훅 구현
    - `src/hooks/useLoanApplications.ts` 파일 생성
    - React Query useQuery 사용, queryKey: `LOAN_KEYS.applications()`, queryFn: `fetchLoanApplications`
    - staleTime: 30_000 (30초) 설정
    - data, isLoading, isError, error, refetch 반환
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [x] 4. Checkpoint - 데이터 레이어 검증
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. StatusBadge 컴포넌트 구현
  - [x] 5.1 StatusBadge 컴포넌트 작성
    - `src/components/common/StatusBadge.tsx` 파일 생성
    - `StatusBadgeProps` 인터페이스: `{ status: ReviewStatus | string }`
    - STATUS_CONFIG 매핑 상수 정의 (UNDER_REVIEW→심사 중/warning, MANAGER_REVIEW→추가 심사 중/info, APPROVED→승인 완료/success, REJECTED→거절 완료/error)
    - 알 수 없는 상태값은 원본 텍스트를 회색(gray) 배경으로 표시
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [ ]* 5.2 StatusBadge property-based 테스트 작성
    - `src/components/common/StatusBadge.test.tsx` 파일 생성
    - **Property 4: 알 수 없는 상태값은 원본 텍스트와 회색 배경으로 폴백 표시된다**
    - **Validates: Requirements 4.5**
    - fast-check로 4가지 정의된 상태 외의 임의 문자열을 생성하여 원본 텍스트가 그대로 표시되고 gray 계열 CSS 클래스가 적용되는지 검증
    - 추가로 4가지 정의된 상태에 대한 텍스트/색상 매핑 단위 테스트 포함

- [x] 6. ApplicationTable 컴포넌트 구현
  - [x] 6.1 ApplicationTable 컴포넌트 작성
    - `src/components/dashboard/ApplicationTable.tsx` 파일 생성
    - `ApplicationTableProps` 인터페이스: `{ applications: LoanApplication[] }`
    - 테이블 헤더: 신청일, 신청자명, 사업자명, 상품명, 심사 상태, 상세 정보 순서
    - 각 행에 formatDate로 신청일 포맷, StatusBadge로 상태 표시
    - 빈 데이터 시 "조회된 대출 신청 내역이 없습니다." 메시지 표시
    - 각 행에 접근성 레이블(aria-label) 포함 "상세보기" 링크 (`/loan/{id}` 경로)
    - react-router-dom의 Link 컴포넌트 사용하여 클라이언트 사이드 라우팅
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 5.1, 5.2, 5.3_

  - [ ]* 6.2 ApplicationTable property-based 테스트 작성
    - `src/components/dashboard/ApplicationTable.test.tsx` 파일 생성
    - **Property 2: 대출 신청 목록은 신청일 기준 내림차순으로 정렬된다**
    - **Validates: Requirements 3.2**
    - fast-check로 임의의 LoanApplication 배열을 생성하여 렌더링된 행의 순서가 applicationDate 기준 내림차순인지 검증
    - **Property 5: 상세보기 버튼은 올바른 접근성 레이블과 네비게이션 경로를 가진다**
    - **Validates: Requirements 5.1, 5.2**
    - fast-check로 임의의 LoanApplication을 생성하여 해당 행의 상세보기 링크 href가 `/loan/{id}`인지 검증
    - 추가로 빈 배열 시 안내 메시지 표시, 컬럼 헤더 순서 단위 테스트 포함

- [x] 7. DashboardPage 페이지 조합 구현
  - [x] 7.1 DashboardPage 리팩토링
    - `src/pages/dashboard/DashboardPage.tsx` 기존 placeholder를 완전히 교체
    - 페이지 제목 "대출 현황 대시보드" (h1), 설명 텍스트 (p) 렌더링
    - useLoanApplications 훅으로 데이터 조회
    - "처리 대상 목록" 섹션 제목 + "총 N건" 건수 표시 (로딩 중에는 건수 미표시)
    - 로딩 상태: 로딩 스피너 + "데이터를 불러오는 중입니다" 텍스트
    - 에러 상태: 오류 메시지 + "다시 시도" 버튼 (refetch 연결)
    - 성공 상태: ApplicationTable에 데이터 전달
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 7.1, 7.2, 7.3, 7.4_

  - [ ]* 7.2 DashboardPage property-based 테스트 작성
    - `src/pages/dashboard/DashboardPage.test.tsx` 파일 생성
    - **Property 1: 총 건수는 데이터 배열 길이와 일치한다**
    - **Validates: Requirements 2.2**
    - fast-check로 임의 길이의 LoanApplication 배열을 생성하여 "총 N건" 텍스트의 N이 배열 length와 일치하는지 검증
    - 추가로 로딩/에러/빈 상태 렌더링 단위 테스트 포함

- [x] 8. Final checkpoint - 전체 통합 검증
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- Mock 데이터 레이어는 향후 실제 API 연동 시 `src/api/loanApi.ts`의 `fetchLoanApplications` 함수 내부만 교체하면 됩니다
- `src/constants/queryKeys.ts`에 `LOAN_KEYS.applications()`는 이미 정의되어 있으므로 별도 추가 불필요

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["1.3", "2.1"] },
    { "id": 2, "tasks": ["2.2", "3.1"] },
    { "id": 3, "tasks": ["3.2", "5.1"] },
    { "id": 4, "tasks": ["5.2", "6.1"] },
    { "id": 5, "tasks": ["6.2", "7.1"] },
    { "id": 6, "tasks": ["7.2"] }
  ]
}
```
