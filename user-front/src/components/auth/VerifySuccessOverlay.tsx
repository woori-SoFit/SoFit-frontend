/**
 * PIN 인증 성공 오버레이 컴포넌트
 *
 * PIN 화면 위에 dim + 카드 형태로 성공 애니메이션을 표시.
 *
 * 사용처: CustomerVerifyPage PIN 인증 성공 시
 */
import Lottie from "lottie-react";
import verificationAnimation from "@/assets/lottie/Verification.json";

interface VerifySuccessOverlayProps {
  /** 표시 여부 */
  visible: boolean;
  /** 표시 메시지 (기본: "인증이 완료되었습니다") */
  message?: string;
}

export function VerifySuccessOverlay({
  visible,
  message = "인증이 완료되었습니다",
}: VerifySuccessOverlayProps) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/30 animate-fade-in">
      <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-3 shadow-modal">
        <div className="w-24 h-24">
          <Lottie animationData={verificationAnimation} loop={false} className="w-full h-full" />
        </div>
        <p className="text-base font-bold text-text-primary">{message}</p>
      </div>
    </div>
  );
}
