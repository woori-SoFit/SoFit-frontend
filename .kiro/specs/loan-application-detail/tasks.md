# Implementation Plan: 대출 신청 상세 페이지

## Overview

대출 신청 상세 페이지(`/loan/:id`)와 지점장 결재 페이지(`/manager-approval`)를 구현합니다. 타입 정의 → 유틸리티 함수 → Mock 데이터 → API 레이어 → 커스텀 훅 → 정보 카드 컴포넌트 → 점수 카드 컴포넌트 → SHAP 컴포넌트 → 모달 컴포넌트 → 페이지 컴포넌트 → 라우팅 연결 순서로 점진적으로 구현합니다.

## Tasks

- [x] 1. 타입 정의 및 상수 확장
  - [x] 1.1 `src/types/index.ts`에 대출 상세 관련 타입 추가
    - CustomerInfo, BusinessInfo, ApplicationCondition, ApplicantInput 인터페이스 정의
    - RepaymentMethod, IncomeType, VatFilingStatus, InsurancePaymentStatus 타입 정의
    - SystemCollectedData, ShapDetail, ShapResult 인터페이스 정의
    - LoanDetailData, RecommendationData 인터페이스 정의
    - ApprovalPayload, RejectionPayload, EscalationPayload 인터페이스 정의
    - ManagerApprovalItem 인터페이스 정의
    - _Requirements: 2.1, 3.1, 4.1, 5.1, 6.1, 6.3, 10.1, 12.2, 12.3, 13.2, 15.2, 20.2, 20.3, 20.6_

  - [x] 1.2 `src/constants/queryKeys.ts`에 shap, recommendation, managerApprovals 키 추가
    - 기존 LOAN_KEYS에 shap(id), recommendation(id), managerApprovals() 키 추가
    - _Requirements: 17.1_

- [x] 2. 유틸리티 함수 구현
  - [x] 2.1 `src/utils/formatters.ts` 생성
    - maskResidentNumber: 주민번호 마스킹 ("YYMMDD-N******")
    - formatPhoneNumber: 전화번호 포맷팅 ("010-XXXX-XXXX")
    - formatCurrency: 통화 포맷팅 ("N,NNN만원")
    - formatBusinessNumber: 사업자등록번호 포맷팅 ("XXX-XX-XXXXX")
    - formatMonths: 개월 포맷팅 ("N개월")
    - formatBusinessAge: 업력 포맷팅 ("N년 N개월")
    - formatPercentage: 증감률 포맷팅 ("+N.N%" / "-N.N%")
    - formatScore: 점수 포맷팅 ("N점/1000점")
    - _Requirements: 2.2, 2.3, 2.4, 3.2, 3.3, 4.2, 4.3, 5.3, 5.4, 6.3, 6.4, 6.5, 6.9, 7.2, 9.1_

  - [x] 2.2 `src/utils/validators.ts` 생성
    - validateApprovalAmount: 승인 금액 유효성 (10만~10억 정수)
    - validateInterestRate: 금리 유효성 (0.01~20.00)
    - validateLoanTerm: 대출 기간 유효성 (1~360 정수)
    - isWhitespaceOnly: 공백만 포함 여부 검증
    - _Requirements: 12.10, 13.4_

- [x] 3. Mock 데이터 레이어 구현
  - [x] 3.1 `src/mocks/loanDetailMock.ts` 생성
    - getMockLoanDetail(id): 신청 건 ID로 상세 데이터 반환 (없으면 undefined)
    - getMockRecommendation(id): 시스템 추천값 반환
    - getMockManagerApprovals(): MANAGER_REVIEW 상태 건 목록 반환
    - getMockShapResult(id): SHAP 분석 결과 반환
    - 모든 함수에 TypeScript 반환 타입 명시
    - _Requirements: 20.1, 20.2, 20.4, 20.5, 20.6, 20.7_

