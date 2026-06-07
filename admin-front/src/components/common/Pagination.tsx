interface PaginationProps {
  /** 현재 페이지 (1-based) */
  currentPage: number;
  /** 전체 페이지 수 */
  totalPages: number;
  /** 페이지 변경 핸들러 */
  onPageChange: (page: number) => void;
  /** 추가 className */
  className?: string;
}

/**
 * 공통 페이지네이션 컴포넌트.
 * [<] [1] [2] [3] [4] [5] [>] 형태로 표시합니다.
 */
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}: PaginationProps) {
  const pages = Math.max(totalPages, 1);

  // 표시할 페이지 번호 계산 (최대 5개)
  const getPageNumbers = (): number[] => {
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(pages, start + maxVisible - 1);
    start = Math.max(1, end - maxVisible + 1);

    const numbers: number[] = [];
    for (let i = start; i <= end; i++) {
      numbers.push(i);
    }
    return numbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={`flex items-center justify-center gap-1 pt-4 ${className}`}>
      {/* 이전 */}
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage <= 1}
        className="w-8 h-8 flex items-center justify-center text-sm border border-border-default rounded-md disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        &lt;
      </button>

      {/* 페이지 번호 */}
      {pageNumbers.map((num) => (
        <button
          key={num}
          type="button"
          onClick={() => onPageChange(num)}
          className={`w-8 h-8 flex items-center justify-center text-sm rounded-md transition-all ${
            num === currentPage
              ? 'bg-primary text-white font-medium'
              : 'border border-border-default text-text-secondary hover:bg-gray-50'
          }`}
        >
          {num}
        </button>
      ))}

      {/* 다음 */}
      <button
        type="button"
        onClick={() => onPageChange(Math.min(pages, currentPage + 1))}
        disabled={currentPage >= pages}
        className="w-8 h-8 flex items-center justify-center text-sm border border-border-default rounded-md disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        &gt;
      </button>
    </div>
  );
}
