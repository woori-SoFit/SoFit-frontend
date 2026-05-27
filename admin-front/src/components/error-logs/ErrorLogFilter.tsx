import type { ErrorLevel } from '@/types/errorLog';

interface ErrorLogFilters {
  keyword: string;
  level: ErrorLevel | '';
  serverName: string;
}

interface ErrorLogFilterProps {
  filters: ErrorLogFilters;
  onFiltersChange: (filters: ErrorLogFilters) => void;
}

/**
 * 에러 로그 검색/필터 컴포넌트
 */
export default function ErrorLogFilter({ filters, onFiltersChange }: ErrorLogFilterProps) {
  return (
    <div className="flex items-center gap-3">
      {/* 키워드 검색 */}
      <input
        type="text"
        placeholder="메시지, 클래스, 엔드포인트 검색"
        value={filters.keyword}
        onChange={(e) => onFiltersChange({ ...filters, keyword: e.target.value })}
        className="px-3 py-2 text-sm border border-border-default rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-primary w-64"
      />

      {/* 레벨 필터 */}
      <select
        value={filters.level}
        onChange={(e) => onFiltersChange({ ...filters, level: e.target.value as ErrorLevel | '' })}
        className="px-3 py-2 text-sm border border-border-default rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-primary"
        aria-label="에러 레벨 필터"
      >
        <option value="">전체 레벨</option>
        <option value="ERROR">ERROR</option>
        <option value="WARN">WARN</option>
      </select>

      {/* 서버 필터 */}
      <select
        value={filters.serverName}
        onChange={(e) => onFiltersChange({ ...filters, serverName: e.target.value })}
        className="px-3 py-2 text-sm border border-border-default rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-primary"
        aria-label="서버 필터"
      >
        <option value="">전체 서버</option>
        <option value="user_back">user_back</option>
        <option value="admin_back">admin_back</option>
      </select>
    </div>
  );
}

export type { ErrorLogFilters };
