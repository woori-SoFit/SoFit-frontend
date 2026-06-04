# Implementation Plan: Notification API Integration

## Overview

Mock 데이터 기반 알림 시스템을 실제 백엔드 API 연동으로 전환한다. SSE 실시간 알림 수신, REST API 기반 알림 목록 조회 및 읽음 처리, Zustand 상태 관리, UI 컴포넌트 리팩토링을 단계적으로 구현한다.

## Tasks

- [x] 1. 타입 정의 및 API 레이어 구성
  - [x] 1.1 알림 타입 분리 및 API 함수 추가
    - `src/types/notification.ts` 파일 생성: `NotificationType` (`"LOAN_SUBMITTED" | "LOAN_DECIDED" | "LOAN_EXECUTED"`), `NotificationItem`, `NotificationsResponse` 타입 정의
    - `NotificationItem` 인터페이스에 `type: NotificationType`과 `applicationId: number` 필드 추가
    - `src/types/mypage.ts`에서 기존 `NotificationItem`, `NotificationsResponse` 타입 제거 및 기존 import 경로를 `@/types/notification`으로 변경
    - `src/api/notificationApi.ts` 파일 생성: `fetchNotifications()` (기존 mypageApi에서 이동) 및 `markNotificationAsRead(notificationId: number)` 함수 구현
    - `markNotificationAsRead`는 `PATCH /notifications/{id}/read` 엔드포인트 호출
    - _Requirements: 6.5, 4.1_

  - [x] 1.2 SSE 클라이언트 모듈 구현
    - `src/api/sseClient.ts` 파일 생성
    - `EventSource` 기반 SSE 연결 수립 (`/api/notifications/subscribe`, `withCredentials: true`)
    - `event: connect` 수신 시 연결 확인 콜백 호출
    - `event: notification` 수신 시 JSON 파싱 후 알림 데이터 콜백 호출
    - 연결 끊김 시 3초 간격 최대 5회 자동 재연결 로직 구현
    - 재연결 초과 시 에러 콜백 호출 및 재연결 중단
    - `disconnect()` 호출 시 EventSource 종료 및 타이머 정리
    - _Requirements: 1.1, 1.2, 1.5, 1.6, 1.7, 1.9_

  - [x] 1.3 Notification Store (Zustand) 생성
    - `src/stores/notificationStore.ts` 파일 생성
    - `unreadCount`, `connectionStatus` 상태 정의
    - `setUnreadCount`, `incrementUnread`, `decrementUnread`, `setConnectionStatus`, `reset` 액션 구현
    - `decrementUnread`는 최솟값 0 보장
    - _Requirements: 1.4, 2.2, 4.3_

- [~] 2. Checkpoint - 기반 모듈 검증
  - Ensure all tests pass, ask the user if questions arise.

- [x] 3. 커스텀 훅 구현
  - [x] 3.1 useNotifications 훅 구현
    - `src/hooks/useNotifications.ts` 파일 생성
    - React Query `useQuery`로 `fetchNotifications()` 호출
    - `data`, `isLoading`, `isError`, `refetch` 반환
    - queryKey: `['notifications']`
    - _Requirements: 3.1, 3.6, 3.7, 6.1, 6.2_

  - [x] 3.2 useMarkAsRead 훅 구현
    - `src/hooks/useMarkAsRead.ts` 파일 생성
    - `useMutation`으로 `markNotificationAsRead` 호출
    - 성공 시: 알림 목록 캐시 낙관적 업데이트 (`isRead: true`) + `notificationStore.decrementUnread()`
    - 실패 시: 캐시 롤백 + 에러 토스트 3초 표시
    - 타임아웃: 5초 설정 (AbortController 또는 axios timeout)
    - 이미 읽음 상태인 알림은 API 호출하지 않음
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

  - [x] 3.3 useUnreadCount 훅 구현
    - `src/hooks/useUnreadCount.ts` 파일 생성
    - 앱 진입 시 `fetchNotifications()` 응답에서 `isRead === false` 항목 개수 계산
    - `notificationStore.setUnreadCount()`로 초기값 설정
    - store의 `unreadCount` 반환
    - _Requirements: 2.1, 2.2, 2.6, 2.7_

  - [x] 3.4 useSSE 훅 구현
    - `src/hooks/useSSE.ts` 파일 생성
    - `useMe()`로 로그인 상태 확인, 로그인 시에만 SSE 연결 수립
    - `notification` 이벤트 수신 시 `notificationStore.incrementUnread()` + `queryClient.invalidateQueries(['notifications'])`
    - 로그아웃 시 연결 종료 (cleanup)
    - `notificationStore.setConnectionStatus()` 호출로 연결 상태 반영
    - _Requirements: 1.1, 1.3, 1.4, 1.8, 1.9_

