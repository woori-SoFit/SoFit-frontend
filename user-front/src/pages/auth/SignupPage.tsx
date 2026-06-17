/**
 * 회원가입 페이지 — 5단계 스텝 기반 플로우 컨테이너
 * Route: /signup
 * Layout: StepLayout (하단 네비 없음)
 *
 * Step 순서:
 *   KYC             → 사업자등록번호 입력 및 진위 확인
 *   CUSTOMER_VERIFY → 고객 정보 입력 + 금융인증서 PIN 인증
 *   CREDENTIALS     → 아이디/비밀번호 설정
 *   TERMS           → 약관 동의
 *   CONFIRM         → 가입 완료
 *
 * 뒤로가기 처리:
 *   - KYC 스텝: navigate(-1) (플로우 이탈)
 *   - 그 외 스텝: prevStep() 호출 (이전 스텝 이동)
 *
 * step 상태: useSignupStore (Zustand)
 */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLayoutStore } from "@/stores/layoutStore";
import { useSignupStore } from "@/stores/signupStore";
import { StepIndicator } from "@/components/signup/StepIndicator";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import KycStep from "@/components/signup/KycStep";
import CustomerVerifyStep from "@/components/signup/CustomerVerifyStep";
import CredentialsStep from "@/components/signup/CredentialsStep";
import TermsStep from "@/components/signup/TermsStep";
import ConfirmStep from "@/components/signup/ConfirmStep";

export default function SignupPage() {
  const currentStep = useSignupStore((s) => s.currentStep);
  const navigate = useNavigate();
  const [showExitModal, setShowExitModal] = useState(false);

  useEffect(() => {
    useLayoutStore.getState().setStepTitle("회원가입");

    // 뒤로가기/홈 버튼: 이탈 방지 모달 표시
    useLayoutStore.getState().setOnBack(() => {
      const step = useSignupStore.getState().currentStep;
      if (step === "CONFIRM") {
        navigate("/login", { replace: true });
      } else {
        setShowExitModal(true);
      }
    });

    useLayoutStore.getState().setOnHome(() => {
      const step = useSignupStore.getState().currentStep;
      if (step === "CONFIRM") {
        navigate("/");
      } else {
        setShowExitModal(true);
      }
    });

    return () => {
      useLayoutStore.getState().setOnBack(null);
      useLayoutStore.getState().setOnHome(null);
      useSignupStore.getState().reset();
    };
  }, [navigate]);

  const renderStep = () => {
    switch (currentStep) {
      case "KYC":
        return (
          <div className="flex flex-col h-full overflow-hidden">
            <StepIndicator />
            <KycStep />
          </div>
        );
      case "CUSTOMER_VERIFY":
        return (
          <div className="flex flex-col h-full overflow-hidden">
            <StepIndicator />
            <CustomerVerifyStep />
          </div>
        );
      case "CREDENTIALS":
        return (
          <div className="flex flex-col h-full overflow-hidden">
            <StepIndicator />
            <CredentialsStep />
          </div>
        );
      case "TERMS":
        return (
          <div className="flex flex-col h-full overflow-hidden">
            <StepIndicator />
            <TermsStep />
          </div>
        );
      case "CONFIRM":
        return (
          <div className="flex flex-col h-full overflow-hidden">
            <ConfirmStep />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {renderStep()}

      {/* 이탈 방지 */}
      {showExitModal && (
        <ConfirmModal
          title="회원가입을 그만두시겠어요?"
          description="지금 나가면 입력한 정보가 저장되지 않아요."
          cancelLabel="나가기"
          confirmLabel="계속하기"
          onCancel={() => {
            setShowExitModal(false);
            useSignupStore.getState().reset();
            navigate("/login", { replace: true });
          }}
          onConfirm={() => setShowExitModal(false)}
          onDimClick={() => setShowExitModal(false)}
        />
      )}
    </>
  );
}
