/**
 * 공통 알림 모달 컴포넌트
 *
 * 메시지와 확인 버튼을 표시하는 간단한 모달.
 * 배경 오버레이 클릭 시 닫히지 않음 (버튼으로만 닫기).
 *
 * 사용처:
 * - API 에러 안내
 * - 중복 신청 안내
 * - 기타 사용자 알림
 */

interface AlertModalProps {
  /** 모달 표시 여부 */
  isOpen: boolean;
  /** 모달 메시지 */
  message: string;
  /** 확인 버튼 레이블 (기본값: "확인") */
  buttonLabel?: string;
  /** 확인 버튼 클릭 시 호출 */
  onConfirm: () => void;
}

export function AlertModal({
  isOpen,
  message,
  buttonLabel = "확인",
  onConfirm,
}: AlertModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-5"
      role="dialog"
      aria-modal="true"
    >
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black/40" />

      {/* 모달 본체 */}
      <div className="relative w-full max-w-[320px] rounded-2xl bg-white px-6 py-8 shadow-lg">
        {/* 메시지 */}
        <p className="text-base text-text-primary text-center leading-relaxed whitespace-pre-line">
          {message}
        </p>

        {/* 확인 버튼 */}
        <button
          type="button"
          onClick={onConfirm}
          className="mt-8 w-full h-11 rounded-lg text-sm font-semibold bg-primary text-white hover:bg-primary-dark active:bg-primary-dark transition-colors cursor-pointer"
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}
