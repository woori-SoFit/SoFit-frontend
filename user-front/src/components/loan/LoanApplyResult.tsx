/**
 * 대출 신청 완료 화면
 *
 * ConfirmPage 공통 컴포넌트를 활용한 래퍼
 *
 * 사용처:
 * - 대출 신청 RESULT step
 */
import { ConfirmPage } from "@/components/common/ConfirmPage";
import type { InfoRow } from "@/components/common/ConfirmPage";

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
    <ConfirmPage
      title="대출 신청이 완료되었습니다!"
      description="신청 결과는 알림으로 안내해 드릴게요."
      rows={rows}
      secondaryButtonLabel="신청 내역 보기"
      onSecondary={onViewApplications}
      buttonLabel="홈으로 이동"
      onConfirm={onGoHome}
    />
  );
}
