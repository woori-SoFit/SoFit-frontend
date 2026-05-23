# Requirements Document

## Introduction

SoFit 고객용 앱(user-front)의 마이페이지 UI를 구현합니다. 마이페이지는 사용자 프로필 확인, 사업자 정보 조회, 푸시 알림 설정, 로그아웃, 회원 탈퇴 기능을 제공하는 화면입니다. 기존에 준비된 빈 placeholder 파일들을 스크린샷 디자인에 맞춰 완성합니다.

## Glossary

- **MyPage_Main**: 마이페이지 메인 화면 컴포넌트 (/mypage 경로)
- **Profile_Card**: 마이페이지 상단에 표시되는 사용자 프로필 영역 (아바타, 이름, 아이디)
- **Profile_Page**: 내 정보 확인 페이지 (/mypage/profile 경로)
- **BusinessInfo_Page**: 사업자 정보 확인 페이지 (/mypage/business 경로)
- **Notifications_Page**: 알림 목록 페이지 (/mypage/notifications 경로)
- **Push_Toggle**: 푸시 알림 설정 토글 스위치 컴포넌트
- **Menu_Item**: 마이페이지 메뉴 목록의 개별 항목 (텍스트 + chevron right 아이콘)
- **useMe_Hook**: 현재 로그인 사용자 정보를 조회하는 React Query 훅
- **axiosInstance**: 공통 Axios 인스턴스 (baseURL: "/api", withCredentials: true)
- **Logout_Dialog**: 로그아웃 확인 다이얼로그
- **Withdraw_Dialog**: 회원 탈퇴 확인 다이얼로그

## Requirements

### Requirement 1: 마이페이지 메인 화면 레이아웃

**User Story:** As a 소상공인 고객, I want to 마이페이지 메인 화면에서 내 프로필과 주요 메뉴를 한눈에 확인하고 싶다, so that 원하는 기능에 빠르게 접근할 수 있다.

#### Acceptance Criteria

1. WHEN a 사용자가 /mypage 경로에 접근하면, THE MyPage_Main SHALL 상단에 "마이페이지" 타이틀과 뒤로가기 버튼을 포함한 헤더를 표시한다
2. WHEN the MyPage_Main이 렌더링되면, THE Profile_Card SHALL useMe_Hook에서 조회한 사용자 이름과 로그인 아이디를 표시한다
3. WHEN the MyPage_Main이 렌더링되면, THE Profile_Card SHALL SoFit 캐릭터 아바타 이미지를 표시한다
4. THE MyPage_Main SHALL "내 정보 확인" Menu_Item을 표시하고 chevron right 아이콘을 포함한다
5. THE MyPage_Main SHALL "사업자 정보 확인" Menu_Item을 표시하고 chevron right 아이콘을 포함한다
6. THE MyPage_Main SHALL "푸시 알림" 섹션에 설명 텍스트와 Push_Toggle을 표시한다
7. THE MyPage_Main SHALL "로그아웃" Menu_Item을 표시하고 chevron right 아이콘을 포함한다
8. THE MyPage_Main SHALL "회원 탈퇴" Menu_Item을 빨간색 텍스트로 표시하고 chevron right 아이콘을 포함한다

### Requirement 2: 마이페이지 메뉴 네비게이션

**User Story:** As a 소상공인 고객, I want to 마이페이지 메뉴 항목을 탭하여 해당 페이지로 이동하고 싶다, so that 원하는 정보를 확인할 수 있다.

#### Acceptance Criteria

1. WHEN a 사용자가 "내 정보 확인" Menu_Item을 탭하면, THE MyPage_Main SHALL /mypage/profile 경로로 네비게이션한다
2. WHEN a 사용자가 "사업자 정보 확인" Menu_Item을 탭하면, THE MyPage_Main SHALL /mypage/business 경로로 네비게이션한다
3. WHEN a 사용자가 뒤로가기 버튼을 탭하면, THE MyPage_Main SHALL 이전 페이지로 네비게이션한다

### Requirement 3: 푸시 알림 설정

**User Story:** As a 소상공인 고객, I want to 푸시 알림 수신 여부를 토글로 설정하고 싶다, so that 원하는 알림만 받을 수 있다.

#### Acceptance Criteria

1. THE Push_Toggle SHALL 현재 푸시 알림 설정 상태를 시각적으로 표시한다 (ON/OFF)
2. WHEN a 사용자가 Push_Toggle을 탭하면, THE Push_Toggle SHALL 설정 상태를 반전시키고 localStorage에 저장한다
3. WHEN the MyPage_Main이 마운트되면, THE Push_Toggle SHALL localStorage에서 저장된 설정 상태를 불러와 표시한다

### Requirement 4: 로그아웃

**User Story:** As a 소상공인 고객, I want to 로그아웃 버튼을 눌러 안전하게 로그아웃하고 싶다, so that 내 계정을 보호할 수 있다.

#### Acceptance Criteria

