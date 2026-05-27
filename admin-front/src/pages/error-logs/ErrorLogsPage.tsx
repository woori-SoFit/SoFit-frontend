import { useState } from 'react';
import { useErrorLogs } from '@/hooks/useErrorLogs';
import ErrorLogFilter from '@/components/error-logs/ErrorLogFilter';
import type { ErrorLogFilters } from '@/components/error-logs/ErrorLogFilter';
import ErrorLogTable from '@/components/error-logs/ErrorLogTable';
import LoadingState from '@/components/common/LoadingState';
import ErrorState from '@/components/common/ErrorState';
import Pagination from '@/components/common/Pagination';
import type { ErrorLogListParams } from '@/types/errorLog';

const PAGE_SIZE = 10;

/**
 * 에러 로그 페이지 — DEV_ADMIN 전용
 */
export default function ErrorLogsPage() {
  const [filters, setFilters] = useState<ErrorLogFilters>({
    keyword: '',
    level: '',
    serverName: '',
  });
  const [page, setPage] = useState(1);

  const params: ErrorLogListParams = {
    page,
    size: PAGE_SIZE,
    ...(filters.level && { level: filters.level }),
    ...(filters.serverName && { serverName: filters.serverName }),
    ...(filters.keyword && { keyword: filters.keyword }),
  };

  const { data, isLoading, isError, refetch } = useErrorLogs(params);

  const handleFiltersChange = (newFilters: ErrorLogFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  return (
    <div className="flex flex-col h-full p-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-text-primary">에러 로그</h1>
          {!isLoading && data && (
            <span className="text-sm text-text-secondary">
              총 {data.totalCount}건
            </span>
          )}
        </div>

        {/* 필터 */}
        <ErrorLogFilter filters={filters} onFiltersChange={handleFiltersChange} />
      </div>

      {/* 로딩 상태 */}
      {isLoading && <LoadingState />}

      {/* 에러 상태 */}
      {isError && <ErrorState onRetry={() => refetch()} />}

      {/* 테이블 */}
      {!isLoading && !isError && data && (
        <div className="flex-1">
          <ErrorLogTable data={data.errors} />
        </div>
      )}

      {/* 페이지네이션 */}
      {!isLoading && !isError && data && data.totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={data.totalPages}
          onPageChange={setPage}
          className="mt-auto"
        />
      )}
    </div>
  );
}
