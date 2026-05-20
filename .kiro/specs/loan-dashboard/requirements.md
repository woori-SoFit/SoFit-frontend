# Requirements Document

## Introduction

admin-front 앱의 대출 현황 대시보드 페이지를 구현합니다. ADMIN_BANK_MANAGER(지점장), ADMIN_BANK_TELLER(은행원), ADMIN_DEV(개발자) 3가지 권한의 관리자가 대출 신청 건을 목록으로 조회하고, 심사 상태를 확인하며, 상세 페이지로 이동하여 심사를 처리할 수 있는 대시보드입니다. 목(mock) 데이터를 `src/mocks` 디렉토리에 분리하여 향후 실제 API로 일괄 교체할 수 있도록 설계합니다.

## Glossary

- **Dashboard**: 대출 현황 대시보드 페이지 컴포넌트. `/dashboard` 경로에 매핑된 메인 화면
- **Loan_Application**: 대출 신청 건 데이터 객체. 신청일, 신청자명, 사업자명, 상품명, 심사 상태 등의 정보를 포함
- **Review_Status**: 대출 심사 상태. UNDER_REVIEW(심사 중), MANAGER_REVIEW(추가 심사 중 - 지점장 결재 대기), APPROVED(승인 완료), REJECTED(거절 완료) 중 하나
- **Status_Badge**: 심사 상태를 시각적으로 표현하는 뱃지 UI 컴포넌트
- **Application_Table**: 대출 신청 목록을 표시하는 테이블 컴포넌트
- **Mock_Data_Layer**: `src/mocks` 디렉토리에 위치한 목 데이터 모듈. 실제 API 교체 시 이 디렉토리만 수정하면 되도록 설계

## Requirements

### Requirement 1: 대시보드 페이지 헤더 표시

**User Story:** As a 은행원, I want 대시보드 진입 시 페이지 제목과 설명을 확인하고 싶다, so that 현재 페이지의 목적을 즉시 파악할 수 있다.

#### Acceptance Criteria

1. WHEN 사용자가 `/dashboard` 경로에 진입하면, THE Dashboard SHALL "대출 현황 대시보드" 텍스트를 페이지 최상위 heading(h1) 요소로 표시한다
2. WHEN 사용자가 `/dashboard` 경로에 진입하면, THE Dashboard SHALL "승인, 거절 또는 추가 서류 요청이 필요한 신청 건을 확인하고 처리하세요." 설명 텍스트를 제목 heading 바로 아래에 단락 요소로 표시한다
3. WHEN 사용자가 `/dashboard` 경로에 진입하면, THE Dashboard SHALL 제목과 설명 텍스트를 데이터 로딩 상태와 무관하게 즉시 표시한다

### Requirement 2: 처리 대상 목록 섹션 표시

**User Story:** As a 은행원, I want 처리 대상 대출 신청 건의 총 건수를 확인하고 싶다, so that 처리해야 할 업무량을 파악할 수 있다.

#### Acceptance Criteria

1. THE Dashboard SHALL "처리 대상 목록" 섹션 제목을 Application_Table 상단에 표시한다
2. THE Dashboard SHALL 현재 목록에 표시된 대출 신청 건의 총 건수를 "총 N건" 형식(N은 0 이상의 정수)으로 섹션 제목 옆에 표시한다
3. WHILE 대출 신청 목록 데이터를 로딩 중이면, THE Dashboard SHALL 총 건수 영역에 건수를 표시하지 않는다

### Requirement 3: 대출 신청 목록 테이블 표시

**User Story:** As a 은행원, I want 대출 신청 목록을 테이블 형태로 조회하고 싶다, so that 각 신청 건의 주요 정보를 한눈에 비교할 수 있다.

#### Acceptance Criteria

1. THE Application_Table SHALL 신청일, 신청자명, 사업자명, 상품명, 심사 상태, 상세 정보 컬럼을 순서대로 표시한다
2. IF 대출 신청 데이터가 1건 이상 존재하면, THEN THE Application_Table SHALL 각 신청 건을 한 행으로 신청일 기준 최신순(내림차순)으로 표시한다
3. IF 대출 신청 데이터가 0건이면, THEN THE Application_Table SHALL 테이블 헤더를 유지한 채 데이터 영역에 "조회된 대출 신청 내역이 없습니다." 메시지를 표시한다
4. THE Application_Table SHALL 신청일을 "YYYY.MM.DD" 형식으로 표시한다

### Requirement 4: 심사 상태 뱃지 표시

**User Story:** As a 은행원, I want 각 신청 건의 심사 상태를 색상으로 구분하여 확인하고 싶다, so that 처리가 필요한 건을 빠르게 식별할 수 있다.

#### Acceptance Criteria