1. WHEN a 사용자가 "로그아웃" Menu_Item을 탭하면, THE MyPage_Main SHALL Logout_Dialog를 표시한다
2. WHEN a 사용자가 Logout_Dialog에서 확인을 탭하면, THE MyPage_Main SHALL POST /api/auth/logout 요청을 axiosInstance로 전송한다
3. WHEN the 로그아웃 API 요청이 성공하면, THE MyPage_Main SHALL React Query 캐시를 초기화하고 /login 경로로 리다이렉트한다
4. WHEN a 사용자가 Logout_Dialog에서 취소를 탭하면, THE Logout_Dialog SHALL 닫히고 현재 상태를 유지한다

### Requirement 5: 회원 탈퇴

**User Story:** As a 소상공인 고객, I want to 회원 탈퇴를 진행하고 싶다, so that 더 이상 서비스를 이용하지 않을 때 계정을 비활성화할 수 있다.

#### Acceptance Criteria

1. WHEN a 사용자가 "회원 탈퇴" Menu_Item을 탭하면, THE MyPage_Main SHALL Withdraw_Dialog를 표시한다
2. THE Withdraw_Dialog SHALL 탈퇴 시 유의사항을 명확하게 안내한다
3. WHEN a 사용자가 Withdraw_Dialog에서 탈퇴 확인을 탭하면, THE MyPage_Main SHALL DELETE /api/users/me 요청을 axiosInstance로 전송한다
4. WHEN the 회원 탈퇴 API 요청이 성공하면, THE MyPage_Main SHALL React Query 캐시를 초기화하고 /login 경로로 리다이렉트한다
5. WHEN a 사용자가 Withdraw_Dialog에서 취소를 탭하면, THE Withdraw_Dialog SHALL 닫히고 현재 상태를 유지한다

### Requirement 6: 내 정보 확인 페이지

**User Story:** As a 소상공인 고객, I want to 내 기본 정보를 확인하고 싶다, so that 등록된 정보가 정확한지 확인할 수 있다.

#### Acceptance Criteria

1. WHEN a 사용자가 /mypage/profile 경로에 접근하면, THE Profile_Page SHALL 상단에 "내 정보 확인" 타이틀과 뒤로가기 버튼을 포함한 헤더를 표시한다
2. THE Profile_Page SHALL useMe_Hook에서 조회한 사용자 이름을 표시한다
3. THE Profile_Page SHALL useMe_Hook에서 조회한 로그인 아이디를 표시한다
4. THE Profile_Page SHALL 사용자 연락처 정보를 표시한다
5. WHILE useMe_Hook이 로딩 중이면, THE Profile_Page SHALL 로딩 상태를 표시한다

### Requirement 7: 사업자 정보 확인 페이지

**User Story:** As a 소상공인 고객, I want to 등록된 사업자 정보를 확인하고 싶다, so that 사업자 정보가 정확하게 등록되어 있는지 확인할 수 있다.

#### Acceptance Criteria

1. WHEN a 사용자가 /mypage/business 경로에 접근하면, THE BusinessInfo_Page SHALL 상단에 "사업자 정보 확인" 타이틀과 뒤로가기 버튼을 포함한 헤더를 표시한다
2. WHEN the BusinessInfo_Page가 마운트되면, THE BusinessInfo_Page SHALL GET /api/users/me/business 요청을 axiosInstance로 전송하여 사업자 정보를 조회한다
3. THE BusinessInfo_Page SHALL 사업자등록번호를 표시한다
4. THE BusinessInfo_Page SHALL 상호명을 표시한다
5. THE BusinessInfo_Page SHALL 업종을 표시한다
6. THE BusinessInfo_Page SHALL 개업일을 표시한다
7. THE BusinessInfo_Page SHALL 대표자명을 표시한다
8. WHILE 사업자 정보 API가 로딩 중이면, THE BusinessInfo_Page SHALL 로딩 상태를 표시한다
9. IF 사업자 정보 API 요청이 실패하면, THEN THE BusinessInfo_Page SHALL 에러 메시지를 표시한다

### Requirement 8: 알림 목록 페이지

**User Story:** As a 소상공인 고객, I want to 알림 목록을 확인하고 싶다, so that 대출 심사 상태 변경 등 중요한 알림을 놓치지 않을 수 있다.

#### Acceptance Criteria

1. WHEN a 사용자가 /mypage/notifications 경로에 접근하면, THE Notifications_Page SHALL 상단에 "알림" 타이틀과 뒤로가기 버튼을 포함한 헤더를 표시한다
2. WHEN the Notifications_Page가 마운트되면, THE Notifications_Page SHALL GET /api/notifications 요청을 axiosInstance로 전송하여 알림 목록을 조회한다
3. THE Notifications_Page SHALL 각 알림의 제목, 내용, 시간을 목록 형태로 표시한다
4. WHILE 알림 목록 API가 로딩 중이면, THE Notifications_Page SHALL 로딩 상태를 표시한다
5. IF 알림 목록이 비어있으면, THEN THE Notifications_Page SHALL "알림이 없습니다" 빈 상태 메시지를 표시한다
6. IF 알림 목록 API 요청이 실패하면, THEN THE Notifications_Page SHALL 에러 메시지를 표시한다
