/**
 * 대출 신청 페이지 — step 기반 흐름
 * Route: /loan/apply
 * Layout: StepLayout (하단 네비 없음)
 *
 * Step 순서:
 *   TERMS          → 약관 동의
 *   CERT_INFO      → 금융인증 정보 입력
 *   PIN            → 공동인증 PIN 입력
 *   BIZ_CONFIRM    → 사업자 정보 확인
 *   MYDATA_TERMS   → MyData 동의
 *   MYDATA_LOADING → 데이터 로딩
 *   LOAN_CONDITIONS→ 대출 조건 입력
 *   RESULT         → 신청 완료/실패
 *
 * step 상태: useLoanApplyStore (Zustand)
 * 심사 이후 화면은 별도 route로 분리 (/loan/review, /loan/result, ...)
 */
import { useLoanApplyStore } from "@/stores/loanApplyStore";

export default function LoanApplyPage() {
  const currentStep = useLoanApplyStore((s) => s.currentStep);

  // TODO: step별 컴포넌트 렌더링
  return (
    <div data-testid="loan-apply-page" data-step={currentStep} />
  );
}
