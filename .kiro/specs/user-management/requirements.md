# Requirements Document

## Introduction

admin-front 앱의 사용자 관리(고객 관리) 페이지를 구현합니다. DEV_ADMIN(개발 관리자) 권한을 가진 관리자가 시스템에 등록된 사용자(관리자, 은행원, 고객)의 계정 및 권한을 조회, 검색, 필터링하고 관리할 수 있는 페이지입니다. 통계 카드를 통해 사용자 현황을 한눈에 파악하고, 탭/필터/검색을 통해 원하는 사용자를 빠르게 찾을 수 있으며, 엑셀 다운로드 및 사용자 등록 기능을 제공합니다. 사용자 권한은 ADMIN_DEV(관리자), ADMIN_BANK_TELLER/ADMIN_BANK_MANAGER(은행원), USER(고객)로 구분됩니다.

## Glossary

- **User_Management_Page**: 사용자 관리 페이지 컴포넌트. `/users` 경로에 매핑된 화면
- **Statistics_Card**: 페이지 상단에 위치한 사용자 통계 요약 카드 컴포넌트. 전체 사용자 수, 권한별 사용자 수, 비활성 사용자 수를 표시
- **User_Tab**: 사용자 목록을 권한/상태별로 필터링하는 탭 네비게이션 컴포넌트
- **Search_Filter**: 이름, 아이디, 이메일 검색 및 권한/상태/소속 드롭다운 필터 영역
- **User_Table**: 사용자 목록을 표시하는 데이터 테이블 컴포넌트
- **Role_Badge**: 사용자 권한을 색상으로 구분하여 표시하는 뱃지 컴포넌트
- **Status_Indicator**: 사용자 활성/비활성 상태를 표시하는 인디케이터 컴포넌트
- **Pagination**: 페이지 번호 및 페이지당 표시 건수를 제어하는 페이지네이션 컴포넌트
- **User_Role**: 사용자 권한 종류. 관리자(ADMIN_DEV), 은행원(ADMIN_BANK_TELLER, ADMIN_BANK_MANAGER), 고객(USER) 중 하나
- **User_Status**: 사용자 계정 상태. 활성(ACTIVE) 또는 비활성(INACTIVE) 중 하나
- **User_API**: `src/api` 디렉토리에 위치한 사용자 관련 API 호출 함수 모듈

## Requirements

### Requirement 1: 페이지 헤더 표시

**User Story:** As a 개발 관리자, I want 사용자 관리 페이지 진입 시 페이지 제목을 확인하고 싶다, so that 현재 페이지의 목적을 즉시 파악할 수 있다.

#### Acceptance Criteria

1. WHEN 사용자가 `/users` 경로에 진입하면, THE User_Management_Page SHALL "사용자 관리" 텍스트를 페이지 최상위 heading(h1) 요소로 표시한다
2. THE User_Management_Page SHALL 제목(h1) 텍스트를 비동기 데이터 fetch 완료를 기다리지 않고 컴포넌트 마운트 시점에 렌더링한다
3. IF 데이터 로딩 실패 또는 에러가 발생하더라도, THEN THE User_Management_Page SHALL 제목(h1) 텍스트를 화면에 계속 표시한다

### Requirement 2: 사용자 통계 카드 표시

**User Story:** As a 개발 관리자, I want 사용자 현황 통계를 카드 형태로 한눈에 확인하고 싶다, so that 시스템 사용자 분포를 빠르게 파악할 수 있다.

#### Acceptance Criteria

