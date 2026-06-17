import { useSignupStore } from "../../stores/signupStore";
import { CustomerVerifyPage } from "../auth/CustomerVerifyPage";
import type { CustomerVerifyData } from "@/types/auth";

/**
 * 회원가입 Step 2 — 고객 정보 입력 및 금융인증서 PIN 인증
 * CustomerVerifyPage 공통 컴포넌트를 재사용한다.
 * 인증 성공 시 입력 정보를 signupStore에 저장하고 다음 스텝으로 이동.
 */
export default function CustomerVerifyStep() {
  const { updateFormData, nextStep } = useSignupStore();

  return (
    <CustomerVerifyPage
      description="회원가입을 위해 본인 정보를 입력해주세요."
      variant="signup"
      onSuccess={(data: CustomerVerifyData) => {
        updateFormData({
          name: data.name,
          residentNumber: data.residentNumber,
          phone: data.phone,
        });
        nextStep();
      }}
    />
  );
}
