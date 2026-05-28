/**
 * 임시저장 이어가기 모달
 *
 * 대출 신청 시 기존 draft가 존재하면 표시.
 * "이어가기" 또는 "새로 작성" 선택 가능.
 */

interface DraftResumeModalProps {
  onResume: () => void;
  onNewApply: () => void;
  onClose: () => void;
}

export function DraftResumeModal({ onResume, onNewApply, onClose }: DraftResumeModalProps) {
  return (
    <>
      {/* 딤 배경 */}
      <div
        className="fixed inset-0 z-50 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 모달 본체 */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="임시저장 이어가기"
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-40px)] max-w-[360px] bg-white rounded-2xl px-6 pt-8 pb-4"
      >
        <h2 className="text-lg font-bold text-text-primary text-center mb-2">
          대출 신청이 진행중입니다.<br />이어서 진행하시겠습니까?
        </h2>
        <p className="text-sm text-text-secondary text-center mb-8">
          이전에 작성 중이던 대출 신청이 있습니다.
        </p>

        <div className="flex gap-3">
          {/* 새로 작성 */}
          <button
            type="button"
            onClick={onNewApply}
            className="flex-1 h-12 rounded-lg border border-border-default text-sm font-semibold text-text-primary hover:bg-gray-50 transition-colors"
          >
            새로 작성
          </button>

          {/* 이어가기 */}
          <button
            type="button"
            onClick={onResume}
            className="flex-1 h-12 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors"
          >
            이어가기
          </button>
        </div>
      </div>
    </>
  );
}
