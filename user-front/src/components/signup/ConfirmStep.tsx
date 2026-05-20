/**
 * 가입 완료 스텝 (Step 5: CONFIRM)
 * ConfirmPage 공통 컴포넌트 재사용 + Lottie 축하 애니메이션 오버레이
 * TODO: API 연동 시 useMutation + submitSignup 복원
 */
import Lottie from "lottie-react";
import { useNavigate } from "react-router-dom";
import { useSignupStore } from "../../stores/signupStore";
import { ConfirmPage } from "../common/ConfirmPage";
import confettiAnimation from "@/assets/lottie/Flex-Confetti.json";

export default function ConfirmStep() {
  const navigate = useNavigate();
  const formData = useSignupStore((s) => s.formData);
  const reset = useSignupStore((s) => s.reset);

  const now = new Date();
  const signupDate = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  const handleGoToLogin = () => {
    reset();
    navigate("/login");
  };

  return (
    <div className="relative h-full mt-28">
    {/* Lottie 축하 애니메이션 */}
    <div className="absolute inset-0 pointer-events-none z-10 flex items-start">
      <Lottie
        animationData={confettiAnimation}
        loop={true}
        className="w-full max-w-sm -translate-y-35"
      />
    </div>

    {/* 기존 ConfirmPage */}
    <ConfirmPage
      title="가입이 완료되었습니다!"
      description="SoFit 회원가입을 환영합니다"
      rows={[
        { label: "아이디", value: formData.loginId || "—" },
        { label: "가입일시", value: signupDate },
      ]}
      buttonLabel="로그인하기"
      onConfirm={handleGoToLogin}
    />
  </div>
  );
}