1. THE Statistics_Card SHALL 페이지 헤더 아래에 가로 배치된 5개의 통계 카드를 표시하되, 각 카드는 아이콘, 제목, 수치, 하위 텍스트를 포함하며 동일한 너비로 균등 배치한다
2. THE Statistics_Card SHALL 첫 번째 카드에 "전체 사용자" 제목과 전체 사용자 수를 "N명" 형식으로 표시하고, 하위 텍스트로 "활성 사용자 M명" 정보를 표시한다
3. THE Statistics_Card SHALL 두 번째 카드에 "관리자" 제목과 관리자 수를 "N명" 형식으로 표시하고, 하위 텍스트로 전체 대비 비율을 "전체의 N.NN%" 형식으로 표시한다
4. THE Statistics_Card SHALL 세 번째 카드에 "은행원" 제목과 은행원 수를 "N명" 형식으로 표시하고, 하위 텍스트로 전체 대비 비율을 "전체의 N.NN%" 형식으로 표시한다
5. THE Statistics_Card SHALL 네 번째 카드에 "고객" 제목과 고객 수를 "N명" 형식으로 표시하고, 하위 텍스트로 전체 대비 비율을 "전체의 N.NN%" 형식으로 표시한다
6. THE Statistics_Card SHALL 다섯 번째 카드에 "비활성 사용자" 제목과 비활성 사용자 수를 "N명" 형식으로 표시하고, 하위 텍스트로 전체 대비 비율을 "전체의 N.NN%" 형식으로 표시한다
7. IF 전체 사용자 수가 0이면, THEN THE Statistics_Card SHALL 비율을 표시하는 카드(관리자, 은행원, 고객, 비활성 사용자)의 하위 텍스트에 "전체의 0.00%" 를 표시한다
8. WHILE 통계 데이터를 로딩 중이면, THE Statistics_Card SHALL 각 카드 영역에 수치와 하위 텍스트 위치에 로딩 스켈레톤 애니메이션을 표시한다
9. IF 통계 데이터 API 호출이 실패하면, THEN THE Statistics_Card SHALL 카드 영역에 데이터를 불러올 수 없음을 나타내는 에러 메시지와 재시도 버튼을 표시한다
10. WHEN 페이지가 최초 마운트되면, THE Statistics_Card SHALL 통계 API를 호출하여 최신 사용자 통계 데이터를 조회한다

### Requirement 3: 탭 필터 네비게이션

**User Story:** As a 개발 관리자, I want 사용자 목록을 권한/상태별 탭으로 빠르게 필터링하고 싶다, so that 특정 그룹의 사용자만 집중적으로 확인할 수 있다.

#### Acceptance Criteria

1. THE User_Tab SHALL "전체 사용자", "관리자", "은행원", "고객", "비활성 사용자" 5개의 탭을 왼쪽부터 해당 순서대로 표시한다
2. WHEN 페이지에 최초 진입하면, THE User_Tab SHALL "전체 사용자" 탭을 기본 활성 상태로 표시하고, User_Table은 상태와 역할에 관계없이 모든 사용자를 표시한다
3. WHEN 사용자가 "관리자" 탭을 클릭하면, THE User_Table SHALL User_Role이 ADMIN_DEV인 사용자만 표시한다
4. WHEN 사용자가 "은행원" 탭을 클릭하면, THE User_Table SHALL User_Role이 ADMIN_BANK_TELLER 또는 ADMIN_BANK_MANAGER인 사용자만 표시한다
5. WHEN 사용자가 "고객" 탭을 클릭하면, THE User_Table SHALL User_Role이 USER인 사용자만 표시한다
6. WHEN 사용자가 "비활성 사용자" 탭을 클릭하면, THE User_Table SHALL User_Role에 관계없이 User_Status가 INACTIVE인 사용자만 표시한다
7. WHEN 사용자가 탭을 변경하면, THE User_Tab SHALL 활성 탭 하단에 강조 보더를 표시하고, 비활성 탭에는 강조 보더를 표시하지 않는다
8. WHEN 사용자가 탭을 변경하면, THE Pagination SHALL 페이지 번호를 1페이지로 초기화한다
9. WHEN 사용자가 "전체 사용자" 탭을 클릭하면, THE User_Table SHALL 상태와 역할에 관계없이 모든 사용자를 표시한다
10. IF 선택된 탭의 필터 조건에 해당하는 사용자가 0명이면, THEN THE User_Table SHALL 테이블 영역에 "조회된 데이터가 없습니다." 메시지를 표시한다
11. WHEN 탭 변경으로 새로운 필터 API 호출이 진행 중이면, THE User_Table SHALL 로딩 상태를 표시한다

### Requirement 4: 검색 및 필터 기능

**User Story:** As a 개발 관리자, I want 이름, 아이디, 이메일로 사용자를 검색하고 권한/상태/소속으로 필터링하고 싶다, so that 특정 사용자를 빠르게 찾을 수 있다.

#### Acceptance Criteria

