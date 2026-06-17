# Requirements Document

## Introduction

알림 페이지 API 연동 기능은 기존 Mock 데이터 기반의 알림 UI를 실제 백엔드 API와 연결하는 작업이다. SSE(Server-Sent Events)를 통한 실시간 알림 수신, 미읽음 알림 조회, 전체 알림 목록 조회, 알림 읽음 처리 API를 연동하여 사용자에게 실시간 알림 경험을 제공한다.

## Glossary

- **Notification_System**: 알림 관련 API 연동 및 상태 관리를 담당하는 프론트엔드 시스템
- **SSE_Client**: Server-Sent Events 프로토콜을 통해 서버와 실시간 연결을 유지하는 클라이언트 모듈
- **Notification_Store**: Zustand 기반의 알림 클라이언트 상태 저장소 (미읽음 개수, 실시간 알림 목록)
- **Notification_API**: axiosInstance를 통해 알림 관련 REST API를 호출하는 모듈
- **Unread_Badge**: AppHeader에 표시되는 미읽음 알림 개수 뱃지 UI 요소
- **Notification_Item**: 개별 알림 항목 (id, type, title, message, isRead, createdAt 등)
- **NotificationType**: 알림 유형 (LOAN_SUBMITTED, LOAN_DECIDED, LOAN_EXECUTED)

## Requirements

### Requirement 1: SSE 연결 수립 및 실시간 알림 수신

**User Story:** As a 로그인 사용자, I want 앱 진입 시 서버와 실시간 연결이 수립되어 알림을 즉시 받을 수 있기를, so that 대출 진행 상태 변경을 실시간으로 확인할 수 있다.

#### Acceptance Criteria

1. WHEN 사용자가 로그인 상태로 앱에 진입하면, THE SSE_Client SHALL GET /api/notifications/subscribe 엔드포인트로 SSE 연결을 수립한다.
2. WHEN SSE 연결이 성공적으로 수립되면, THE SSE_Client SHALL event: connect, data: connected 메시지를 수신하여 연결 상태를 확인한다.
3. WHEN event: notification 이벤트를 수신하면, THE Notification_Store SHALL 수신된 알림 데이터를 알림 목록 상단에 추가한다.
4. WHEN event: notification 이벤트를 수신하면, THE Notification_Store SHALL 미읽음 알림 개수를 1 증가시킨다.
5. WHILE SSE 연결이 유지되는 동안, THE SSE_Client SHALL withCredentials: true 옵션을 사용하여 세션 쿠키 기반 인증을 유지한다.
6. IF SSE 연결이 끊어지면, THEN THE SSE_Client SHALL 최대 5회까지 3초 간격으로 자동 재연결을 시도한다.
7. IF 재연결 최대 시도 횟수(5회)를 초과하면, THEN THE SSE_Client SHALL 재연결 시도를 중단하고 사용자에게 연결 실패 상태를 표시한다.
8. WHEN SSE 재연결이 성공하면, THE SSE_Client SHALL 서버로부터 연결 해제 동안 발생한 미수신 알림을 수신하여 Notification_Store에 반영한다.
9. WHEN 사용자가 로그아웃하면, THE SSE_Client SHALL SSE 연결을 종료하고 재연결 시도를 중단한다.

### Requirement 2: 미읽음 알림 조회

**User Story:** As a 로그인 사용자, I want 앱 재진입 시 오프라인 동안 놓친 미읽음 알림을 확인할 수 있기를, so that 부재 중 발생한 알림을 놓치지 않을 수 있다.

#### Acceptance Criteria

