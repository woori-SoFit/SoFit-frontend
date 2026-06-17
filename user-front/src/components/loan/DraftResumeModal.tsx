/**
 * 임시저장 이어가기 모달
 *
 * 대출 신청 시 기존 draft가 존재하면 표시.
 * 공통 ConfirmModal을 사용.
 */
import { ConfirmModal } from "@/components/common/ConfirmModal";

interface DraftResumeModalProps {
  onResume: () => void;
  onNewApply: () => void;
  onClose: () => void;
}

export function DraftResumeModal({ onResume, onNewApply, onClose }: DraftResumeModalProps) {
  return (
    <ConfirmModal
      title="이어서 진행하시겠습니까?"
      description="이전에 작성 중이던 대출 신청이 있습니다."
      cancelLabel="새로 작성"
      confirmLabel="이어가기"
      onDimClick={onClose}
      onCancel={() => {
        onClose();
        onNewApply();
      }}
      onConfirm={() => {
        onClose();
        onResume();
      }}
    />
  );
}