1. WHILE Review_Status가 UNDER_REVIEW이면, THE Status_Badge SHALL "심사 중" 텍스트를 주황색(warning) 배경으로 표시한다
2. WHILE Review_Status가 MANAGER_REVIEW이면, THE Status_Badge SHALL "추가 심사 중" 텍스트를 파란색(info) 배경으로 표시한다
3. WHILE Review_Status가 APPROVED이면, THE Status_Badge SHALL "승인 완료" 텍스트를 초록색(success) 배경으로 표시한다
4. WHILE Review_Status가 REJECTED이면, THE Status_Badge SHALL "거절 완료" 텍스트를 빨간색(error) 배경으로 표시한다
5. IF Review_Status가 UNDER_REVIEW, MANAGER_REVIEW, APPROVED, REJECTED 중 어느 것에도 해당하지 않는 값이면, THEN THE Status_Badge SHALL 해당 상태값을 회색(neutral) 배경의 텍스트로 표시한다

### Requirement 5: 상세 페이지 이동

**User Story:** As a 은행원, I want 특정 신청 건의 상세보기 버튼을 클릭하여 상세 페이지로 이동하고 싶다, so that 해당 건의 세부 정보를 확인하고 심사를 처리할 수 있다.

#### Acceptance Criteria

1. THE Application_Table SHALL 각 행의 "상세 정보" 컬럼에 해당 신청 건을 식별할 수 있는 접근성 레이블을 포함한 "상세보기" 버튼을 표시한다
2. WHEN 사용자가 "상세보기" 버튼을 클릭하면, THE Dashboard SHALL 클라이언트 사이드 라우팅을 통해 `/loan/{신청건ID}` 경로로 페이지를 이동시키고, 브라우저 URL을 해당 경로로 변경한다
3. WHEN 사용자가 "상세보기" 버튼을 클릭하면, THE Dashboard SHALL 페이지 전체 새로고침 없이 상세 페이지 컴포넌트를 렌더링한다

### Requirement 6: 목 데이터 분리 구조

**User Story:** As a 개발자, I want 목 데이터를 별도 디렉토리에 분리하여 관리하고 싶다, so that 실제 API 연동 시 목 데이터 모듈만 교체하면 된다.

#### Acceptance Criteria

1. THE Mock_Data_Layer SHALL `src/mocks` 디렉토리에 대출 신청 목록 목 데이터를 함수 형태로 export하여, React Query의 queryFn에서 직접 호출할 수 있도록 제공한다
2. THE Mock_Data_Layer SHALL Loan_Application 타입에 부합하는 데이터를 반환하며, 각 항목은 고유 식별자(id), 신청일, 신청자명, 사업자명, 상품명, Review_Status 필드를 포함한다
3. THE Mock_Data_Layer SHALL UNDER_REVIEW, MANAGER_REVIEW, APPROVED, REJECTED 4가지 Review_Status를 각각 최소 1건 이상 포함하는 총 4건 이상의 샘플 데이터를 제공한다
4. THE Mock_Data_Layer SHALL TypeScript 타입 검사를 통과하는 Loan_Application 배열을 반환하여, 컴파일 시점에 타입 불일치를 감지할 수 있도록 한다

### Requirement 7: 데이터 로딩 상태 처리

**User Story:** As a 은행원, I want 데이터 로딩 중임을 인지하고 싶다, so that 시스템이 정상 동작 중임을 확인할 수 있다.

#### Acceptance Criteria

1. WHILE 대출 신청 목록 데이터를 로딩 중이면, THE Dashboard SHALL 테이블 영역에 로딩 스피너와 "데이터를 불러오는 중입니다" 텍스트를 표시한다
2. WHEN 대출 신청 목록 데이터 로딩이 완료되면, THE Dashboard SHALL 로딩 스피너를 제거하고 테이블 데이터를 표시한다
3. IF 데이터 조회 중 오류가 발생하면, THEN THE Dashboard SHALL 테이블 영역에 데이터 조회 실패를 나타내는 오류 메시지와 "다시 시도" 버튼을 표시한다
4. WHEN 사용자가 오류 상태에서 "다시 시도" 버튼을 클릭하면, THE Dashboard SHALL 대출 신청 목록 데이터를 다시 조회한다

### Requirement 8: React Query를 통한 서버 상태 관리

**User Story:** As a 개발자, I want React Query를 사용하여 대출 신청 목록을 관리하고 싶다, so that 캐싱, 로딩, 에러 처리를 일관되게 관리할 수 있다.

#### Acceptance Criteria

1. THE Dashboard SHALL React Query의 useQuery 훅을 사용하여 `src/api` 디렉토리에 정의된 대출 신청 목록 조회 함수를 queryFn으로 호출한다
2. THE Dashboard SHALL `LOAN_KEYS.applications()` 쿼리 키를 사용하여 데이터를 캐싱한다
3. THE Dashboard SHALL API 호출 함수를 `src/api` 디렉토리에서 관리하며, 해당 함수는 공통 axiosInstance를 통해 요청을 수행한다
4. THE Dashboard SHALL useQuery의 staleTime을 30초로 설정하여 동일 쿼리 키에 대한 중복 네트워크 요청을 방지한다
