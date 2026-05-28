import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { TermsPage } from "../terms/TermsPage";
import { useSignupStore } from "../../stores/signupStore";
import { submitSignup } from "../../api/signupApi";
import type { SignupRequest, ConsentItem } from "@/types/signup";
import { useTerms } from "@/hooks/useTerms";

/** 약관 동의 스텝 — 약관 동의 후 회원가입 API 호출 */
export default function TermsStep() {
  const { formData, updateFormData, nextStep } = useSignupStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { terms } = useTerms("PERSONAL_INFO");

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

    // API에서 조회한 약관 목록 기준으로 consents 배열 생성
    const consents: ConsentItem[] = terms.map((term) => ({
      termId: term.id,
      isConsented: agreedIds.includes(term.id),
    }));

    const request: SignupRequest = {
      name: formData.name ?? "",
      residentNumber: formData.residentNumber ?? "",
      phoneNumber: formData.phone ?? "",
      loginId: formData.loginId ?? "",
      password: formData.password ?? "",
      consents,
    };

    signupMutation.mutate(request);
  };

  return (
    <TermsPage
      termType="PERSONAL_INFO"
      title="약관 동의"
      description="서비스 이용을 위해 약관에 동의해주세요."
      submitLabel={isSubmitting ? "가입 처리 중..." : "가입하기"}
      onSubmit={handleSubmit}
    />
  );
}
