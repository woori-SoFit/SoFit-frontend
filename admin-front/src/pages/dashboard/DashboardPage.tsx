import { useState } from 'react';
import { useLoanApplications } from '@/hooks/useLoanApplications';
import { useAuthMe } from '@/hooks/useAuthMe';
import { ApplicationTable } from '@/components/dashboard/ApplicationTable';
import type { ReviewStatus } from '@/types';

const PAGE_SIZE = 10;

const STATUS_OPTIONS: { value: ReviewStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: '전체' },
  { value: 'UNDER_REVIEW', label: '심사 중' },
  { value: 'MANAGER_REVIEW', label: '추가 심사 중' },
  { value: 'APPROVED', label: '승인 완료' },
  { value: 'REJECTED', label: '거절 완료' },
];

export default function DashboardPage() {
  const { data: authUser } = useAuthMe();
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState<ReviewStatus | 'ALL'>('ALL');
  const [onlyMine, setOnlyMine] = useState(false);

  const currentUserName = authUser?.name ?? '';

  const { data, isLoading, isError, refetch } = useLoanApplications({
    page,
    size: PAGE_SIZE,
    status: statusFilter === 'ALL' ? undefined : statusFilter,
    assigneeName: onlyMine ? currentUserName : undefined,
  });

  const handleStatusChange = (value: string) => {
    setStatusFilter(value as ReviewStatus | 'ALL');
    setPage(0);
  };

  const handleOnlyMineChange = (checked: boolean) => {
    setOnlyMine(checked);
    setPage(0);
  };

  return (
    <div className="p-6">
      {/* 헤더: 제목 + 건수 (왼쪽) / 필터 (오른쪽) */}
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

        {/* 필터 영역 (오른쪽) */}
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

          <select
            value={statusFilter}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="px-3 py-2 text-sm border border-border-default rounded-md bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-border-focus"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm text-text-secondary">
            데이터를 불러오는 중입니다
          </p>
        </div>
      )}

      {/* 에러 상태 */}
      {isError && (
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-sm text-text-secondary mb-4">
            데이터를 불러오는 중 오류가 발생했습니다.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90"
          >
            다시 시도
          </button>
        </div>
      )}

      {/* 테이블 */}
      {!isLoading && !isError && data && (
        <div className="min-h-[540px]">
          <ApplicationTable applications={data.applications} />
        </div>
      )}

      {/* 페이지네이션 (하단 고정) */}
      {!isLoading && !isError && data && data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-3 py-1.5 text-sm border border-border-default rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            이전
          </button>
          <span className="text-sm text-text-secondary">
            {page + 1} / {data.totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(data.totalPages - 1, p + 1))}
            disabled={page >= data.totalPages - 1}
            className="px-3 py-1.5 text-sm border border-border-default rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}
