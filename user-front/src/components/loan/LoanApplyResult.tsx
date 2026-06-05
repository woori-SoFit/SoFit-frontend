/**
 * 대출 신청 완료 화면
 *
 * ConfirmPage 공통 컴포넌트 + Lottie 축하 애니메이션 오버레이
 *
 * 사용처:
 * - 대출 신청 RESULT step
 */
import Lottie from "lottie-react";
import { ConfirmPage } from "@/components/common/ConfirmPage";
import type { InfoRow } from "@/components/common/ConfirmPage";
import checkAnimation from "@/assets/lottie/Check.json";

interface LoanApplyResultProps {
  /** 정보 테이블 데이터 */
  rows: InfoRow[];
  /** "신청 내역 보기" 클릭 시 */
  onViewApplications: () => void;
  /** "홈으로 이동" 클릭 시 */
  onGoHome: () => void;
}

export function LoanApplyResult({
  rows,
  onViewApplications,
  onGoHome,
}: LoanApplyResultProps) {
  return (
    <div className="relative h-full pt-15">
      <ConfirmPage
        icon={<Lottie animationData={checkAnimation} loop={1} className="w-42" />}
        title="대출 신청이 완료되었습니다!"
        description="신청 결과는 알림으로 안내해 드릴게요."
        rows={rows}
        secondaryButtonLabel="신청 내역 보기"
        onSecondary={onViewApplications}
        buttonLabel="홈으로 이동"
        onConfirm={onGoHome}
      />
    </div>
  );
}
