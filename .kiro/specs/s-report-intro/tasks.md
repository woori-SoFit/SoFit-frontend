# Implementation Plan: S분석 리포트 진입 화면

## Overview

S분석 리포트 진입 화면(`/grade-report/intro`)을 구현합니다. 타입 정의 → API/훅 → 컴포넌트 → 페이지 → 라우팅 순서로 점진적으로 구축하며, 각 단계가 이전 단계에 의존하도록 설계합니다.

## Tasks

- [x] 1. 타입 정의 및 queryKey 확장
  - [x] 1.1 BizDataStatus 타입 정의
    - `src/types/bizData.ts` 파일 생성
    - `BizDataStatusResponse` 인터페이스 정의 (isSuccess, code, message, result)
    - `BizDataStatus` 인터페이스 정의 (isConnected, connectedAt)
    - _Requirements: 3.3, 3.4_
  - [x] 1.2 queryKey 상수 확장
    - `src/constants/queryKeys.ts`의 `BIZ_DATA_KEYS`에 `status` 키 추가
    - `status: () => [...BIZ_DATA_KEYS.all, "status"] as const`
    - _Requirements: 3.3, 3.4_

- [x] 2. API 함수 및 커스텀 훅 구현
  - [x] 2.1 fetchBizDataStatus API 함수 구현
    - `src/api/bizDataApi.ts` 파일 생성
    - `axiosInstance`를 사용하여 `GET /biz-data/status` 호출
    - `BizDataStatusResponse` 타입으로 응답 반환
    - _Requirements: 3.3, 3.4_
  - [x] 2.2 useBizDataStatus 커스텀 훅 구현
    - `src/hooks/useBizDataStatus.ts` 파일 생성
    - `enabled` 파라미터로 로그인 시에만 API 호출 제어
    - `BIZ_DATA_KEYS.status()` queryKey 사용
    - 에러 시 `isConnected: false` 기본값 반환 (안전한 폴백)
    - 반환값: `{ isConnected, isLoading, isError }`
    - _Requirements: 3.3, 3.4, 3.6_
  - [x] 2.3 useCtaNavigation 커스텀 훅 구현
    - `src/hooks/useCtaNavigation.ts` 파일 생성
    - `useMe()`로 로그인 상태 확인
    - `useBizDataStatus()`로 Biz Data 연결 상태 확인
    - 분기 로직 구현: 비로그인→`/login?returnUrl=/grade-report/intro`, 로그인+미연결→`/biz-data`, 로그인+연결→`/grade-report`
    - `isNavigating` 상태로 중복 클릭 방지
    - 반환값: `{ handleCtaClick, isNavigating, isStatusLoading }`
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 4.1, 4.2_

- [~] 3. Checkpoint - 타입, API, 훅 구현 확인
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. 하위 컴포넌트 구현
  - [x] 4.1 FeatureCard 컴포넌트 구현
    - `src/components/grade/FeatureCard.tsx` 파일 생성
    - Props: `icon` (ReactNode), `iconAlt` (string), `title` (string), `description` (string)
    - 카드 컨테이너 스타일링 (Tailwind CSS)
    - 아이콘, 제목, 설명 텍스트를 세로 배치
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  - [x] 4.2 CtaButton 컴포넌트 구현
    - `src/components/grade/CtaButton.tsx` 파일 생성
    - Props: `label` (string), `onClick` (함수), `isLoading` (boolean), `disabled` (boolean)
    - 하단 고정(fixed) 배치 스타일링
    - 로딩 상태 시 스피너 표시 및 클릭 비활성화
    - disabled 상태 시 클릭 무시
    - _Requirements: 3.1, 3.5, 3.6_

- [x] 5. 페이지 컴포넌트 및 라우팅
  - [x] 5.1 GradeReportIntroPage 페이지 컴포넌트 구현
    - `src/pages/grade/GradeReportIntroPage.tsx` 파일 생성
    - `useLayoutStore`로 stepTitle "S분석 리포트" 설정
    - 메인 타이틀 "SOFIT 성장등급 리포트" (font-weight 700 이상)
    - 서브 타이틀 "사장님의 성장 가능성을 봅니다."
    - 중앙 일러스트레이션 이미지 (alt 텍스트 포함, 로딩 실패 시 높이 유지)
    - FeatureCard 2개 배치: "입체적 성장 분석", "맞춤형 우대 혜택"
    - CtaButton에 useCtaNavigation 훅 연결
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 2.1, 2.2, 2.3, 2.4, 5.1, 5.2_
  - [x] 5.2 일러스트레이션 에셋 추가
    - `src/assets/` 디렉토리에 서비스 소개 일러스트레이션 이미지 파일 추가
    - 적절한 파일명과 포맷 사용 (SVG 또는 PNG)
    - _Requirements: 1.5, 1.8_
  - [x] 5.3 라우팅 등록
    - `src/router/routes.tsx`의 StepLayout children에 `/grade-report/intro` 경로 추가
    - `GradeReportIntroPage` 컴포넌트 import 및 연결
    - 인증 가드 없이 공개 접근 허용 (StepLayout 하위 배치)
    - _Requirements: 5.1, 5.2, 5.3, 6.1, 6.2_

- [~] 6. Final checkpoint - 전체 구현 확인
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- 테스트 코드 작성은 빠른 MVP 개발을 위해 생략합니다
- 각 태스크는 이전 태스크의 결과물에 의존하므로 순서대로 진행합니다
- StepLayout을 활용하므로 별도 Header 구현 불필요 (뒤로가기, 타이틀은 StepLayout이 처리)
- 일러스트레이션 에셋은 플레이스홀더로 시작하고 추후 디자인 확정 시 교체 가능

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["2.1"] },
    { "id": 2, "tasks": ["2.2"] },
    { "id": 3, "tasks": ["2.3", "4.1", "4.2"] },
    { "id": 4, "tasks": ["5.1", "5.2"] },
    { "id": 5, "tasks": ["5.3"] }
  ]
}
```
