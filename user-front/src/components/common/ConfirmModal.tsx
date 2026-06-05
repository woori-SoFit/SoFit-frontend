/**
 * 공통 확인 모달 컴포넌트
 *
 * 제목 + 설명 + 2개 버튼(취소/확인) 구조.
 * 다양한 확인 모달에서 재사용.
 *
 * 사용처:
 * - 대출 플로우 이탈 방지 모달
 * - 임시저장 이어가기 모달
 * - 기타 확인이 필요한 모달
 */

interface ConfirmModalProps {
  /** 모달 제목 */
  title: string;
  /** 모달 설명 (선택) */
  description?: string;
  /** 왼쪽 버튼 레이블 (기본값: "취소") */
  cancelLabel?: string;
  /** 오른쪽 버튼 레이블 (기본값: "확인") */
  confirmLabel?: string;
  /** 왼쪽 버튼 클릭 */
  onCancel: () => void;
  /** 오른쪽 버튼 클릭 */
  onConfirm: () => void;
  /**
   * 딤 배경 클릭 시 동작 (선택)
   * - 전달하지 않으면 기존 동작(onConfirm) 유지
   * - null 전달 시 딤 클릭 비활성화
   */
  onDimClick?: (() => void) | null;
}

export function ConfirmModal({
  title,
  description,
  cancelLabel = "취소",
  confirmLabel = "확인",
  onCancel,
  onConfirm,
  onDimClick,
}: ConfirmModalProps) {
  const handleDimClick = onDimClick === undefined ? onConfirm : onDimClick ?? undefined;

  return (
    <>
      {/* 딤 배경 */}
      <div
        className="fixed inset-0 z-50 bg-black/40"
        onClick={handleDimClick}
        aria-hidden="true"
      />

      {/* 모달 본체 */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-40px)] max-w-[360px] bg-white rounded-2xl p-6"
      >
        <h2 className="text-lg font-bold text-text-primary text-center mb-2">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-text-secondary text-center whitespace-pre-line mb-6">
            {description}
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 h-12 rounded-xl border border-border-default text-sm font-semibold text-text-primary hover:bg-gray-50 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 h-12 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </>
  );
}
