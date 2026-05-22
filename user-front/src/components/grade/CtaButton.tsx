/**
 * CTA 버튼 컴포넌트
 *
 * 화면 하단에 고정(fixed) 배치되는 액션 버튼.
 * 로딩 상태 시 스피너를 표시하고 클릭을 비활성화하며,
 * disabled 상태 시 클릭 입력을 무시한다.
 *
 * @see Requirements 3.1, 3.5, 3.6
 */

interface CtaButtonProps {
  /** 버튼 레이블 텍스트 */
  label: string;
  /** 클릭 핸들러 */
  onClick: () => void;
  /** 로딩 상태 여부 (로딩 중 스피너 표시 및 클릭 비활성화) */
  isLoading: boolean;
  /** 비활성 상태 여부 (클릭 무시) */
  disabled: boolean;
}

export function CtaButton({ label, onClick, isLoading, disabled }: CtaButtonProps) {
  /** 로딩 중이거나 disabled일 때 클릭 무시 */
  const isDisabled = isLoading || disabled;

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] p-5 bg-bg-base">
      <button
        type="button"
        onClick={onClick}
        disabled={isDisabled}
        className="w-full h-12 rounded-lg text-base font-semibold transition-colors bg-primary text-white hover:bg-primary-dark active:bg-primary-dark cursor-pointer disabled:bg-bg-muted disabled:text-text-disabled disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            {/* 로딩 스피너 */}
            <svg
              className="animate-spin h-5 w-5 text-text-disabled"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <span className="sr-only">로딩 중</span>
          </>
        ) : (
          label
        )}
      </button>
    </div>
  );
}