- [x] 4. API 레이어 구현
  - [x] 4.1 `src/api/loanDetailApi.ts` 생성
    - fetchLoanDetail(id): 상세 데이터 조회 (mock 호출)
    - fetchShapResult(id): SHAP 결과 조회 (mock 호출)
    - fetchRecommendation(id): 시스템 추천값 조회 (mock 호출)
    - approveLoan(id, payload): 대출 승인 API (mock)
    - rejectLoan(id, payload): 대출 거절 API (mock)
    - requestEscalation(id, payload): 추가 결재 요청 API (mock)
    - fetchManagerApprovals(): 지점장 결재 목록 조회 (mock)
    - managerApproveLoan(id, payload): 지점장 결재 승인 (mock)
    - managerRejectLoan(id, payload): 지점장 결재 거절 (mock)
    - _Requirements: 1.6, 12.2, 12.6, 13.5, 14.3, 15.1, 16.4, 16.7_

- [ ] 5. Checkpoint - 타입, 유틸, Mock, API 레이어 확인
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. 커스텀 훅 구현
  - [x] 6.1 `src/hooks/useLoanDetail.ts` 생성
    - React Query useQuery로 상세 데이터 조회
    - 로딩/에러/데이터 상태 반환
    - _Requirements: 17.1, 17.2, 17.3_

  - [x] 6.2 `src/hooks/useShapResult.ts` 생성
    - React Query useQuery로 SHAP 결과 조회
    - 로딩/에러/데이터 상태 반환
    - _Requirements: 11.4, 11.6_

  - [x] 6.3 `src/hooks/useRecommendation.ts` 생성
    - React Query useQuery로 시스템 추천값 조회 (enabled 옵션으로 모달 열릴 때만 호출)
    - _Requirements: 12.2, 12.9_

  - [x] 6.4 `src/hooks/useManagerApprovals.ts` 생성
    - React Query useQuery로 결재 목록 조회
    - _Requirements: 15.1, 15.5, 15.6_

  - [x] 6.5 `src/hooks/useLoanMutations.ts` 생성
    - useMutation으로 approve, reject, escalate, managerApprove, managerReject 구현
    - 성공 시 관련 queryKey invalidate 처리
    - _Requirements: 12.6, 12.7, 13.5, 13.6, 14.3, 14.4, 16.4, 16.7, 16.8_

- [x] 7. 정보 카드 컴포넌트 구현
  - [x] 7.1 `src/components/loan-detail/CustomerInfoCard.tsx` 생성
    - 이름, 주민번호(마스킹), 연락처, 가입일시, 아이디를 라벨-값 쌍으로 표시
    - null/빈 값은 "-" 표시
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [x] 7.2 `src/components/loan-detail/BusinessInfoCard.tsx` 생성
    - 사업자명, 사업자등록번호, 업종, 업태, 사업장 주소, 사업 개시일 표시
    - 사업자등록번호 "XXX-XX-XXXXX" 포맷, 사업 개시일 "YYYY.MM.DD" 포맷
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [x] 7.3 `src/components/loan-detail/ApplicationConditionCard.tsx` 생성
    - 희망 대출 금액, 대출 기간, 상환 방식, 자금 용도 표시
    - 금액 "N,NNN만원", 기간 "N개월", 상환 방식 한글 라벨 변환
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [x] 7.4 `src/components/loan-detail/ApplicantInputCard.tsx` 생성
    - 연 소득, 신용점수, 소득 종류, 보유 대출액 표시
    - "사용자 직접 입력" 표시로 시스템 수집 정보와 구분
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

  - [x] 7.5 `src/components/loan-detail/SystemCollectedCard.tsx` 생성
    - 전체 너비 카드, "시스템 수집 정보" 제목 + "마이데이터 연동" 배지
    - 재무 현황, 운영 신뢰도, 시장 포지션 3섹션 가로 배치
    - 증감률 색상 처리, 상태 뱃지 색상 처리 (FILED/PAID=초록, PENDING=노란, OVERDUE=빨간)
    - 마이데이터 미연동 시 안내 메시지 표시
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 6.10, 6.11, 6.12_