- [~] 4. Checkpoint - 훅 레이어 검증
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. UI 컴포넌트 리팩토링
  - [x] 5.1 notificationIcon 유틸 업데이트
    - `src/utils/notificationIcon.tsx`에서 `NotificationType` import를 `@/types/notification`으로 변경
    - 타입 매핑 변경: `LOAN_APPLIED` → `LOAN_SUBMITTED`, `LOAN_REVIEWED` → `LOAN_DECIDED`
    - 기본 fallback 아이콘 추가 (알 수 없는 타입 → `Bell` 아이콘 + `bg-gray-100`)
    - 반환 타입을 `NotificationIconConfig`으로 명시적 export
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [~] 5.2 NotificationsPage 리팩토링
    - `MOCK_NOTIFICATIONS` import 제거
    - `useNotifications()` 훅으로 데이터 조회
    - 로딩 상태: 스피너(로딩 인디케이터) 표시
    - 에러 상태: 에러 메시지 + 재시도 버튼 표시
    - 빈 상태: "알림이 없습니다" 메시지 유지
    - 각 알림 항목 클릭 시 `useMarkAsRead` 호출 (미읽음 상태인 경우만)
    - `NotificationItem` 컴포넌트에서 `type` 필드 기반 아이콘 렌더링
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 4.1, 4.4, 6.1, 6.2, 6.3, 6.6_

  - [~] 5.3 AppHeader 리팩토링
    - `MOCK_NOTIFICATIONS` import 제거
    - `useNotificationStore`에서 `unreadCount` 참조
    - 뱃지 표시 로직: `unreadCount > 0` 시 표시, `> 99` 시 "99+"
    - `unreadCount === 0` 시 뱃지 숨김
    - _Requirements: 2.3, 2.4, 2.5, 6.4_

  - [~] 5.4 앱 루트에 useSSE 및 useUnreadCount 훅 연결
    - 앱 최상위 컴포넌트(또는 적절한 레이아웃 컴포넌트)에서 `useSSE()` 호출
    - `useUnreadCount()` 호출로 앱 진입 시 미읽음 개수 초기화
    - _Requirements: 1.1, 2.1_

- [ ] 6. Vite 프록시 설정 및 Mock 제거
  - [~] 6.1 Vite SSE 프록시 설정 추가
    - `vite.config.ts`의 `server.proxy`에 `/api/notifications/subscribe` 경로 추가
    - SSE 버퍼링 비활성화 설정: `proxy.on('proxyRes')` 핸들러에서 `cache-control: no-cache`, `x-accel-buffering: no` 헤더 설정
    - _Requirements: 1.1_

  - [~] 6.2 Mock 데이터 파일 제거 및 import 정리
    - `src/mocks/notifications.ts` 파일 삭제
    - 프로젝트 전체에서 해당 파일 import 참조가 없는지 확인
    - `mypageApi.ts`에서 `fetchNotifications` 함수 제거 (notificationApi.ts로 이동 완료)
    - _Requirements: 6.1_

