import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { TermsPage } from "../terms/TermsPage";
import { useSignupStore } from "../../stores/signupStore";
import { submitSignup } from "../../api/signupApi";
import type { SignupRequest } from "@/types/signup";
import { MOCK_SIGNUP_TERMS } from "@/mocks/signupTerms";

/** 약관 동의 스텝 — 약관 동의 후 회원가입 API 호출 */
export default function TermsStep() {
  const { formData, updateFormData, nextStep } = useSignupStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const signupMutation = useMutation({
    mutationFn: (request: SignupRequest) => submitSignup(request),
    onSuccess: (data) => {
      // 응답의 loginId를 스토어에 저장 (ConfirmStep에서 표시용)
      if (data.result?.loginId) {
        updateFormData({ loginId: data.result.loginId });
      }
      nextStep();
    },
    onError: () => {
      setIsSubmitting(false);
    },
  });

  const handleSubmit = (agreedIds: number[]) => {
    updateFormData({ agreedTermIds: agreedIds });
    setIsSubmitting(true);

    const request: SignupRequest = {
      name: formData.name ?? "",
      residentNumber: formData.residentNumber ?? "",
      phoneNumber: formData.phone ?? "",
      loginId: formData.loginId ?? "",
      password: formData.password ?? "",
    };

    signupMutation.mutate(request);
  };

  return (
    <TermsPage
      title="약관 동의"
      description="서비스 이용을 위해 약관에 동의해주세요."
      terms={MOCK_SIGNUP_TERMS}
      submitLabel={isSubmitting ? "가입 처리 중..." : "가입하기"}
      onSubmit={handleSubmit}
    />
  );
}
