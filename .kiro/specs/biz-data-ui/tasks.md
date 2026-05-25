# Implementation Plan: 마이 비즈 데이터 UI 구현

## Overview

마이 비즈 데이터(My Biz Data) 페이지 UI를 구현한다. Mock 데이터 → Store → 공통 컴포넌트 UI → 수집 페이지 → 대시보드 서브컴포넌트 → 메인 페이지 순서로 점진적으로 구현하며, 각 단계에서 빌드 검증을 수행한다.

## Tasks

- [x] 1. Mock 데이터 및 Store 생성
  - [x] 1.1 Mock 데이터 파일 생성 (`mocks/bizData.ts`)
    - `MOCK_IS_CONNECTED`, `MOCK_BIZ_DATA_TERMS`, `MOCK_BIZ_DATA_COLLECT_STEPS`, `MOCK_BIZ_DASHBOARD` 상수를 named export
    - `BizDashboardData` 인터페이스 정의 및 export
    - TermsItem 타입 import, any 타입 사용 금지
    - 약관 content에 수집 항목/수집 목적/보유 기간/제공받는 자/동의 거부 권리 5개 섹션 포함
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

  - [x] 1.2 BizDataCollectStore 생성 (`stores/bizDataCollectStore.ts`)
    - `BizDataCollectStep` 타입, `STEP_ORDER` 배열, `BizDataCollectState` 인터페이스 정의
    - `currentStep`, `setStep`, `nextStep`, `prevStep`, `reset` 액션 구현
    - loanApplyStore 패턴 그대로 따름
    - _Requirements: 2.1_

  - [ ]* 1.3 BizDataCollectStore property 테스트 작성
    - **Property 1: Store step 전환 일관성**
    - **Validates: Requirements 2.1**

- [x] 2. LoadingScreen UI 구현
  - [x] 2.1 LoadingScreen 컴포넌트 UI 구현 (`components/common/LoadingScreen.tsx`)
    - 기존 인터페이스에 `onComplete?: () => void` prop 추가
    - title, description 상단 표시, step 리스트 하단 수직 배치
    - done=체크 아이콘, loading=스피너 애니메이션, pending=비활성 원형 아이콘
    - 2초 간격 순차 전환 로직 (pending → loading → done)
    - 모든 항목 done 시 onComplete 1회 호출
    - 언마운트 시 타이머 cleanup (useEffect cleanup)
    - steps 미전달 시 자동 전환 로직 미실행
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

  - [ ]* 2.2 LoadingScreen property 테스트 작성
    - **Property 2: LoadingScreen 순차 전환 및 완료 콜백**
    - **Validates: Requirements 6.3, 6.4**

- [x] 3. Checkpoint - Mock 데이터, Store, LoadingScreen 검증
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. BizDataCollectPage 구현
  - [x] 4.1 BizDataCollectPage step 기반 흐름 구현 (`pages/bizData/BizDataCollectPage.tsx`)
    - useLayoutStore.setStepTitle("마이 비즈 데이터") + setOnBack() 설정
    - switch(currentStep)으로 CERT_INFO/PIN → CustomerVerifyPage, TERMS → TermsPage, LOADING → LoadingScreen 렌더링
    - CustomerVerifyPage onSuccess → setStep("TERMS")
    - TermsPage onSubmit → setStep("LOADING")
    - LoadingScreen onComplete → navigate("/biz-data")
    - 뒤로가기: 첫 step이면 navigate(-1), 아니면 prevStep()
    - 언마운트 시 setOnBack(null) 호출
    - _Requirements: 2.2, 2.3, 2.4, 2.5, 2.6, 3.1, 3.2, 4.1, 4.3, 5.1_

