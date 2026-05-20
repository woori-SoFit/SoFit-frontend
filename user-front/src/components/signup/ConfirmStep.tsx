/**
 * 가입 완료 스텝 (Step 5: CONFIRM)
 * ConfirmPage 공통 컴포넌트를 재사용한다.
 * TODO: API 연동 시 useMutation + submitSignup 복원
 */
import { useNavigate } from "react-router-dom";
import { useSignupStore } from "../../stores/signupStore";
import { ConfirmPage } from "../common/ConfirmPage";

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
    <ConfirmPage
      title="가입이 완료되었습니다."
      description="SOFIT 회원가입을 환영합니다!"
      rows={[
        { label: "아이디", value: formData.loginId || "—" },
        { label: "가입일시", value: signupDate },
      ]}
      buttonLabel="로그인하기"
      onConfirm={handleGoToLogin}
    />
  );
}
