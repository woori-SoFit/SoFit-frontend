/**
 * 완료/실패 상태 카드 공통 컴포넌트
 *
 * 사용처:
 * - 대출 신청 완료
 * - 대출 신청 실패
 * - 대출 실행 완료
 * - 회원가입 완료
 */

interface StatusCardProps {
  status: "success" | "failure" | "pending";
  title: string;
  description?: string;
  /** 하단 액션 버튼 */
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary";
  }>;
}

export function StatusCard(_props: StatusCardProps) {
  // TODO: UI 구현
  return <div data-testid="status-card" />;
}