- [x] 5. 대시보드 서브컴포넌트 구현
  - [x] 5.1 IntroSection 컴포넌트 구현 (`components/bizData/IntroSection.tsx`)
    - 서비스 소개 일러스트(placeholder), 타이틀, 서브타이틀, 3개 혜택 카드
    - 각 혜택 카드: 아이콘 + 제목 + 설명 텍스트
    - Tailwind only, 디자인 토큰 색상만 사용
    - _Requirements: 1.1, 1.2_

  - [x] 5.2 GaugeBar 컴포넌트 구현 (`components/bizData/GaugeBar.tsx`)
    - percent prop (0~100) 받아 채움 영역 너비를 `${percent}%`로 표시
    - label, percent 텍스트 표시
    - _Requirements: 7.5_

  - [ ]* 5.3 GaugeBar property 테스트 작성
    - **Property 4: 게이지 바 너비 비례**
    - **Validates: Requirements 7.5**

  - [x] 5.4 DashboardSummary 컴포넌트 구현 (`components/bizData/DashboardSummary.tsx`)
    - 월 선택 드롭다운 (mock 현재 월 기본값)
    - 이번 달 매출 카드 (천 단위 콤마 + 전월 대비 증감률)
    - 현금 흐름 + 순이익 가로 배치 카드
    - 업종 비교 섹션 (업종명 부제목 + GaugeBar 3개: 매출/수익성/안정성)
    - formatCurrency, formatChangeRate 유틸 함수 구현 (파일 내 또는 별도 utils)
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

  - [ ]* 5.5 formatCurrency property 테스트 작성
    - **Property 3: 금액 포맷팅 정확성**
    - **Validates: Requirements 7.3, 7.4**

  - [x] 5.6 RevenueLineChart 컴포넌트 구현 (`components/bizData/RevenueLineChart.tsx`)
    - SVG 기반 라인 차트 (5개월분 매출 추이)
    - x축 월 라벨, y축 금액, 최신 데이터 포인트에 금액 툴팁
    - _Requirements: 8.2_

  - [x] 5.7 TransactionBarChart 컴포넌트 구현 (`components/bizData/TransactionBarChart.tsx`)
    - div 기반 그룹 바 차트 (3개월분 입출금 흐름)
    - 입금/출금 색상 구분 + 범례
    - _Requirements: 8.3_

  - [x] 5.8 RatingLineChart 컴포넌트 구현 (`components/bizData/RatingLineChart.tsx`)
    - SVG 기반 라인 차트 (평점 추이)
    - _Requirements: 8.5_

  - [x] 5.9 DashboardDetail 컴포넌트 구현 (`components/bizData/DashboardDetail.tsx`)
    - 업종 매출 추이 섹션 (RevenueLineChart)
    - 입출금 흐름 섹션 (TransactionBarChart)
    - 대출 현황 카드 (잔액 + 상환일)
    - 리뷰/평점 현황 카드 (평균 평점 + 리뷰 수 + RatingLineChart)
    - 재구매율 + 추천 건수 카드
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7_

- [x] 6. BizDataPage 구현
  - [x] 6.1 BizDataPage 미연결/연결완료 분기 구현 (`pages/bizData/BizDataPage.tsx`)
    - MOCK_IS_CONNECTED 플래그로 분기
    - 미연결: IntroSection + BottomButton("데이터 연결 시작하기") → navigate("/biz-data/collect")
    - 연결완료: DashboardSummary + DashboardDetail
    - _Requirements: 1.1, 1.3, 1.4, 7.1, 8.1_

- [x] 7. 빌드 검증 및 최종 점검
  - [x] 7.1 빌드 통과 확인
    - `npm run -w user-front build` 실행하여 exit code 0 확인
    - TypeScript strict 모드 에러 없음 확인
    - any 타입, @ts-ignore, as any 미사용 확인
    - 인라인 style 미사용, Tailwind arbitrary value 색상 미사용 확인
    - 라우터 설정 파일 변경 없음 확인
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7_

- [x] 8. Final checkpoint - 전체 검증
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- recharts 미설치 상태이므로 차트는 SVG(라인차트) + div(바차트)로 직접 구현
- 기존 라우터 설정 변경 금지 — 이미 `/biz-data`, `/biz-data/collect` 경로가 등록되어 있음
- 모든 데이터는 `mocks/bizData.ts`에서 import하며, API 호출 없음

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "2.1"] },
    { "id": 2, "tasks": ["1.3", "2.2", "5.1", "5.2"] },
    { "id": 3, "tasks": ["4.1", "5.3", "5.4"] },
    { "id": 4, "tasks": ["5.5", "5.6", "5.7", "5.8"] },
    { "id": 5, "tasks": ["5.9"] },
    { "id": 6, "tasks": ["6.1"] },
    { "id": 7, "tasks": ["7.1"] }
  ]
}
```
