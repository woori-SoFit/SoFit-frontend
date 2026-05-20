import { useSignupStore } from "../../stores/signupStore";
import { CustomerVerifyPage } from "../auth/CustomerVerifyPage";
import { verifyFinancialCertificate } from "../../api/authApi";
import type { CustomerVerifyData } from "@/types/auth";

/**
 * 회원가입 Step 2 — 고객 정보 입력 및 금융인증서 PIN 인증
 * CustomerVerifyPage 공통 컴포넌트를 재사용한다.
 */
export default function CustomerVerifyStep() {
  const { updateFormData, nextStep } = useSignupStore();

  return (
    <CustomerVerifyPage
      description="회원가입을 위해 본인 정보를 입력해주세요."
      onVerify={async (data: CustomerVerifyData) => {
        const response = await verifyFinancialCertificate({
          phoneNumber: data.phone,
          pin: data.pin,
        });
        // 성공 시 이름/연락처를 스토어에 저장
        if (response.isSuccess) {
          updateFormData({ name: data.name, phone: data.phone });
        }
        return {
          success: response.isSuccess,
          message: response.message,
        };
      }}
      onSuccess={() => {
        nextStep();
      }}
    />
  );
}