1. THE Search_Filter SHALL 검색 입력 필드에 "이름, 아이디, 이메일 검색" 플레이스홀더를 표시하며, 최대 입력 길이를 100자로 제한한다
2. THE Search_Filter SHALL "권한 전체" 드롭다운 필터를 표시하며, 선택 옵션으로 전체, 관리자, 은행원, 고객을 제공한다
3. THE Search_Filter SHALL "상태 전체" 드롭다운 필터를 표시하며, 선택 옵션으로 전체, 활성, 비활성을 제공한다
4. THE Search_Filter SHALL "소속 전체" 드롭다운 필터를 표시하며, 선택 옵션으로 전체 및 백엔드 API에서 조회한 소속 목록을 제공한다
5. WHEN 사용자가 검색 입력 필드에 2자 이상 입력하고 300ms 동안 추가 입력이 없으면, THE User_Table SHALL 이름, 아이디, 이메일 중 입력값을 부분 문자열로 포함하는 사용자만 표시한다
6. WHEN 사용자가 검색 입력 필드의 입력값을 2자 미만으로 줄이면, THE User_Table SHALL 검색 조건을 해제하고 현재 필터 조건에 부합하는 전체 사용자를 표시한다
7. WHEN 사용자가 드롭다운 필터 값을 변경하면, THE User_Table SHALL 선택된 필터 조건과 현재 검색어를 AND 조합하여 부합하는 사용자만 표시한다
8. WHEN 사용자가 검색어 또는 필터를 변경하면, THE Pagination SHALL 페이지 번호를 1페이지로 초기화한다
9. IF 검색 및 필터 조건에 부합하는 사용자가 0명이면, THEN THE User_Table SHALL 데이터 영역에 결과 없음 안내 메시지를 표시한다

### Requirement 5: 액션 버튼 (엑셀 다운로드, 사용자 등록)

**User Story:** As a 개발 관리자, I want 사용자 목록을 엑셀로 다운로드하고 새 사용자를 등록하고 싶다, so that 사용자 데이터를 외부에서 활용하거나 신규 사용자를 추가할 수 있다.

#### Acceptance Criteria

1. THE User_Management_Page SHALL 검색/필터 영역 우측에 "엑셀 다운로드" 버튼과 "+ 사용자 등록" 버튼을 표시한다
2. WHEN 사용자가 "엑셀 다운로드" 버튼을 클릭하면, THE User_Management_Page SHALL 현재 필터 조건에 해당하는 사용자 목록을 테이블에 표시된 모든 컬럼을 포함하여 엑셀 파일(.xlsx)로 다운로드한다
3. IF 현재 필터 조건에 해당하는 사용자가 0건이면, THEN THE User_Management_Page SHALL "엑셀 다운로드" 버튼을 비활성화한다
4. WHEN 사용자가 "+ 사용자 등록" 버튼을 클릭하면, THE User_Management_Page SHALL 사용자 등록 모달을 표시한다
5. WHILE 엑셀 다운로드가 진행 중이면, THE User_Management_Page SHALL "엑셀 다운로드" 버튼을 비활성화하고 버튼 내에 스피너를 표시한다
6. IF 엑셀 다운로드 API 호출이 실패하면, THEN THE User_Management_Page SHALL "엑셀 다운로드" 버튼을 활성화 상태로 복원하고 다운로드 실패를 나타내는 에러 메시지를 표시한다
7. WHEN 엑셀 다운로드가 완료되면, THE User_Management_Page SHALL "엑셀 다운로드" 버튼을 활성화 상태로 복원한다

### Requirement 6: 사용자 데이터 테이블 표시

**User Story:** As a 개발 관리자, I want 사용자 목록을 테이블 형태로 조회하고 싶다, so that 각 사용자의 주요 정보를 한눈에 비교할 수 있다.

#### Acceptance Criteria

1. THE User_Table SHALL 번호, 아이디, 이름, 이메일, 권한, 소속, 상태, 최근 로그인, 관리 컬럼을 순서대로 표시한다
2. IF 사용자 데이터가 1건 이상 존재하면, THEN THE User_Table SHALL 각 사용자를 한 행으로 표시한다
3. IF 사용자 데이터가 0건이면, THEN THE User_Table SHALL 테이블 헤더를 유지한 채 데이터 영역에 "조회된 사용자가 없습니다." 메시지를 표시한다
4. THE User_Table SHALL "번호" 컬럼에 전체 사용자 수(totalCount)에서 현재 페이지 오프셋을 차감한 내림차순 순번을 표시한다 (순번 = totalCount - ((currentPage - 1) × pageSize + rowIndex))
5. IF "최근 로그인" 값이 존재하면, THEN THE User_Table SHALL 해당 값을 "YYYY.MM.DD HH:mm" 형식으로 표시한다
6. IF "최근 로그인" 값이 존재하지 않으면, THEN THE User_Table SHALL 해당 셀에 "-"을 표시한다
7. THE User_Table SHALL "관리" 컬럼에 각 행마다 "수정" 버튼을 표시한다
8. WHEN 사용자가 "수정" 버튼을 클릭하면, THE User_Management_Page SHALL 해당 사용자의 정보 수정 모달을 표시한다
9. IF 사용자 데이터 조회에 실패하면, THEN THE User_Table SHALL 테이블 영역에 조회 실패를 나타내는 에러 메시지를 표시한다

