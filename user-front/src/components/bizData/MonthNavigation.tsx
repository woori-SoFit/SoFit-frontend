import { ChevronLeft, ChevronRight } from "lucide-react";

interface MonthNavigationProps {
  /** 서버에서 받은 가용 월 목록 (내림차순: 최신이 index 0) */
  availableMonths: string[];
  /** 현재 선택된 월 "YYYY-MM" */
  selectedMonth: string;
  /** 월 변경 콜백 */
  onMonthChange: (month: string) => void;
}

/**
 * "YYYY-MM" → "YYYY.MM" 표시 형식으로 변환
 */
function formatDisplay(month: string): string {
  return month.replace("-", ".");
}

/**
 * 월 네비게이션 컴포넌트
 *
 * - 좌측 화살표: 이전 월 (배열에서 index + 1 방향)
 * - 우측 화살표: 다음 월 (배열에서 index - 1 방향)
 * - 경계에서 화살표 disabled
 * - 빈 배열 시 현재 시스템 월 표시 + 양쪽 disabled
 */
export function MonthNavigation({
  availableMonths,
  selectedMonth,
  onMonthChange,
}: MonthNavigationProps) {
  // fallback: availableMonths가 비었으면 현재 시스템 월 사용
  const fallbackMonth = (() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  })();

  const displayMonth = selectedMonth || fallbackMonth;
  const isEmpty = availableMonths.length === 0;
  const currentIndex = availableMonths.indexOf(selectedMonth);

  // 가장 과거 월(배열 마지막)이면 왼쪽 disabled
  const isLeftDisabled = isEmpty || currentIndex >= availableMonths.length - 1;
  // 가장 최신 월(배열 첫 번째)이면 오른쪽 disabled
  const isRightDisabled = isEmpty || currentIndex <= 0;

  const handleLeft = () => {
    if (isLeftDisabled) return;
    onMonthChange(availableMonths[currentIndex + 1]);
  };

  const handleRight = () => {
    if (isRightDisabled) return;
    onMonthChange(availableMonths[currentIndex - 1]);
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={handleLeft}
        disabled={isLeftDisabled}
        aria-label="이전 월"
        className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors disabled:opacity-30 disabled:pointer-events-none"
      >
        <ChevronLeft size={18} className="text-text-primary" />
      </button>

      <span className="text-sm font-semibold text-text-primary min-w-[70px] text-center">
        {formatDisplay(displayMonth)}
      </span>

      <button
        type="button"
        onClick={handleRight}
        disabled={isRightDisabled}
        aria-label="다음 월"
        className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors disabled:opacity-30 disabled:pointer-events-none"
      >
        <ChevronRight size={18} className="text-text-primary" />
      </button>
    </div>
  );
}
