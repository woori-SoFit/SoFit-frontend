import { TermsPage } from "../terms/TermsPage";
import { useSignupStore } from "../../stores/signupStore";
import { MOCK_SIGNUP_TERMS } from "@/mocks/signupTerms";

/** 약관 동의 스텝 — TermsPage 공통 컴포넌트를 래핑 */
export default function TermsStep() {
  const { updateFormData, nextStep } = useSignupStore();

  const handleSubmit = (agreedIds: number[]) => {
    updateFormData({ agreedTermIds: agreedIds });
    nextStep();
  };

  return (
    <TermsPage
      title="약관 동의"
      description="서비스 이용을 위해 약관에 동의해주세요."
      terms={MOCK_SIGNUP_TERMS}
      submitLabel="다음"
      onSubmit={handleSubmit}
    />
  );
}
