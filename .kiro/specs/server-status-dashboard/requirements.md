# Requirements Document

## Introduction

admin-front 앱의 기존 "API 통신 로그" 탭(placeholder)을 "서버 상태 확인" 대시보드로 교체하는 기능이다. ADMIN_DEV 역할 전용으로, 서버 통신 상태를 실시간으로 모니터링할 수 있는 대시보드를 제공한다. 대시보드는 전체 서버 요약, 애플리케이션 상태, 인프라 상태, DB 커넥션 풀 사용률을 한눈에 보여준다.

## Glossary

- **Dashboard**: 서버 통신 상태를 요약하여 보여주는 단일 페이지 UI
- **Summary_Card**: 대시보드 상단에 위치한 핵심 지표 요약 카드 (전체 서버, 평균 응답시간, 지연 구간, DB 커넥션 풀)
- **Application_Status**: user_back, admin_back 등 애플리케이션 서버의 헬스체크 상태 정보
- **Infrastructure_Status**: MySQL, Redis 등 인프라 서비스의 헬스체크 상태 정보
- **Connection_Pool**: 데이터베이스 커넥션 풀의 사용률 정보 (사용 중 / 전체)
- **Health_Status**: 서버의 상태를 나타내는 값 (정상: 초록, 지연: 주황, 장애: 빨강)
- **Response_Time**: 서버 헬스체크 요청에 대한 응답 소요 시간 (밀리초 단위)
- **Status_API**: admin-backend에서 제공하는 서버 상태 조회 API 엔드포인트
- **ADMIN_DEV**: 개발 관리자 역할. 시스템 카테고리 메뉴에 접근 가능한 유일한 역할

## Requirements

### Requirement 1: 대시보드 페이지 헤더

**User Story:** As a ADMIN_DEV, I want to see the dashboard header with environment info and refresh capability, so that I can identify the current environment and manually refresh the data.

#### Acceptance Criteria

1. THE Dashboard SHALL display "서버 통신 상태" as the page title
2. THE Dashboard SHALL display the environment name retrieved from the VITE environment variable as a badge (e.g., "스테이징 환경")
3. THE Dashboard SHALL display the last successful data fetch time in "YYYY-MM-DD HH:mm" format, updated each time data is successfully fetched from the Status_API
4. WHEN the refresh button is clicked, THE Dashboard SHALL re-fetch all server status data from the Status_API
5. WHILE data is being fetched, THE Dashboard SHALL display a loading indicator on the refresh button and disable the button to prevent duplicate requests
6. IF the manual refresh request fails, THEN THE Dashboard SHALL retain the previously displayed data and display the last successful fetch time unchanged

### Requirement 2: 요약 카드 섹션

**User Story:** As a ADMIN_DEV, I want to see summary cards showing key metrics at a glance, so that I can quickly assess overall system health.

#### Acceptance Criteria

1. THE Dashboard SHALL display four Summary_Card components in a horizontal row
2. THE Summary_Card for "전체 서버" SHALL display the count of servers with Health_Status "정상" out of total servers in "{정상 수}/{전체 수}" format (e.g., "4/4")
3. THE Summary_Card for "평균 응답시간" SHALL display the average Response_Time across all servers as an integer value in milliseconds (e.g., "187ms")
4. THE Summary_Card for "평균 응답시간" SHALL display the current average Response_Time only, without previous day comparison
6. THE Summary_Card for "지연 구간" SHALL display the count of server connections with Health_Status of "지연" and the affected route in "출발 서버 → 도착 서버" format (e.g., "1, user_back → admin_back")
7. IF no server connections have Health_Status of "지연", THEN THE Summary_Card for "지연 구간" SHALL display "0" as the count with no route information
8. THE Summary_Card for "DB 커넥션 풀" SHALL display the overall Connection_Pool usage as an integer percentage with the used/total count (e.g., "42%, 10/24 사용 중")
9. WHILE Summary_Card data is loading, THE Dashboard SHALL display skeleton placeholders for all four Summary_Card positions

### Requirement 3: 애플리케이션 상태 섹션

**User Story:** As a ADMIN_DEV, I want to see the health status of each application server, so that I can identify which services are experiencing issues.

#### Acceptance Criteria

1. THE Dashboard SHALL display an "애플리케이션" section listing all application servers in the following order: user_back, admin_back
2. WHEN the Status_API returns Application_Status data, THE Dashboard SHALL display each server's name, Response_Time in milliseconds, a response time bar visualization, relative last checked time (e.g., "방금 전", "1분 전"), and Health_Status color indicator
3. IF a server's Response_Time is below 300ms, THEN THE Dashboard SHALL display a green Health_Status indicator for that server
4. IF a server's Response_Time is between 300ms and 1000ms inclusive, THEN THE Dashboard SHALL display an orange Health_Status indicator for that server
5. IF a server's Response_Time is above 1000ms, THEN THE Dashboard SHALL display a red Health_Status indicator for that server
6. IF a server is unreachable (no response received), THEN THE Dashboard SHALL display a red Health_Status indicator and show "장애" status instead of a Response_Time value
7. THE Dashboard SHALL display the response time bar visualization with a maximum scale of 1000ms, where the bar width represents the proportion of Response_Time relative to the maximum scale

