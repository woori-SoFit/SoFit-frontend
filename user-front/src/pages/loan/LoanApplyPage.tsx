/**
 * 대출 신청 페이지 — step 기반 흐름
 * Route: /loan/apply
 * Layout: StepLayout (하단 네비 없음)
 *
 * Step 순서:
 *   TERMS          → 약관 동의
 *   CERT_INFO      → 고객 정보 입력 + PIN 인증 (CustomerVerifyPage가 내부에서 PIN까지 처리)
 *   PIN            → (CustomerVerifyPage 내부에서 처리, 외부에서 직접 진입 안 함)
 *   BIZ_CONFIRM    → 사업자 정보 확인
 *   MYDATA_TERMS   → MyData 동의
 *   MYDATA_LOADING → 데이터 로딩
 *   LOAN_CONDITIONS→ 대출 조건 입력
 *   RESULT         → 신청 완료/실패
 *
 * step 상태: useLoanApplyStore (Zustand)
 */
import { useEffect } from "react";
import { useLayoutStore } from "@/stores/layoutStore";
import { useLoanApplyStore } from "@/stores/loanApplyStore";
import { TermsPage } from "@/components/terms/TermsPage";
import { CustomerVerifyPage } from "@/components/auth/CustomerVerifyPage";
import { BizInfoConfirm } from "@/components/loan/BizInfoConfirm";
import { MydataLoadingStep } from "@/components/loan/MydataLoadingStep";
import { LoanConditionsStep } from "@/components/loan/LoanConditionsStep";
import { LoanApplyResult } from "@/components/loan/LoanApplyResult";
import { MOCK_LOAN_TERMS } from "@/mocks/loanTerms";
import { MOCK_BIZ_INFO_ROWS } from "@/mocks/bizInfo";
import { MOCK_MYDATA_TERMS } from "@/mocks/mydataTerms";
import { MOCK_LOAN_APPLY_RESULT_ROWS } from "@/mocks/loanApplyResult";
import { useNavigate } from "react-router-dom";

export default function LoanApplyPage() {
  const currentStep = useLoanApplyStore((s) => s.currentStep);
  const nextStep = useLoanApplyStore((s) => s.nextStep);
  const setStep = useLoanApplyStore((s) => s.setStep);
  const updateFormData = useLoanApplyStore((s) => s.updateFormData);
  const reset = useLoanApplyStore((s) => s.reset);
  const navigate = useNavigate();

  useEffect(() => {
    useLayoutStore.getState().setStepTitle("대출 신청");
  }, []);

  switch (currentStep) {
    case "TERMS":
      return (
        <TermsPage
          title="대출 약관 동의"
          description="대출 신청을 위해 아래 약관에 동의해 주세요."
          terms={MOCK_LOAN_TERMS}
          submitLabel="동의하고 계속"
          onSubmit={(agreedIds) => {
            updateFormData({ agreedTermIds: agreedIds });
            nextStep();
          }}
        />
      );

    case "CERT_INFO":
    case "PIN":
      return (
        <CustomerVerifyPage
          description="본인 확인을 위해 정보를 입력해 주세요."
          onSubmit={() => {
            // PIN 인증 완료 → BIZ_CONFIRM으로 이동
            setStep("BIZ_CONFIRM");
          }}
        />
      );

    case "BIZ_CONFIRM":
      return (
        <BizInfoConfirm
          title={<><span className="text-primary">사업자 정보</span>를 불러왔어요</>}
          description="아래 정보가 맞는지 확인해주세요."
          rows={MOCK_BIZ_INFO_ROWS}
          onConfirm={() => nextStep()}
        />
      );

    case "MYDATA_TERMS":
      return (
        <TermsPage
          title="마이데이터 정보 동의"
          description="대출 심사를 위해 마이데이터 정보 활용에 동의해 주세요."
          terms={MOCK_MYDATA_TERMS}
          submitLabel="동의하고 계속"
          onSubmit={() => {
            nextStep();
          }}
        />
      );

    case "MYDATA_LOADING":
      return (
        <MydataLoadingStep onComplete={() => nextStep()} />
      );

    case "LOAN_CONDITIONS":
      return (
        <LoanConditionsStep
          onSubmit={(data) => {
            updateFormData({
              desiredAmount: data.desiredAmount,
              desiredTerm: data.desiredTerm,
              repaymentMethod: data.repaymentMethod,
              purpose: data.purpose,
            });
            nextStep();
          }}
        />
      );

    case "RESULT": {
      return (
        <LoanApplyResult
          rows={MOCK_LOAN_APPLY_RESULT_ROWS}
          onViewApplications={() => {
            reset();
            navigate("/loan-applications");
          }}
          onGoHome={() => {
            reset();
            navigate("/");
          }}
        />
      );
    }

    default:
      return null;
  }
}
