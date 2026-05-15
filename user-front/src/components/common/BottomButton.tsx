/**
 * 하단 고정 버튼 공통 컴포넌트
 *
 * 사용처:
 * - 약관 동의 다음 버튼
 * - 대출 신청 각 step 다음 버튼
 * - 기타 step 흐름의 하단 CTA 버튼
 */

interface BottomButtonProps {
  /** 버튼 레이블 */
  label: string;
  /** 클릭 핸들러 */
  onClick: () => void;
  /** 비활성 여부 (기본값: false) */
  disabled?: boolean;
}

export function BottomButton({ label, onClick, disabled = false }: BottomButtonProps) {
  return (
    <div className="sticky bottom-0 p-5">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="w-full h-12 rounded-lg text-base font-semibold transition-colors bg-primary text-white hover:bg-primary-dark active:bg-primary-dark cursor-pointer disabled:bg-bg-muted disabled:text-text-disabled disabled:cursor-not-allowed"
      >
        {label}
      </button>
    </div>
  );
}