### Requirement 4: 인프라 상태 섹션

**User Story:** As a ADMIN_DEV, I want to see the health status of infrastructure services, so that I can monitor database and cache availability.

#### Acceptance Criteria

1. THE Dashboard SHALL display an "인프라" section listing all infrastructure services
2. WHEN the Status_API returns Infrastructure_Status data, THE Dashboard SHALL display each service's name, Response_Time as a horizontal bar with the millisecond value, last checked time in relative format (e.g., "방금 전", "1분 전"), and Health_Status color indicator
3. THE Dashboard SHALL display the following infrastructure services: MySQL, Redis
4. THE Dashboard SHALL display a green Health_Status indicator for infrastructure services with Response_Time below 300ms, an orange indicator for Response_Time between 300ms and 1000ms, and a red indicator for Response_Time above 1000ms or unreachable status
5. IF the Status_API returns no data for an infrastructure service, THEN THE Dashboard SHALL display that service with a red indicator and "장애" status

### Requirement 5: DB 커넥션 풀 사용률 섹션

**User Story:** As a ADMIN_DEV, I want to see the database connection pool usage for each application, so that I can detect potential connection exhaustion issues.

#### Acceptance Criteria

1. THE Dashboard SHALL display a "DB 커넥션 풀 사용률" section with a horizontal progress bar for each application, showing the application name on the left, the progress bar in the middle, and the usage percentage with used/total count on the right
2. THE Dashboard SHALL display the connection pool usage as an integer percentage (0–100), the used connection count, and the total connection count for each application in the format "{percentage}% {used}/{total}"
3. IF the connection pool usage is below 60%, THEN THE Dashboard SHALL display the progress bar in green
4. IF the connection pool usage is 60% or above and below 85%, THEN THE Dashboard SHALL display the progress bar in orange
5. IF the connection pool usage is 85% or above, THEN THE Dashboard SHALL display the progress bar in red
6. THE Dashboard SHALL display connection pool data for: Spring Boot
7. IF connection pool data fails to load, THEN THE Dashboard SHALL display an error message indicating that connection pool information is unavailable

### Requirement 6: 접근 제어

**User Story:** As a system administrator, I want to restrict dashboard access to ADMIN_DEV role only, so that sensitive infrastructure information is protected.

#### Acceptance Criteria

1. THE Dashboard SHALL be accessible only to users with the ADMIN_DEV role, enforced via the RoleGuard component with allowedRoles set to ADMIN_DEV
2. THE Dashboard SHALL replace the existing "API 로그" menu item in the sidebar navigation with the label "서버 상태 확인" while remaining under the "시스템" category
3. IF a non-ADMIN_DEV user attempts to access the dashboard route, THEN THE RoleGuard SHALL render the ForbiddenPage
4. THE Dashboard route SHALL use the existing path "/api-logs" to maintain backward compatibility with the navigation configuration
5. IF an unauthenticated user attempts to access the dashboard route, THEN THE RoleGuard SHALL redirect the user to the login page

### Requirement 7: 데이터 조회 및 에러 처리

**User Story:** As a ADMIN_DEV, I want the dashboard to handle API errors gracefully, so that I can still understand the system state even when some data is unavailable.

#### Acceptance Criteria

1. WHEN the Dashboard page is loaded, THE Dashboard SHALL fetch server status data from the Status_API using React Query with a query key following the project's domain-based key convention
2. IF the Status_API returns a network error or HTTP 5xx response, THEN THE Dashboard SHALL display the ErrorState component with an error message indicating the data fetch failure and a retry button that re-triggers the Status_API request when clicked
3. IF a specific server's health check returns no response within 3000ms or returns an HTTP error status, THEN THE Dashboard SHALL display that server as "장애" status with a red indicator
4. WHILE the initial data is loading, THE Dashboard SHALL display the LoadingState component
5. THE Dashboard SHALL configure React Query with a staleTime of 30 seconds and a cacheTime (gcTime) of 5 minutes for the server status query
6. IF the retry button is clicked and the subsequent Status_API request succeeds, THEN THE Dashboard SHALL replace the error state with the fetched server status data

### Requirement 8: 자동 새로고침

**User Story:** As a ADMIN_DEV, I want the dashboard to auto-refresh periodically, so that I can monitor server status without manual intervention.

#### Acceptance Criteria

1. WHEN the Dashboard page is loaded, THE Dashboard SHALL automatically start refreshing server status data at a configurable interval using React Query refetchInterval
2. THE Dashboard SHALL use a default auto-refresh interval of 30 seconds
3. WHILE auto-refresh is active, THE Dashboard SHALL update the displayed date and time in "YYYY-MM-DD HH:mm" format after each successful refresh
4. IF an auto-refresh request fails, THEN THE Dashboard SHALL retain the previously displayed data, display the last successful update time, and continue the auto-refresh cycle for subsequent attempts
5. IF 3 consecutive auto-refresh requests fail, THEN THE Dashboard SHALL display a warning indicator alongside the last successful update time
