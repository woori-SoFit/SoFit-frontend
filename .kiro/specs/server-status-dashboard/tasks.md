# Implementation Plan: Server Status Dashboard

## Overview

기존 admin-front의 "API 로그" placeholder 페이지(`/api-logs`)를 "서버 상태 확인" 대시보드로 교체한다. TypeScript + React + React Query + Tailwind CSS 기반으로 구현하며, `GET /api/admin/dev/health` API를 통해 서버 상태를 30초 간격으로 자동 새로고침한다.

## Tasks

- [x] 1. 타입 정의 및 API 레이어 구성
  - [x] 1.1 서버 상태 타입 정의 파일 생성
    - `src/types/serverHealth.ts` 파일 생성
    - `HealthStatus`, `ServerStatus`, `ServerGroup`, `DbConnectionPool`, `HealthSummary`, `ServerHealthData` 타입 정의
    - `StatusColor` 타입 및 `getStatusColor`, `getPoolColor`, `formatRelativeTime` 유틸 함수 정의
    - _Requirements: 3.3, 3.4, 3.5, 3.6, 4.4, 5.3, 5.4, 5.5_

  - [x] 1.2 API 호출 함수 생성
    - `src/api/serverHealthApi.ts` 파일 생성
    - `fetchServerHealth` 함수 구현 (axiosInstance 사용, `GET /api/admin/dev/health`)
    - _Requirements: 7.1_

  - [x] 1.3 Query Key 상수 추가
    - `src/constants/queryKeys.ts`에 `SERVER_HEALTH_KEYS` 객체 추가
    - 기존 패턴(`all`, `status()`)을 따라 정의
    - _Requirements: 7.1_

  - [x] 1.4 커스텀 훅 생성
    - `src/hooks/useServerHealth.ts` 파일 생성
    - `useQuery` 사용, staleTime 30초, gcTime 5분, refetchInterval 30초 설정
    - `data`, `isLoading`, `isError`, `refetch`, `isFetching`, `dataUpdatedAt`, `failureCount` 반환
    - _Requirements: 7.1, 7.5, 8.1, 8.2_

- [x] 2. Checkpoint - 타입 및 API 레이어 검증
  - Ensure all tests pass, ask the user if questions arise.

- [x] 3. 대시보드 UI 컴포넌트 구현
  - [x] 3.1 DashboardHeader 컴포넌트 구현
    - `src/components/server-status/DashboardHeader.tsx` 파일 생성
    - 페이지 제목 "서버 통신 상태" 표시
    - `VITE_ENV_NAME` 환경변수로 환경 뱃지 표시
    - `dataUpdatedAt`을 "YYYY-MM-DD HH:mm" 형식으로 표시
    - 새로고침 버튼: `isFetching` 중 스피너 + disabled 처리
    - `failureCount >= 3`일 때 경고 아이콘 표시
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 8.3, 8.4, 8.5_

  - [x] 3.2 SummaryCard 컴포넌트 구현
    - `src/components/server-status/SummaryCard.tsx` 파일 생성
    - Props: `icon`, `iconBg`, `title`, `value`, `subtitle`
    - 스켈레톤 로딩 상태 지원
    - _Requirements: 2.1, 2.9_

  - [x] 3.3 SummaryCards 컴포넌트 구현
    - `src/components/server-status/SummaryCards.tsx` 파일 생성
    - 4개 요약 카드 렌더링: 전체 서버, 평균 응답시간, 지연 구간, DB 커넥션 풀
    - 서버 수 포맷: `"{normalCount}/{totalCount}"`
    - 평균 응답시간 포맷: `"{Math.round(averageResponseMs)}ms"` (전일 대비 비교 없음)
    - 지연 구간: status가 'SLOW'인 서버 수 + 해당 서버 이름 표시
    - DB 커넥션 풀: `"{percentage}% {used}/{total} 사용 중"` 형식
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.6, 2.7, 2.8, 2.9_

  - [x] 3.4 ServerStatusRow 컴포넌트 구현
    - `src/components/server-status/ServerStatusRow.tsx` 파일 생성
    - Props: `name`, `status`, `responseMs`, `lastCheckedAt`
    - `getStatusColor(status)`로 색상 결정 (status 값 기반, responseMs 계산 없음)
    - 응답시간 바: `width = Math.min(responseMs / 1000, 1) * 100%`, 최대 1000ms 스케일
    - `status === 'DOWN'`일 때 "장애" 텍스트 표시 (responseMs 대신)
    - 상대 시간 표시: `formatRelativeTime` 사용
    - _Requirements: 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 4.2, 4.4_

  - [x] 3.5 ApplicationStatusSection 컴포넌트 구현
    - `src/components/server-status/ApplicationStatusSection.tsx` 파일 생성
    - "애플리케이션" 섹션 제목 + ServerStatusRow 목록 (user_back, admin_back 순서)
    - _Requirements: 3.1, 3.2_

  - [x] 3.6 InfraStatusSection 컴포넌트 구현
    - `src/components/server-status/InfraStatusSection.tsx` 파일 생성
    - "인프라" 섹션 제목 + ServerStatusRow 목록 (MySQL, Redis)
    - 데이터 없는 서비스는 빨간 인디케이터 + "장애" 표시
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [x] 3.7 ConnectionPoolSection 컴포넌트 구현
    - `src/components/server-status/ConnectionPoolSection.tsx` 파일 생성
    - "DB 커넥션 풀 사용률" 섹션 제목
    - 각 풀에 대해 프로그레스 바 렌더링 (Spring Boot)
    - 색상: `< 60%` 초록, `60~84%` 주황, `>= 85%` 빨강 (`getPoolColor` 사용)
    - 표시 형식: `{percentage}% {used}/{total}`
    - 데이터 로드 실패 시 에러 메시지 표시
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_