### Requirement 7: 권한 뱃지 표시

**User Story:** As a 개발 관리자, I want 각 사용자의 권한을 색상으로 구분하여 확인하고 싶다, so that 권한별 사용자를 시각적으로 빠르게 식별할 수 있다.

#### Acceptance Criteria

1. WHILE User_Role이 ADMIN_DEV이면, THE Role_Badge SHALL "관리자" 텍스트를 파란색 계열 배경에 동일 계열 텍스트 색상으로 둥근 pill 형태(rounded-full)로 표시한다
2. WHILE User_Role이 ADMIN_BANK_TELLER 또는 ADMIN_BANK_MANAGER이면, THE Role_Badge SHALL "은행원" 텍스트를 초록색 계열 배경에 동일 계열 텍스트 색상으로 둥근 pill 형태(rounded-full)로 표시한다
3. WHILE User_Role이 USER이면, THE Role_Badge SHALL "고객" 텍스트를 주황색 계열 배경에 동일 계열 텍스트 색상으로 둥근 pill 형태(rounded-full)로 표시한다
4. IF User_Role이 정의된 역할(ADMIN_DEV, ADMIN_BANK_TELLER, ADMIN_BANK_MANAGER, USER) 중 어느 것에도 해당하지 않으면, THEN THE Role_Badge SHALL 역할 원본 텍스트를 회색 배경으로 표시한다

### Requirement 8: 사용자 상태 표시

**User Story:** As a 개발 관리자, I want 각 사용자의 활성/비활성 상태를 시각적으로 확인하고 싶다, so that 비활성 계정을 빠르게 식별할 수 있다.

#### Acceptance Criteria

1. WHILE User_Status가 ACTIVE이면, THE Status_Indicator SHALL 초록색(green) 원형 도트와 "활성" 텍스트 레이블을 초록색(green) 스타일로 표시한다
2. WHILE User_Status가 INACTIVE이면, THE Status_Indicator SHALL 빨간색(red) 원형 도트와 "비활성" 텍스트 레이블을 빨간색(red) 스타일로 표시한다
3. IF User_Status가 ACTIVE 또는 INACTIVE가 아닌 알 수 없는 값이면, THEN THE Status_Indicator SHALL 회색(gray) 원형 도트와 원본 상태값 텍스트를 회색(gray) 스타일로 표시한다

### Requirement 9: 페이지네이션

**User Story:** As a 개발 관리자, I want 사용자 목록을 페이지 단위로 나누어 조회하고 싶다, so that 대량의 사용자 데이터를 효율적으로 탐색할 수 있다.

#### Acceptance Criteria

1. THE Pagination SHALL 테이블 하단에 첫 페이지(first), 이전(prev), 페이지 번호 버튼(최대 5개), 다음(next), 마지막(last) 버튼과 페이지당 표시 건수 선택 드롭다운을 표시한다
2. THE Pagination SHALL 기본 페이지당 표시 건수를 10건으로 설정한다
3. THE Pagination SHALL 페이지당 표시 건수 옵션으로 10, 20, 50을 제공한다
4. WHEN 사용자가 페이지 번호를 클릭하면, THE User_Table SHALL 해당 페이지의 사용자 데이터를 표시한다
5. WHEN 사용자가 페이지당 표시 건수를 변경하면, THE Pagination SHALL 페이지 번호를 1페이지로 초기화하고 변경된 건수만큼 데이터를 표시한다
6. THE Pagination SHALL 현재 활성 페이지 번호 버튼을 비활성 페이지 번호 버튼과 구별되는 배경색으로 강조 표시한다
7. THE Pagination SHALL 총 페이지 수를 기반으로 페이지 번호 버튼을 동적으로 생성하되, 한 번에 최대 5개의 페이지 번호 버튼을 표시하고 생략된 페이지 범위는 말줄임표(ellipsis)로 표시한다
8. IF 현재 페이지가 1페이지이면, THEN THE Pagination SHALL 첫 페이지(first) 버튼과 이전(prev) 버튼을 비활성화 상태로 표시한다
9. IF 현재 페이지가 마지막 페이지이면, THEN THE Pagination SHALL 마지막(last) 버튼과 다음(next) 버튼을 비활성화 상태로 표시한다
10. IF 조회 결과가 0건이면, THEN THE Pagination SHALL 페이지 번호 버튼을 표시하지 않고 네비게이션 버튼을 모두 비활성화 상태로 표시한다

### Requirement 10: 데이터 로딩 및 에러 상태 처리

**User Story:** As a 개발 관리자, I want 데이터 로딩 중 및 에러 발생 시 적절한 피드백을 받고 싶다, so that 시스템 상태를 인지하고 적절히 대응할 수 있다.