1. WHEN 사용자가 로그인 상태로 앱에 진입하면, THE Notification_API SHALL 미읽음 알림 목록 조회 API를 호출하여 미읽음 알림 목록을 조회한다.
2. WHEN 미읽음 알림 조회가 성공하면, THE Notification_Store SHALL 응답의 notifications 배열에서 isRead가 false인 항목의 개수를 미읽음 개수로 설정한다.
3. IF 미읽음 알림 개수가 1 이상 99 이하이면, THEN THE Unread_Badge SHALL AppHeader의 알림 아이콘 위에 미읽음 개수를 숫자로 표시한다.
4. IF 미읽음 알림 개수가 99를 초과하면, THEN THE Unread_Badge SHALL "99+"로 표시한다.
5. IF 미읽음 알림 개수가 0이면, THEN THE Unread_Badge SHALL 뱃지를 표시하지 않는다.
6. IF 미읽음 알림 조회 API 호출이 실패하면, THEN THE Unread_Badge SHALL 뱃지를 표시하지 않으며, 이전 미읽음 개수를 유지하지 않는다.
7. WHILE 미읽음 알림 조회 API 응답을 대기하는 동안, THE Unread_Badge SHALL 뱃지를 표시하지 않는다.

### Requirement 3: 전체 알림 목록 조회

**User Story:** As a 로그인 사용자, I want 알림함을 열었을 때 전체 알림 목록을 확인할 수 있기를, so that 읽음/미읽음 상태와 함께 모든 알림 이력을 볼 수 있다.

#### Acceptance Criteria

1. WHEN 사용자가 알림 페이지(/notifications)에 진입하면, THE Notification_System SHALL 전체 알림 목록을 최신순(createdAt 내림차순)으로 조회하여 표시한다.
2. WHILE 알림 목록을 표시하는 동안, THE Notification_System SHALL 각 알림 항목에 알림 제목, 알림 내용, 읽음/미읽음 상태 표시, 알림 타입별 아이콘을 포함하여 렌더링한다.
3. WHILE 알림 목록을 표시하는 동안, THE Notification_System SHALL 미읽음 알림에 읽음 알림과 시각적으로 구분되는 미읽음 표시를 유지한다.
4. WHILE 알림 목록을 표시하는 동안, THE Notification_System SHALL 알림 타입(LOAN_SUBMITTED, LOAN_DECIDED, LOAN_EXECUTED)에 따라 각각 구분된 아이콘을 표시한다.
5. WHEN 알림 목록이 비어있으면, THE Notification_System SHALL "알림이 없습니다" 빈 상태 메시지를 표시한다.
6. WHILE 알림 목록을 로딩하는 동안, THE Notification_System SHALL 알림 목록 영역에 로딩 인디케이터를 표시하고, 알림 목록 콘텐츠는 표시하지 않는다.
7. IF 알림 목록 조회가 실패하면, THEN THE Notification_System SHALL 조회 실패를 나타내는 에러 메시지와 재시도 버튼을 표시한다.
8. WHEN 사용자가 에러 상태에서 재시도 버튼을 누르면, THE Notification_System SHALL 알림 목록 조회를 다시 시도한다.

### Requirement 4: 알림 읽음 처리

**User Story:** As a 로그인 사용자, I want 알림을 클릭하여 읽음 처리할 수 있기를, so that 확인한 알림과 미확인 알림을 구분할 수 있다.

#### Acceptance Criteria

1. WHEN 사용자가 미읽음 상태의 알림 항목을 클릭하면, THE Notification_System SHALL 해당 알림의 읽음 처리 API를 호출하여 읽음 상태로 변경을 요청한다.
2. WHEN 읽음 처리 요청이 성공하면, THE Notification_System SHALL 해당 알림의 미읽음 표시(파란 점)를 제거한다.
3. WHEN 읽음 처리 요청이 성공하면, THE Notification_Store SHALL 미읽음 알림 개수를 1 감소시키되, 최솟값은 0 이하로 내려가지 않는다.
4. IF 이미 읽음 상태인 알림을 클릭하면, THEN THE Notification_System SHALL 읽음 처리 API를 호출하지 않는다.
5. WHILE 읽음 처리 API 요청이 진행 중인 동안, THE Notification_System SHALL 해당 알림 항목에 대한 추가 읽음 처리 클릭을 무시한다.
6. IF 읽음 처리 요청이 실패하면, THEN THE Notification_System SHALL 해당 알림의 미읽음 상태를 유지하고, 읽음 처리에 실패했음을 나타내는 에러 메시지를 3초간 표시한다.
7. IF 읽음 처리 요청이 5초 이내에 응답하지 않으면, THEN THE Notification_System SHALL 요청을 타임아웃 처리하고 해당 알림의 미읽음 상태를 유지한다.

