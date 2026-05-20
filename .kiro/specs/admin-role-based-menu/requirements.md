# Requirements Document

## Introduction

SoFit admin-front 은행원 페이지의 역할별 메뉴/탭 분리 리팩토링을 정의한다. 기존에는 모든 관리자가 동일한 사이드바 메뉴를 보았으나, ADMIN_DEV, ADMIN_BANK_TELLER, ADMIN_BANK_MANAGER 세 역할에 따라 접근 가능한 메뉴를 분리한다. 페이지 콘텐츠(mock 데이터 기반 UI)는 별도 스펙에서 다루며, 이번 스펙은 역할 조회, 메뉴 필터링, 권한 가드, 라우팅 확장에 집중한다.

## Glossary

- **Admin_App**: admin-front React 애플리케이션 전체
- **Sidebar**: 좌측 고정 사이드바 네비게이션 컴포넌트
- **AuthMe_API**: 서버 `/api/auth/me` 엔드포인트. 현재 로그인한 사용자의 정보(id, name, role)를 반환
- **Role**: 관리자 역할. ADMIN_DEV, ADMIN_BANK_TELLER, ADMIN_BANK_MANAGER 중 하나
- **ADMIN_DEV**: 개발자 역할. 모든 메뉴에 접근 가능
- **ADMIN_BANK_TELLER**: 은행원 역할. 대출, 관리 카테고리 접근 가능. 시스템 카테고리 접근 불가
- **ADMIN_BANK_MANAGER**: 지점장 역할. 대출(지점장 결재 포함), 관리 카테고리 접근 가능. 시스템 카테고리 접근 불가
- **Permission_Config**: 역할별 메뉴 접근 권한을 정의하는 설정 객체
- **Forbidden_Page**: 권한 없는 페이지 접근 시 표시하는 403 에러 페이지
- **ManagerApprovalPage**: 지점장 결재 페이지 (ADMIN_BANK_MANAGER, ADMIN_DEV 전용)
- **ReviewHistoryPage**: 심사 내역 조회 페이지

## Requirements

### Requirement 1: 사용자 역할 정보 조회 및 저장

**User Story:** As a 관리자, I want 로그인 후 내 역할 정보가 자동으로 조회되길 원한다, so that 역할에 맞는 메뉴와 기능을 사용할 수 있다.

#### Acceptance Criteria

1. WHEN 관리자가 로그인에 성공하면, THE Admin_App SHALL AuthMe_API를 호출하여 사용자 정보(id, name, role)를 조회한다.
2. WHEN AuthMe_API 응답이 성공하면, THE Admin_App SHALL 조회된 사용자 정보를 React Query 캐시에 저장하여 앱 내 모든 컴포넌트에서 queryKey를 통해 조회 가능하게 한다.
3. IF AuthMe_API 호출이 실패하면(네트워크 오류 또는 HTTP 401 응답), THEN THE Admin_App SHALL 로그인 페이지로 리다이렉트한다.
4. THE Admin_App SHALL role 필드 값으로 ADMIN_DEV, ADMIN_BANK_TELLER, ADMIN_BANK_MANAGER 중 하나를 수신한다.
5. IF AuthMe_API 응답의 role 값이 ADMIN_DEV, ADMIN_BANK_TELLER, ADMIN_BANK_MANAGER 중 하나가 아니면, THEN THE Admin_App SHALL 로그인 페이지로 리다이렉트한다.
6. WHEN 관리자가 로그아웃하면, THE Admin_App SHALL React Query 캐시에 저장된 사용자 정보를 삭제한다.

### Requirement 2: 역할별 사이드바 메뉴 필터링

**User Story:** As a 관리자, I want 내 역할에 맞는 메뉴만 사이드바에 표시되길 원한다, so that 불필요한 메뉴에 혼란받지 않고 업무에 집중할 수 있다.

#### Acceptance Criteria

1. THE Sidebar SHALL Permission_Config에 정의된 역할별 접근 권한에 따라 메뉴를 필터링하여, 현재 로그인한 사용자의 역할에 허용된 메뉴 항목만 렌더링한다.
2. WHILE 사용자 역할이 ADMIN_DEV인 경우, THE Sidebar SHALL "대출" 카테고리(대출 신청 현황, 심사 내역 조회, 지점장 결재), "관리" 카테고리(고객 관리), "시스템" 카테고리(API 로그, S등급 배치 관리)를 포함한 모든 메뉴를 표시한다.
3. WHILE 사용자 역할이 ADMIN_BANK_TELLER인 경우, THE Sidebar SHALL "대출" 카테고리(대출 신청 현황, 심사 내역 조회)와 "관리" 카테고리(고객 관리)만 표시한다.
4. WHILE 사용자 역할이 ADMIN_BANK_MANAGER인 경우, THE Sidebar SHALL "대출" 카테고리(대출 신청 현황, 심사 내역 조회, 지점장 결재)와 "관리" 카테고리(고객 관리)를 표시한다.
5. THE Sidebar SHALL 사용자 이름과 역할에 대응하는 한글 표시명(ADMIN_DEV → "개발 관리자", ADMIN_BANK_TELLER → "은행원", ADMIN_BANK_MANAGER → "지점장")을 사이드바 상단 영역에 표시한다.
6. IF 사용자 역할 정보를 조회할 수 없거나 인식되지 않는 역할인 경우, THEN THE Sidebar SHALL 메뉴를 표시하지 않고 로그인 페이지로 리다이렉트한다.

### Requirement 3: 역할별 메뉴 접근 권한 설정

**User Story:** As a 개발자, I want 역할별 메뉴 접근 권한을 중앙에서 관리하고 싶다, so that 향후 메뉴 추가 시 권한 설정을 쉽게 확장할 수 있다.

#### Acceptance Criteria

