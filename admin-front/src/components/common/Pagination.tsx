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
 * 이전/다음 버튼과 현재 페이지 표시를 제공합니다.
 */
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}: PaginationProps) {
  const pages = Math.max(totalPages, 1);

  return (
    <div className={`flex items-center justify-center gap-2 pt-4 ${className}`}>
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage <= 1}
        className="px-3 py-1.5 text-sm border border-border-default rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        이전
      </button>

      <span className="text-sm text-text-secondary">
        {currentPage} / {pages}
      </span>

      <button
        type="button"
        onClick={() => onPageChange(Math.min(pages, currentPage + 1))}
        disabled={currentPage >= pages}
        className="px-3 py-1.5 text-sm border border-border-default rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        다음
      </button>
    </div>
  );
}