- [x] 4. 페이지 조립 및 라우팅 연결
  - [x] 4.1 ServerStatusPage 페이지 컴포넌트 구현
    - `src/pages/server-status/ServerStatusPage.tsx` 파일 생성
    - `useServerHealth` 훅 사용
    - 로딩 상태: `LoadingState` 컴포넌트 표시
    - 에러 상태 (데이터 없음): `ErrorState` 컴포넌트 + 재시도 버튼
    - 정상 상태: DashboardHeader, SummaryCards, ApplicationStatusSection, InfraStatusSection, ConnectionPoolSection 렌더링
    - _Requirements: 7.2, 7.4, 7.6_

  - [x] 4.2 라우터 및 네비게이션 설정 변경
    - `src/router/routes.tsx`의 `PAGE_COMPONENTS`에서 `"api-logs"` 매핑을 `ServerStatusPage`로 변경
    - `src/constants/permissions.ts`의 ROUTE_CONFIG에서 `api-logs` 항목의 label을 "서버 상태 확인"으로 변경
    - 기존 `/api-logs` 경로 유지 (하위 호환)
    - `ApiLogsPage` placeholder 파일 삭제
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 5. Checkpoint - UI 렌더링 및 라우팅 검증
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. 유틸리티 함수 및 Property-Based 테스트
  - [ ]* 6.1 Property 1: 타임스탬프 포맷 유효성 테스트
    - **Property 1: 타임스탬프 포맷 유효성**
    - fast-check으로 임의의 유효한 timestamp에 대해 formatDateTime이 `/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/` 패턴을 만족하는지 검증
    - **Validates: Requirements 1.3, 8.3**

  - [ ]* 6.2 Property 2: 요약 카드 값 포맷팅 테스트
    - **Property 2: 요약 카드 값 포맷팅**
    - fast-check으로 임의의 HealthSummary, DbConnectionPool 데이터에 대해 포맷 함수들의 출력 형식 검증
    - **Validates: Requirements 2.2, 2.3, 2.8, 5.2**

  - [ ]* 6.3 Property 3: 지연 구간 식별 테스트
    - **Property 3: 지연 구간 식별**
    - fast-check으로 임의의 서버 목록에서 status가 'SLOW'인 서버 수가 정확히 일치하는지 검증
    - **Validates: Requirements 2.6, 2.7**

  - [ ]* 6.4 Property 4: getStatusColor 함수 테스트
    - **Property 4: 서버 상태 색상 결정**
    - fast-check으로 모든 HealthStatus 값에 대해 올바른 색상 반환 검증
    - **Validates: Requirements 3.3, 3.4, 3.5, 3.6, 4.4**

  - [ ]* 6.5 Property 5: 응답시간 바 너비 계산 테스트
    - **Property 5: 응답시간 바 너비 계산**
    - fast-check으로 임의의 responseMs에 대해 바 너비가 0~1 범위인지 검증
    - **Validates: Requirements 3.7**

  - [ ]* 6.6 Property 6: getPoolColor 함수 테스트
    - **Property 6: 커넥션 풀 색상 결정**
    - fast-check으로 임의의 used/total 조합에 대해 올바른 색상 반환 검증
    - **Validates: Requirements 5.3, 5.4, 5.5**

  - [ ]* 6.7 Property 7: formatRelativeTime 함수 테스트
    - **Property 7: 상대 시간 포맷**
    - fast-check으로 임의의 ISO 8601 타임스탬프에 대해 올바른 상대 시간 문자열 반환 검증
    - **Validates: Requirements 3.2, 4.2**

  - [ ]* 6.8 Property 8: 연속 실패 경고 표시 조건 테스트
    - **Property 8: 연속 실패 경고 표시 조건**
    - fast-check으로 임의의 failureCount에 대해 경고 표시 조건(>= 3) 검증
    - **Validates: Requirements 8.5**

