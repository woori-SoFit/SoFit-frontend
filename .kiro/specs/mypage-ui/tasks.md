# Implementation Plan: 마이페이지 UI

## Overview

SoFit 고객용 앱(user-front)의 마이페이지 UI를 구현한다. 기존 placeholder 파일들을 스크린샷 디자인에 맞춰 완성하며, 타입 정의 → API 함수 → 커스텀 훅 → 공통 컴포넌트 → 페이지 구현 순서로 진행한다.

## Tasks

- [x] 1. 타입 정의 및 Query Keys 확장
  - [x] 1.1 `src/types/mypage.ts` 생성
    - `UserProfile`, `BusinessInfo`, `NotificationItem` 인터페이스 정의
    - `BusinessInfoResponse`, `NotificationsResponse`, `UserProfileResponse` API 응답 타입 정의
    - _Requirements: 6.2, 6.3, 6.4, 7.3, 7.4, 7.5, 7.6, 7.7, 8.3_
  - [x] 1.2 `src/constants/queryKeys.ts`에 MYPAGE_KEYS 추가
    - `all`, `profile()`, `business()`, `notifications()` 키 정의
    - 기존 AUTH_KEYS, LOAN_KEYS 등과 동일한 패턴 유지
    - _Requirements: 7.2, 8.2_
  - 빌드 검증: `tsc -b` 통과 확인

- [x] 2. API 함수 작성
  - [x] 2.1 `src/api/mypageApi.ts` 생성
    - `fetchUserProfile()`: GET /api/users/me/profile
    - `fetchBusinessInfo()`: GET /api/users/me/business
    - `fetchNotifications()`: GET /api/notifications
    - `postLogout()`: POST /api/auth/logout
    - `deleteAccount()`: DELETE /api/users/me
    - 모든 함수는 `axiosInstance`를 사용하고 타입 안전하게 작성
    - _Requirements: 4.2, 5.3, 7.2, 8.2_
  - 빌드 검증: `tsc -b` 통과 확인

- [ ] 3. 커스텀 훅 작성
  - [x] 3.1 `src/hooks/useBusinessInfo.ts` 생성
    - React Query `useQuery` 사용, queryKey: `MYPAGE_KEYS.business()`
    - `data`, `isLoading`, `isError` 반환
    - _Requirements: 7.2, 7.8, 7.9_
  - [x] 3.2 `src/hooks/useNotifications.ts` 생성
    - React Query `useQuery` 사용, queryKey: `MYPAGE_KEYS.notifications()`
    - `data`, `isLoading`, `isError` 반환
    - _Requirements: 8.2, 8.4, 8.6_
  - [-] 3.3 `src/hooks/usePushToggle.ts` 생성
    - localStorage key: `sofit_push_enabled`
    - 초기값: localStorage 저장값 또는 `true` (기본 활성화)
    - `enabled: boolean`, `toggle: () => void` 반환
    - _Requirements: 3.1, 3.2, 3.3_
  - [ ]* 3.4 usePushToggle 훅 property 테스트 작성
    - **Property 1: 푸시 알림 설정 round-trip**
    - fast-check으로 임의의 boolean 값에 대해 localStorage 저장/복원 round-trip 검증
    - **Validates: Requirements 3.2, 3.3**
  - 빌드 검증: `tsc -b` 통과 확인

- [x] 4. 공통 컴포넌트 작성
  - [x] 4.1 `src/components/mypage/PageHeader.tsx` 생성
    - Props: `title: string`, `onBack?: () => void`
    - 뒤로가기 아이콘(ArrowLeft from lucide-react) + 타이틀 텍스트
    - sticky top-0, 흰색 배경, 하단 border
    - onBack 미지정 시 `navigate(-1)` 호출
    - _Requirements: 1.1, 6.1, 7.1, 8.1_
  - [x] 4.2 `src/components/mypage/MenuItem.tsx` 생성
    - Props: `label`, `to?`, `onClick?`, `variant?: 'default' | 'danger'`
    - `to` 지정 시 `<Link>` 래핑, `onClick` 지정 시 `<button>` 래핑
    - 우측 ChevronRight 아이콘, variant='danger' 시 빨간색 텍스트
    - _Requirements: 1.4, 1.5, 1.7, 1.8, 2.1, 2.2_
  - [x] 4.3 `src/components/mypage/ProfileCard.tsx` 생성
    - Props: `name: string`, `loginId: string`
    - 좌측 SoFit 캐릭터 아바타(64px 원형) + 우측 이름/아이디
    - 흰색 배경 카드, radius-xl
    - _Requirements: 1.2, 1.3_
  - [x] 4.4 `src/components/mypage/PushToggle.tsx` 생성
    - Props: `enabled: boolean`, `onToggle: (value: boolean) => void`
    - 좌측: "푸시 알림" 제목 + 설명 텍스트
    - 우측: 토글 스위치 (ON: primary, OFF: gray)
    - _Requirements: 1.6, 3.1_
  - [x] 4.5 `src/components/mypage/ConfirmDialog.tsx` 생성
    - Props: `open`, `title`, `description?`, `confirmLabel?`, `cancelLabel?`, `variant?`, `onConfirm`, `onCancel`
    - 배경 오버레이(반투명 검정) + 중앙 모달 카드
    - variant='danger' 시 확인 버튼 빨간색
    - z-index: z-modal(100)
    - _Requirements: 4.1, 4.4, 5.1, 5.2, 5.5_
  - 빌드 검증: `tsc -b` 통과 확인

