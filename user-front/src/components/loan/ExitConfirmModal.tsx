/**
 * 대출 플로우 이탈 방지 모달
 *
 * 뒤로가기 또는 홈 버튼 클릭 시 표시.
 * 공통 ConfirmModal을 사용.
 */
import { ConfirmModal } from "@/components/common/ConfirmModal";

interface ExitConfirmModalProps {
  /** 모달 유형 */
  type: "back" | "home";
  /** 모달 닫기 (계속 진행하기) */
  onClose: () => void;
  /** 확인 후 이동 */
  onConfirm: () => void;
}

const MODAL_CONFIG = {
  back: {
    title: "대출 신청을 종료하시겠어요?",
    description: "현재 진행 단계는 자동 저장되며,\n언제든 이어서 신청할 수 있어요.",
    cancelLabel: "나가기",
    confirmLabel: "계속 진행하기",
  },
  home: {
    title: "홈으로 이동하시겠어요?",
    description: "진행 중인 대출 신청 내용은 저장되며,\n다음에 이어서 진행할 수 있어요.",
    cancelLabel: "홈으로 이동",
    confirmLabel: "계속 진행하기",
  },
} as const;

export function ExitConfirmModal({ type, onClose, onConfirm }: ExitConfirmModalProps) {
  const config = MODAL_CONFIG[type];

  return (
    <ConfirmModal
      title={config.title}
      description={config.description}
      cancelLabel={config.cancelLabel}
      confirmLabel={config.confirmLabel}
      onCancel={onConfirm}
      onConfirm={onClose}
    />
  );
}
