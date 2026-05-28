import { useState } from 'react';
import { useLoanApplications } from '@/hooks/useLoanApplications';
import type { StatusFilterValue } from '@/hooks/useLoanApplications';
import { useLoanStatusCounts } from '@/hooks/useLoanStatusCounts';
import { ApplicationTable } from '@/components/dashboard/ApplicationTable';
import LoadingState from '@/components/common/LoadingState';
import ErrorState from '@/components/common/ErrorState';
import Pagination from '@/components/common/Pagination';

const PAGE_SIZE = 10;

export default function DashboardPage() {
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>('ALL');
  const [onlyMine, setOnlyMine] = useState(false);

  const { data: statusCounts } = useLoanStatusCounts();

  const { data, isLoading, isError, refetch } = useLoanApplications({
    page,
    size: PAGE_SIZE,
    statusFilter,
    myOnly: onlyMine || undefined,
  });

  const handleStatusChange = (value: StatusFilterValue) => {
    setStatusFilter(value);
    setPage(0);
  };

  const handleOnlyMineChange = (checked: boolean) => {
    setOnlyMine(checked);
    setPage(0);
  };

  return (
    <div className="p-6">
      {/* 헤더: 제목 + 건수 (왼쪽) / 필터 뱃지 + 내 담당만 보기 (오른쪽) */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-text-primary">
            대출 신청 현황
          </h1>
          {!isLoading && data && (
            <span className="text-sm text-text-secondary">
              총 {data.totalCount}건
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-text-primary cursor-pointer">
            <input
              type="checkbox"
              checked={onlyMine}
              onChange={(e) => handleOnlyMineChange(e.target.checked)}
              className="w-4 h-4 rounded border-border-default text-primary focus:ring-primary/20"
            />
            내 담당만 보기
          </label>

          {statusCounts && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleStatusChange('ALL')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  statusFilter === 'ALL'
                    ? 'bg-gray-700 text-white'
                    : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                }`}
              >
                전체
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange('PENDING')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  statusFilter === 'PENDING'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                }`}
              >
                심사 대기 {statusCounts.pending}
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange('MANAGER_REVIEW')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  statusFilter === 'MANAGER_REVIEW'
                    ? 'bg-blue-500 text-white'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
              >
                추가 심사 {statusCounts.managerReview}
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange('APPROVED')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  statusFilter === 'APPROVED'
                    ? 'bg-green-500 text-white'
                    : 'bg-green-50 text-green-700 hover:bg-green-100'
                }`}
              >
                승인 {statusCounts.approved}
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange('REJECTED')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  statusFilter === 'REJECTED'
                    ? 'bg-red-500 text-white'
                    : 'bg-red-50 text-red-700 hover:bg-red-100'
                }`}
              >
                거절 {statusCounts.rejected}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 로딩 상태 */}
      {isLoading && <LoadingState />}

      {/* 에러 상태 */}
      {isError && <ErrorState onRetry={() => refetch()} />}

      {/* 테이블 */}
      {!isLoading && !isError && data && (
        <div className="min-h-[540px]">
          <ApplicationTable applications={data.contents} />
        </div>
      )}

      {/* 페이지네이션 (하단 고정) */}
      {!isLoading && !isError && data && (
        <Pagination
          currentPage={page + 1}
          totalPages={data.totalPages}
          onPageChange={(p) => setPage(p - 1)}
        />
      )}
    </div>
  );
}