1. THE Permission_Config SHALL 각 메뉴 항목에 대해 접근 가능한 역할 목록을 단일 설정 객체로 정의하며, 각 메뉴 항목은 최소 1개 이상의 역할을 포함해야 한다.
2. THE Permission_Config SHALL 다음 메뉴 접근 규칙을 포함한다:
   - "대출 신청 현황": ADMIN_DEV, ADMIN_BANK_TELLER, ADMIN_BANK_MANAGER
   - "심사 내역 조회": ADMIN_DEV, ADMIN_BANK_TELLER, ADMIN_BANK_MANAGER
   - "지점장 결재": ADMIN_DEV, ADMIN_BANK_MANAGER
   - "고객 관리": ADMIN_DEV, ADMIN_BANK_TELLER, ADMIN_BANK_MANAGER
   - "API 로그": ADMIN_DEV
   - "S등급 배치 관리": ADMIN_DEV
3. WHEN 새로운 메뉴 항목을 추가할 때, THE Permission_Config SHALL 기존 설정 객체에 메뉴 키와 역할 배열 1개 항목만 추가하면 권한이 적용되는 구조를 유지한다.
4. IF 사용자가 자신의 역할에 허용되지 않은 메뉴에 URL 직접 입력으로 접근을 시도하면, THEN THE Admin_App SHALL 해당 페이지 렌더링을 차단하고 Forbidden_Page를 표시한다.
5. WHILE 사용자가 로그인 상태일 때, THE Admin_App SHALL Permission_Config에서 현재 사용자의 역할에 허용된 메뉴 항목만 사이드바에 표시하고, 비허용 메뉴 항목은 렌더링하지 않는다.

### Requirement 4: 권한 없는 페이지 접근 차단

**User Story:** As a 시스템 관리자, I want 권한 없는 사용자가 URL 직접 입력으로 페이지에 접근하는 것을 차단하고 싶다, so that 보안이 유지된다.

#### Acceptance Criteria

1. WHEN 인증된 사용자가 자신의 역할에 허용되지 않은 경로에 URL을 직접 입력하여 접근하면, THE Admin_App SHALL Forbidden_Page를 표시한다.
2. THE Forbidden_Page SHALL "접근 권한이 없습니다" 메시지를 표시한다.
3. THE Forbidden_Page SHALL 대시보드로 이동할 수 있는 버튼과 이전 페이지로 돌아갈 수 있는 버튼을 함께 제공한다.
4. THE Admin_App SHALL 각 라우트에 접근 가능한 역할을 정의하고, 현재 사용자의 역할과 비교하여 접근 허용 여부를 판단한다.
5. IF 브라우저 히스토리가 존재하지 않는 경우(직접 URL 입력으로 최초 진입), THEN THE Forbidden_Page SHALL 이전 페이지 버튼 클릭 시 대시보드로 이동한다.
6. IF 미인증 사용자가 로그인이 필요한 경로에 접근하면, THEN THE Admin_App SHALL 로그인 페이지로 리다이렉트한다.

### Requirement 5: 라우팅 구조 확장

**User Story:** As a 개발자, I want 새로운 페이지에 대한 라우트를 추가하고 싶다, so that URL 기반 페이지 전환이 동작한다.

#### Acceptance Criteria

1. THE Admin_App SHALL /loan/:id 경로에 LoanDetailPage placeholder를 매핑한다.
2. THE Admin_App SHALL /manager-approval 경로에 ManagerApprovalPage placeholder를 매핑한다.
3. THE Admin_App SHALL /review-history 경로에 ReviewHistoryPage placeholder를 매핑한다.
4. THE Admin_App SHALL 각 라우트에 허용 역할을 지정하여 역할 기반 가드를 적용한다.
5. IF 인증된 사용자가 허용 역할에 포함되지 않는 라우트에 접근하면, THEN THE Admin_App SHALL Forbidden_Page를 렌더링한다.
6. IF 미인증 사용자가 인증이 필요한 라우트에 접근하면, THEN THE Admin_App SHALL /login 경로로 리다이렉트한다.
7. IF 사용자가 정의되지 않은 경로에 접근하면, THEN THE Admin_App SHALL 대시보드 페이지로 리다이렉트한다.

### Requirement 6: 사이드바 메뉴 구조 업데이트

**User Story:** As a 관리자, I want 사이드바에서 새로 추가된 페이지에도 접근하고 싶다, so that 모든 업무 기능을 사이드바에서 탐색할 수 있다.

#### Acceptance Criteria

1. THE Sidebar SHALL "대출" 카테고리에 "대출 신청 현황", "심사 내역 조회" 메뉴를 위에서부터 해당 순서대로 표시한다.
2. WHILE 사용자 역할이 ADMIN_BANK_MANAGER 또는 ADMIN_DEV인 경우, THE Sidebar SHALL "대출" 카테고리에 "지점장 결재" 메뉴를 "심사 내역 조회" 아래에 추가로 표시하고, 해당 역할이 아닌 사용자에게는 "지점장 결재" 메뉴를 표시하지 않는다.
3. THE Sidebar SHALL "관리" 카테고리에 "고객 관리" 메뉴를 표시한다.
4. WHILE 사용자 역할이 ADMIN_DEV인 경우, THE Sidebar SHALL "시스템" 카테고리에 "API 로그", "S등급 배치 관리" 메뉴를 표시하고, 해당 역할이 아닌 사용자에게는 "시스템" 카테고리 자체를 표시하지 않는다.
5. WHEN 사용자가 사이드바의 메뉴 항목을 클릭하면, THE Sidebar SHALL 해당 메뉴에 매핑된 페이지로 화면을 전환하고, 클릭된 메뉴 항목을 현재 활성 상태로 시각적으로 구분하여 표시한다.
