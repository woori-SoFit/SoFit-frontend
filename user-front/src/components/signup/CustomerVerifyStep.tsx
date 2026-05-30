import { useSignupStore } from "../../stores/signupStore";
import { CustomerVerifyPage } from "../auth/CustomerVerifyPage";
import { verifyPinForSignup } from "../../api/authApi";
import { AxiosError } from "axios";
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
        try {
          const response = await verifyPinForSignup({
            phoneNumber: data.phone,
            pin: data.pin,
          });
          // 성공 시 이름/주민번호/연락처를 스토어에 저장
          if (response.isSuccess) {
            updateFormData({
              name: data.name,
              residentNumber: data.residentNumber,
              phone: data.phone,
            });
          }
          return {
            success: response.isSuccess,
            message: response.message,
          };
        } catch (err) {
          const status = (err as AxiosError)?.response?.status;
          if (status === 404) {
            return {
              success: false,
              message: "인증서를 찾을 수 없습니다. 정보를 다시 확인해주세요.",
              resetToInfo: true,
            };
          }
          return {
            success: false,
            message: "PIN이 일치하지 않습니다. 다시 입력해 주세요.",
          };
        }
      }}
      onSuccess={() => {
        nextStep();
      }}
    />
  );
}