#### Acceptance Criteria

1. WHILE 사용자 목록 데이터를 로딩 중이면(React Query의 isLoading이 true), THE User_Management_Page SHALL 테이블 영역을 LoadingState 컴포넌트로 대체하여 로딩 스피너와 로딩 메시지를 표시한다
2. WHEN 사용자 목록 데이터 로딩이 완료되면, THE User_Management_Page SHALL 로딩 스피너를 제거하고 테이블 데이터를 표시한다
3. IF 데이터 조회 중 오류가 발생하면(React Query의 isError가 true), THEN THE User_Management_Page SHALL 테이블 영역을 ErrorState 컴포넌트로 대체하여 서버에서 반환된 오류 원인을 포함한 에러 메시지와 "다시 시도" 버튼을 표시한다
4. WHEN 사용자가 "다시 시도" 버튼을 클릭하면, THE User_Management_Page SHALL 로딩 상태로 전환한 후 사용자 목록 데이터를 다시 조회한다
5. IF 데이터 조회 결과 사용자 목록이 0건이면, THEN THE User_Management_Page SHALL 에러 상태가 아닌 빈 상태 안내 메시지를 테이블 영역에 표시한다

### Requirement 11: React Query를 통한 서버 상태 관리

**User Story:** As a 개발자, I want React Query를 사용하여 사용자 목록 및 통계 데이터를 관리하고 싶다, so that 캐싱, 로딩, 에러 처리를 일관되게 관리할 수 있다.

#### Acceptance Criteria

1. THE User_Management_Page SHALL React Query의 useQuery 훅을 사용하여 `src/api` 디렉토리에 정의된 사용자 목록 조회 함수를 queryFn으로 호출하고, 공통 axiosInstance를 통해 요청을 수행한다
2. THE User_Management_Page SHALL `USER_KEYS.list()` 쿼리 키를 사용하여 사용자 목록 데이터를 캐싱한다
3. THE User_Management_Page SHALL `USER_KEYS.statistics()` 쿼리 키를 사용하여 통계 데이터를 캐싱한다
4. THE User_Management_Page SHALL useQuery의 staleTime을 30초(30,000ms)로 설정하여 동일 쿼리 키에 대한 중복 네트워크 요청을 방지한다
5. WHEN 탭, 검색어, 필터, 페이지 번호 중 하나 이상이 변경되면, THE User_Management_Page SHALL 변경된 파라미터를 쿼리 키 배열에 포함하여 React Query가 새로운 데이터를 자동으로 fetch하도록 한다
6. WHILE useQuery가 데이터를 fetch하는 동안(isLoading이 true), THE User_Management_Page SHALL 로딩 상태 UI를 표시한다
7. IF useQuery의 queryFn 호출이 실패하면(isError가 true), THEN THE User_Management_Page SHALL 에러 상태 UI를 표시하고, 사용자가 재조회를 시도할 수 있는 수단을 제공한다
8. THE User_Management_Page SHALL useQuery의 retry 옵션을 최대 3회로 설정하여 일시적 네트워크 오류 시 자동 재시도를 수행한다

### Requirement 12: 접근 권한 제어

**User Story:** As a 시스템 관리자, I want 사용자 관리 페이지에 DEV_ADMIN 권한을 가진 사용자만 접근할 수 있도록 하고 싶다, so that 권한이 없는 사용자가 사용자 정보를 조회하거나 수정하는 것을 방지할 수 있다.

#### Acceptance Criteria

1. THE User_Management_Page SHALL ROUTE_CONFIG의 사용자 관리 항목에 정의된 allowedRoles 목록에 현재 로그인한 사용자의 역할이 포함된 경우에만 페이지 콘텐츠를 렌더링한다
2. IF 현재 로그인한 사용자의 역할이 ROUTE_CONFIG의 사용자 관리 항목 allowedRoles에 포함되지 않으면, THEN THE User_Management_Page SHALL 페이지 콘텐츠 대신 권한 없음 안내를 렌더링하여 접근 권한이 없음을 안내하고, 대시보드 이동 버튼과 이전 페이지 버튼을 제공한다
3. IF 사용자가 인증되지 않은 상태(세션 없음)에서 사용자 관리 페이지에 접근하면, THEN THE User_Management_Page SHALL 로그인 페이지(/login)로 리다이렉트한다
4. THE Sidebar SHALL ROUTE_CONFIG의 각 메뉴 항목에 정의된 allowedRoles에 현재 사용자의 역할이 포함된 항목만 메뉴에 표시한다