- [x] 8. 점수 카드 컴포넌트 구현
  - [x] 8.1 `src/components/loan-detail/CBScoreCard.tsx` 생성
    - "CB 신용점수" 라벨, "N점/1000점" 표시, 시각적 게이지 (점수/1000 비율)
    - null 시 "점수 정보 없음" + 게이지 0%
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [x] 8.2 `src/components/loan-detail/SGradeCard.tsx` 생성
    - "성장S등급" 라벨, S1~S10 수평 스케일, 현재 등급 강조
    - S1(왼쪽, 최고) ~ S10(오른쪽, 최저) 배치
    - null 시 "성장S등급이 아직 산출되지 않았습니다" 안내
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [x] 8.3 `src/components/loan-detail/SCBScoreCard.tsx` 생성
    - "SCB 점수" + "가산 반영" 라벨, "N점/1000점" 표시
    - 수평 게이지 바: CB 점수 영역과 가산점 영역 색상 구분
    - "S{N} 등급 가산 +{점수}점 반영" 주석 표시
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 9. SHAP 컴포넌트 구현
  - [x] 9.1 `src/components/loan-detail/ShapBarChart.tsx` 생성
    - 강점 상세: 양수 SHAP 값 수평 바 차트 (파란색)
    - 개선 상세: 음수 SHAP 값 수평 바 차트 (빨간색)
    - 특성명 왼쪽, 영향력 수치 소수점 4자리 오른쪽 표시
    - 절대값 기준 내림차순 정렬
    - 20자 초과 특성명 말줄임 + 툴팁
    - _Requirements: 10.3, 10.4, 10.5, 10.6, 10.7_

  - [x] 9.2 `src/components/loan-detail/AiAdvice.tsx` 생성
    - "AI 분석 요약" 라벨, advice 텍스트를 "•" 구분 항목별 표시
    - 데이터 없을 시 "AI 분석 요약이 아직 준비되지 않았습니다" 안내
    - _Requirements: 11.1, 11.2, 11.3, 11.5_

  - [x] 9.3 `src/components/loan-detail/ShapExplanation.tsx` 생성
    - 왼쪽: 현재 등급 + 목표 등급, 강점/개선 키워드 태그, ShapBarChart
    - 오른쪽: AiAdvice
    - 로딩 스피너, 에러 시 "다시 시도" 버튼
    - SHAP 데이터 미존재 시 안내 메시지
    - _Requirements: 10.1, 10.2, 10.8, 11.4, 11.6_

- [ ] 10. Checkpoint - 정보 카드, 점수 카드, SHAP 컴포넌트 확인
  - Ensure all tests pass, ask the user if questions arise.

- [x] 11. 모달 컴포넌트 구현
  - [x] 11.1 `src/components/loan-detail/ApprovalModal.tsx` 생성
    - 시스템 추천값 조회 → 입력 필드 초기값 설정
    - 승인 금액, 확정 금리, 확정 기간, 상환 방식 수정 가능 필드
    - 의견 입력 필드 (최대 500자)
    - 유효성 검증 실패 시 확인 버튼 비활성화
    - 승인 API 호출 + 로딩 상태 + 에러 처리
    - 추천값 조회 실패 시 빈 필드 + 안내 메시지
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7, 12.8, 12.9, 12.10_

  - [x] 11.2 `src/components/loan-detail/RejectionModal.tsx` 생성
    - 거절 사유 입력 필드 (최대 500자)
    - 의견 입력 필드 (최대 500자)
    - 거절 사유 비어있거나 공백만일 때 확인 버튼 비활성화
    - 거절 API 호출 + 에러 처리 (입력값 유지)
    - 취소 시 입력값 초기화
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7, 13.9_

  - [x] 11.3 `src/components/loan-detail/EscalationDialog.tsx` 생성
    - "해당 건을 지점장에게 추가 결재 요청하시겠습니까?" 안내 문구
    - 의견 입력 필드 (최대 500자)
    - "요청" / "취소" 버튼
    - 추가 결재 요청 API 호출 + 에러 시 토스트 3초 표시
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.6_