- [x] 5. Checkpoint - 기반 코드 검증
  - Ensure all tests pass, ask the user if questions arise.
  - `tsc -b` 빌드 통과 확인
  - 모든 타입, API, 훅, 공통 컴포넌트가 정상 빌드되는지 확인

- [x] 6. MyPage 메인 구현
  - [x] 6.1 `src/pages/mypage/MyPage.tsx` 완성
    - PageHeader (title: "마이페이지")
    - ProfileCard (useMe 훅에서 name, loginId 조회)
    - MenuItem: "내 정보 확인" (to="/mypage/profile"), "사업자 정보 확인" (to="/mypage/business")
    - PushToggle (usePushToggle 훅 연동)
    - MenuItem: "로그아웃" (onClick → ConfirmDialog 열기)
    - MenuItem: "회원 탈퇴" (variant='danger', onClick → ConfirmDialog 열기)
    - 로그아웃 확인 시: postLogout() → queryClient.clear() → navigate('/login')
    - 회원 탈퇴 확인 시: deleteAccount() → queryClient.clear() → navigate('/login')
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 2.1, 2.2, 2.3, 3.1, 3.2, 3.3, 4.1, 4.2, 4.3, 4.4, 5.1, 5.2, 5.3, 5.4, 5.5_
  - 빌드 검증: `tsc -b` 통과 확인

- [ ] 7. ProfilePage 구현
  - [~] 7.1 `src/pages/mypage/ProfilePage.tsx` 완성
    - PageHeader (title: "내 정보 확인")
    - useMe 훅으로 사용자 정보 조회 (name, loginId)
    - 연락처 정보 표시 (useMe 또는 별도 프로필 API)
    - 로딩 상태 처리 (스피너 또는 스켈레톤)
    - 정보 항목: 이름, 아이디, 연락처를 라벨-값 형태로 표시
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  - 빌드 검증: `tsc -b` 통과 확인

- [ ] 8. BusinessInfoPage 구현
  - [~] 8.1 `src/pages/mypage/BusinessInfoPage.tsx` 완성
    - PageHeader (title: "사업자 정보 확인")
    - useBusinessInfo 훅으로 사업자 정보 조회
    - 표시 항목: 사업자등록번호, 상호명, 업종, 개업일, 대표자명
    - 로딩 상태: 스피너 또는 스켈레톤
    - 에러 상태: "정보를 불러올 수 없습니다" 메시지 표시
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9_
  - 빌드 검증: `tsc -b` 통과 확인

- [ ] 9. NotificationsPage 구현
  - [~] 9.1 `src/pages/mypage/NotificationsPage.tsx` 완성
    - PageHeader (title: "알림")
    - useNotifications 훅으로 알림 목록 조회
    - 각 알림: 제목, 내용, 시간(createdAt 포맷팅) 표시
    - 로딩 상태: 스피너 또는 스켈레톤
    - 빈 상태: "알림이 없습니다" 메시지 표시
    - 에러 상태: "알림을 불러올 수 없습니다" 메시지 표시
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_
  - [ ]* 9.2 NotificationsPage 알림 렌더링 property 테스트 작성
    - **Property 2: 알림 목록 렌더링 완전성**
    - fast-check으로 임의의 NotificationItem[] 배열에 대해 모든 항목의 title, content, createdAt이 DOM에 존재하는지 검증
    - **Validates: Requirements 8.3**
  - 빌드 검증: `tsc -b` 통과 확인

- [~] 10. Final checkpoint - 전체 빌드 및 테스트 검증
  - `tsc -b` 전체 빌드 통과 확인
  - Ensure all tests pass, ask the user if questions arise.
  - 모든 페이지가 라우터에 정상 연결되어 있는지 확인 (기존 routes.tsx 활용)

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- 각 태스크는 빌드 검증(`tsc -b`)을 완료 조건으로 포함
- lucide-react 아이콘 라이브러리가 필요하며, 미설치 시 태스크 4 시작 전 설치
- 기존 `useMe` 훅과 `authApi.ts`는 변경하지 않고 그대로 활용
- Property 테스트는 fast-check 라이브러리 사용 (미설치 시 devDependencies에 추가)
- 모든 API 호출은 기존 `axiosInstance`를 통해 수행