- [ ] 7. 단위 테스트 및 통합 테스트
  - [ ]* 7.1 유틸리티 함수 단위 테스트
    - `src/__tests__/server-status/serverHealth.utils.test.ts` 파일 생성
    - `getStatusColor`, `getPoolColor`, `formatRelativeTime`, `formatDateTime` 함수의 경계값 및 엣지 케이스 테스트
    - _Requirements: 3.3, 3.4, 3.5, 4.4, 5.3, 5.4, 5.5_

  - [ ]* 7.2 컴포넌트 단위 테스트
    - `src/__tests__/server-status/components.test.tsx` 파일 생성
    - `ServerStatusRow`, `SummaryCards`, `ConnectionPoolSection`, `DashboardHeader` 컴포넌트 렌더링 테스트
    - _Requirements: 2.1, 3.2, 5.1, 1.1, 1.2, 1.3_

  - [ ]* 7.3 페이지 통합 테스트
    - `src/__tests__/server-status/ServerStatusPage.test.tsx` 파일 생성
    - API 모킹 후 로딩 → 정상 렌더링 흐름 테스트
    - 에러 상태 → 재시도 → 성공 흐름 테스트
    - _Requirements: 7.2, 7.4, 7.6_

- [x] 8. Final Checkpoint - 전체 테스트 통과 확인
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- 각 태스크는 특정 requirements를 참조하여 추적 가능
- Checkpoints에서 증분 검증 수행
- Property 테스트는 fast-check 라이브러리 사용 (프로젝트에 이미 설치됨)
- 단위 테스트는 Vitest + React Testing Library 사용
- `getStatusColor`는 `status` 값만으로 색상을 결정하며, `responseMs` 기반 계산은 하지 않음
- AI(FastAPI) 서버는 대시보드에 포함하지 않음
- `previousDayAverageResponseMs` 없음 (전일 대비 비교 기능 제거)
- 기존 `/api-logs` 경로를 재사용하여 하위 호환성 유지

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2", "1.3"] },
    { "id": 1, "tasks": ["1.4"] },
    { "id": 2, "tasks": ["3.1", "3.2", "3.4", "3.7"] },
    { "id": 3, "tasks": ["3.3", "3.5", "3.6"] },
    { "id": 4, "tasks": ["4.1"] },
    { "id": 5, "tasks": ["4.2"] },
    { "id": 6, "tasks": ["6.1", "6.2", "6.3", "6.4", "6.5", "6.6", "6.7", "6.8"] },
    { "id": 7, "tasks": ["7.1", "7.2", "7.3"] }
  ]
}
```