### Requirement 5: 알림 타입 매핑

**User Story:** As a 로그인 사용자, I want 알림 유형에 따라 적절한 아이콘과 스타일이 표시되기를, so that 알림의 종류를 시각적으로 빠르게 구분할 수 있다.

#### Acceptance Criteria

1. WHEN 알림 타입이 LOAN_SUBMITTED이면, THE Notification_System SHALL 대출 신청 완료를 나타내는 고유한 아이콘을 원형 배경 컨테이너 내에 표시하고, 해당 컨테이너에 다른 알림 타입과 시각적으로 구분되는 배경색을 적용한다.
2. WHEN 알림 타입이 LOAN_DECIDED이면, THE Notification_System SHALL 대출 심사 완료를 나타내는 고유한 아이콘을 원형 배경 컨테이너 내에 표시하고, 해당 컨테이너에 LOAN_SUBMITTED 및 LOAN_EXECUTED와 시각적으로 구분되는 배경색을 적용한다.
3. WHEN 알림 타입이 LOAN_EXECUTED이면, THE Notification_System SHALL 대출 실행 완료를 나타내는 고유한 아이콘을 원형 배경 컨테이너 내에 표시하고, 해당 컨테이너에 LOAN_SUBMITTED 및 LOAN_DECIDED와 시각적으로 구분되는 배경색을 적용한다.
4. IF 알림 타입이 정의된 타입(LOAN_SUBMITTED, LOAN_DECIDED, LOAN_EXECUTED) 중 어느 것에도 해당하지 않으면, THEN THE Notification_System SHALL 기본 아이콘과 기본 배경색을 표시하여 렌더링 오류 없이 알림 항목을 정상 표시한다.
5. THE Notification_System SHALL 각 알림 타입별 아이콘과 배경색 조합을 서로 다르게 적용하여, 사용자가 아이콘 또는 배경색만으로 3가지 알림 타입을 구분할 수 있도록 한다.

### Requirement 6: Mock 데이터 제거 및 API 전환

**User Story:** As a 개발자, I want Mock 데이터 의존성을 제거하고 실제 API로 전환하기를, so that 프로덕션 환경에서 실제 데이터로 동작할 수 있다.

#### Acceptance Criteria

1. THE Notification_System SHALL NotificationsPage 및 AppHeader 컴포넌트에서 MOCK_NOTIFICATIONS import를 제거하고, useNotifications 훅(React Query 기반)을 통해 GET /notifications API 응답 데이터를 사용한다.
2. WHEN NotificationsPage 컴포넌트가 마운트되면, THE Notification_System SHALL useNotifications 훅을 호출하여 알림 목록을 조회하고, 로딩 중에는 로딩 인디케이터를 표시하며, 조회된 알림이 0건이면 빈 상태 안내 문구를 표시한다.
3. IF useNotifications 훅의 API 호출이 실패하면, THEN THE Notification_System SHALL 사용자에게 데이터 조회 실패를 나타내는 에러 상태 UI를 표시한다.
4. WHEN AppHeader 컴포넌트가 렌더링될 때, THE Notification_System SHALL Notification_Store에서 미읽음 개수를 참조하여, 1건 이상이면 알림 아이콘에 미읽음 개수 뱃지를 표시하고, 100건 이상이면 "99+"로 표시한다.
5. THE Notification_System SHALL NotificationItem 타입에 type 필드(값: "LOAN_SUBMITTED" | "LOAN_DECIDED" | "LOAN_EXECUTED")와 applicationId 필드(number 타입)를 추가하고, 기존 Mock의 알림 타입(LOAN_APPLIED, LOAN_REVIEWED)을 API 응답 스키마의 타입(LOAN_SUBMITTED, LOAN_DECIDED)으로 대체한다.
6. WHEN 알림 목록의 각 항목이 렌더링될 때, THE Notification_System SHALL type 필드 값(LOAN_SUBMITTED, LOAN_DECIDED, LOAN_EXECUTED)에 따라 각각 구분된 아이콘과 배경색을 표시한다.