- [~] 7. Checkpoint - 통합 검증
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. 테스트 작성
  - [ ]* 8.1 Property Test: 미읽음 개수 계산 정확성
    - **Property 1: 미읽음 개수 계산 정확성**
    - `fast-check`로 임의의 `NotificationItem[]` 배열 생성
    - `computeUnreadCount` 함수가 `isRead === false`인 항목 개수를 정확히 반환하는지 검증
    - 최소 100회 반복 실행
    - **Validates: Requirements 2.2**

  - [ ]* 8.2 Property Test: 뱃지 포맷팅 규칙
    - **Property 2: 뱃지 포맷팅 규칙**
    - `fast-check`로 임의의 양의 정수 생성
    - `formatBadgeCount(n)`: 1~99 → 문자열 `n`, 100+ → `"99+"`, 0 → `null`
    - **Validates: Requirements 2.3, 2.4, 2.5**

  - [ ]* 8.3 Property Test: 알림 타입별 아이콘 고유성
    - **Property 4: 알림 타입별 아이콘 고유성**
    - 서로 다른 두 `NotificationType` 값에 대해 `getNotificationIcon` 반환값의 아이콘 또는 배경색 중 적어도 하나가 다른지 검증
    - **Validates: Requirements 3.4, 5.5**

  - [ ]* 8.4 Property Test: 미읽음 개수 감소 하한 보장
    - **Property 5: 미읽음 개수 감소 하한 보장**
    - `fast-check`로 임의의 음이 아닌 정수 생성
    - `decrementUnread` 호출 후 값이 `max(0, unreadCount - 1)`과 같은지 검증
    - **Validates: Requirements 4.3**

  - [ ]* 8.5 Property Test: 알 수 없는 알림 타입 안전 처리
    - **Property 6: 알 수 없는 알림 타입 안전 처리**
    - `fast-check`로 정의된 3가지 타입 외의 임의 문자열 생성
    - `getNotificationIcon`이 에러 없이 기본 아이콘과 기본 배경색을 반환하는지 검증
    - **Validates: Requirements 5.4**

  - [ ]* 8.6 Unit Test: SSE 클라이언트 동작 검증
    - MockEventSource를 사용한 SSE 연결 수립/종료 테스트
    - connect 이벤트 처리, notification 이벤트 파싱 테스트
    - 재연결 로직 (3초 간격, 최대 5회) 테스트
    - disconnect 호출 시 정리 동작 테스트
    - _Requirements: 1.1, 1.2, 1.6, 1.7, 1.9_

  - [ ]* 8.7 Unit Test: NotificationsPage 컴포넌트 렌더링 검증
    - 로딩 UI, 에러 UI, 빈 상태, 알림 목록 렌더링 테스트
    - 알림 클릭 시 읽음 처리 호출 테스트
    - React Testing Library 사용
    - _Requirements: 3.1, 3.2, 3.5, 3.6, 3.7, 4.1, 4.4_

  - [ ]* 8.8 Unit Test: AppHeader 뱃지 표시 검증
    - `unreadCount > 0` 시 뱃지 표시, `0` 시 숨김 테스트
    - `unreadCount > 99` 시 "99+" 표시 테스트
    - _Requirements: 2.3, 2.4, 2.5_

- [~] 9. Final Checkpoint - 전체 테스트 통과 확인
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- 각 태스크는 특정 요구사항을 참조하여 추적 가능성을 보장
- Checkpoint에서 점진적 검증 수행
- Property test는 `fast-check` 라이브러리를 사용하며 각 property는 설계 문서의 Correctness Properties에 매핑
- `computeUnreadCount`와 `formatBadgeCount`는 순수 유틸 함수로 분리하여 테스트 용이성 확보
- SSE 프록시 설정은 개발 환경에서만 필요 (프로덕션은 동일 도메인)

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.3"] },
    { "id": 1, "tasks": ["1.2", "5.1"] },
    { "id": 2, "tasks": ["3.1", "3.3"] },
    { "id": 3, "tasks": ["3.2", "3.4"] },
    { "id": 4, "tasks": ["5.2", "5.3", "6.1"] },
    { "id": 5, "tasks": ["5.4", "6.2"] },
    { "id": 6, "tasks": ["8.1", "8.2", "8.3", "8.4", "8.5"] },
    { "id": 7, "tasks": ["8.6", "8.7", "8.8"] }
  ]
}
```