- [x] 12. 페이지 컴포넌트 구현
  - [x] 12.1 `src/pages/loan-detail/LoanDetailPage.tsx` 생성 (placeholder 교체)
    - URL 파라미터 `:id` 파싱 및 유효성 검증 (NaN/비양수 → 404)
    - 로딩/에러/404 상태 처리 (로딩 스피너, 에러 메시지 + 재시도, 404 안내 + 목록 이동)
    - 헤더: 신청일, 신청자명, 사업자명, StatusBadge, 액션 버튼
    - 역할/상태 기반 버튼 표시/비활성화 로직
    - 4열 레이아웃 (고객정보, 사업자정보, 신청조건, 신청자입력)
    - 전체너비 (시스템수집정보)
    - 3열 레이아웃 (CB점수, 성장S등급, SCB점수)
    - 전체너비 (SHAP 설명)
    - 반응형: 768px 미만 시 1열 전환
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 17.1, 17.2, 17.3, 17.4, 17.5, 18.1, 18.2, 18.3, 18.4, 18.5, 18.6, 19.1, 19.3, 19.4, 19.6, 19.7_

  - [x] 12.2 `src/pages/manager-approval/ManagerApprovalPage.tsx` 생성 (placeholder 교체)
    - MANAGER_REVIEW 상태 건 목록 테이블 (신청일, 신청자명, 사업자명, 요청 은행원명, 신청 금액)
    - 각 건 "상세보기" 버튼 → `/loan/:id` 이동
    - 빈 목록 시 "결재 대기 중인 건이 없습니다" 메시지
    - 로딩/에러 상태 처리
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6, 19.2_

- [ ] 13. 라우팅 및 권한 연결
  - [ ] 13.1 라우터 설정 업데이트
    - `src/router/routes.tsx`의 PAGE_COMPONENTS에서 loan-detail과 manager-approval의 import를 새 페이지 컴포넌트로 교체
    - 기존 placeholder import 제거
    - _Requirements: 19.1, 19.2, 19.5_

- [ ] 14. Final checkpoint - 전체 기능 통합 확인
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- 테스트 관련 태스크는 사용자 요청에 따라 제외되었습니다. 추후 별도로 추가할 수 있습니다.
- 각 태스크는 이전 태스크의 결과물에 의존하므로 순서대로 진행합니다.
- Mock 데이터 레이어를 먼저 구현하여 실제 API 연동 전까지 독립적으로 개발 가능합니다.
- 향후 API 연동 시 `src/api/loanDetailApi.ts`에서 mock 호출을 axiosInstance 호출로 교체하면 됩니다.
- 기존 프로젝트의 컨벤션(React Query, Zustand, Tailwind CSS, RoleGuard 패턴)을 그대로 따릅니다.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["2.1", "2.2"] },
    { "id": 2, "tasks": ["3.1"] },
    { "id": 3, "tasks": ["4.1"] },
    { "id": 4, "tasks": ["6.1", "6.2", "6.3", "6.4", "6.5"] },
    { "id": 5, "tasks": ["7.1", "7.2", "7.3", "7.4", "7.5", "8.1", "8.2", "8.3"] },
    { "id": 6, "tasks": ["9.1", "9.2"] },
    { "id": 7, "tasks": ["9.3", "11.1", "11.2", "11.3"] },
    { "id": 8, "tasks": ["12.1", "12.2"] },
    { "id": 9, "tasks": ["13.1"] }
  ]
}
```
