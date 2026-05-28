/**
 * 공통 스텝 진행 표시 컴포넌트
 *
 * 사용처:
 * - 대출 신청 플로우
 * - 기타 다단계 흐름
 *
 * Props로 steps 배열과 currentIndex를 받아 범용적으로 사용.
 */

interface StepProgressProps {
  /** 스텝 라벨 배열 */
  steps: string[];
  /** 현재 활성 스텝 인덱스 (0-based) */
  currentIndex: number;
}

export function StepProgress({ steps, currentIndex }: StepProgressProps) {
  return (
    <div className="w-full px-5 py-1.5">
      <div className="relative flex items-start">
        {/* 연결선 */}
        <div className="absolute top-2.5 left-0 right-0 flex px-[10%]">
          {steps.slice(0, -1).map((_, index) => (
            <div
              key={index}
              className={`flex-1 h-0.5 ${index < currentIndex ? "bg-primary" : "bg-gray-200"}`}
              aria-hidden="true"
            />
          ))}
        </div>

        {steps.map((label, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={label} className="flex-1 flex flex-col items-center relative z-10">
              <div
                aria-label={`${label} 단계${isCompleted ? " (완료)" : isCurrent ? " (현재)" : " (미완료)"}`}
                aria-current={isCurrent ? "step" : undefined}
                className={`
                  w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium
                  ${isCompleted
                    ? "bg-primary text-white"
                    : isCurrent
                      ? "bg-primary text-white ring-2 ring-primary/30 ring-offset-2"
                      : "bg-gray-200 text-gray-400"
                  }
                `}
              >
                {isCompleted ? (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={`
                  mt-1.5 text-[10px] whitespace-nowrap
                  ${isCompleted || isCurrent ? "text-primary font-medium" : "text-gray-400"}
                `}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
