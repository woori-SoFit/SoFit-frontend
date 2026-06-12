import { useState } from 'react';
import { useLoanApplications } from '@/hooks/useLoanApplications';
import type { StatusFilterValue } from '@/hooks/useLoanApplications';
import { useAuthStore } from '@/stores/authStore';
import LoadingState from '@/components/common/LoadingState';
import ErrorState from '@/components/common/ErrorState';
import Pagination from '@/components/common/Pagination';
import { LoanListView } from '@/components/dashboard/LoanListView';

const PAGE_SIZE = 10;

type TabMode = 'mine' | 'all';

const STATUS_STEPS: { value: StatusFilterValue; label: string }[] = [
  { value: 'ALL', label: '전체' },
  { value: 'PENDING', label: '은행원 심사' },
  { value: 'MANAGER_REVIEW', label: '최종 심사' },
  { value: 'DECIDED', label: '승인/거절' },
  { value: 'EXECUTED', label: '실행 완료' },
];

/**
 * 대출 현황 페이지
 *
 * - 탭: 내 업무 / 전체 (지점장에게는 숨김)
 * - 상태 필터 (지점장은 기본 '최종 심사')
 * - 업무 컬럼 (심사하기, 결재하기, 조회)
 * - 페이지네이션
 */
export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const isManager = user?.role === 'ADMIN_BANK_MANAGER';

  const [page, setPage] = useState(0);
  const [tab, setTab] = useState<TabMode>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>(
    isManager ? 'MANAGER_REVIEW' : 'ALL'
  );

  const { data, isLoading, isError, refetch } = useLoanApplications({
    page,
    size: PAGE_SIZE,
    statusFilter,
    myOnly: tab === 'mine' || undefined,
  });

  const handleTabChange = (newTab: TabMode) => {
    setTab(newTab);
    setPage(0);
  };

  const handleStatusChange = (value: StatusFilterValue) => {
    setStatusFilter(value);
    setPage(0);
  };

  return (
    <div className="flex h-full flex-col p-6">
      {/* 상단: 제목 (왼쪽) + 필터 (오른쪽) */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-text-primary">대출 신청 현황</h1>
          {data && (
            <span className="text-sm text-text-secondary">총 {data.totalCount}건</span>
          )}
        </div>

        <div className="flex items-center gap-5">
          {/* 상태 — 미니 셰브론 스텝퍼 */}
          <div className="flex items-center">
            <span className="text-xs text-text-secondary font-semibold mr-3">상태</span>
            <div className="flex items-center">
              {STATUS_STEPS.map((step, index) => {
                const isActive = statusFilter === step.value;
                const isLast = index === STATUS_STEPS.length - 1;
                return (
                  <button
                    key={step.value}
                    type="button"
                    onClick={() => handleStatusChange(step.value)}
                    className={`
                      relative h-8 flex items-center px-4 text-xs font-medium
                      transition-all cursor-pointer whitespace-nowrap
                      ${index === 0 ? 'rounded-l-md' : ''}
                      ${isLast ? 'rounded-r-md' : ''}
                      ${isActive
                        ? 'bg-primary text-white'
                        : 'bg-gray-150 text-gray-500 hover:bg-gray-200'
                      }
                    `}
                    style={{
                      clipPath: isLast
                        ? undefined
                        : 'polygon(0% 0%, calc(100% - 6px) 0%, 100% 50%, calc(100% - 6px) 100%, 0% 100%)',
                      paddingRight: isLast ? '0.75rem' : '1.1rem',
                      marginRight: isLast ? 0 : -1,
                    }}
                  >
                    {step.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 담당자 — 탭 스타일 (지점장에게는 숨김) */}
          {!isManager && (
          <div className="flex items-center">
            <span className="text-xs text-text-secondary font-semibold mr-3">담당자</span>
            <div className="flex items-center bg-gray-150 rounded-md p-0.5">
              <button
                type="button"
                onClick={() => handleTabChange('mine')}
                className={`px-4 py-1.5 text-xs font-medium rounded transition-all ${
                  tab === 'mine'
                    ? 'bg-white text-text-primary'
                    : 'text-gray-500 hover:text-text-primary'
                }`}
              >
                나
              </button>
              <button
                type="button"
                onClick={() => handleTabChange('all')}
                className={`px-4 py-1.5 text-xs font-medium rounded transition-all ${
                  tab === 'all'
                    ? 'bg-white text-text-primary'
                    : 'text-gray-500 hover:text-text-primary'
                }`}
              >
                전체
              </button>
            </div>
          </div>
          )}
        </div>
      </div>

      {/* 로딩 */}
      {isLoading && <LoadingState />}

      {/* 에러 */}
      {isError && <ErrorState onRetry={() => refetch()} />}

      {/* 테이블 */}
      {!isLoading && !isError && data && (
        <div className="flex-1">
          <LoanListView
            applications={data.contents}
            statusFilter={statusFilter}
            onResetFilter={statusFilter !== 'ALL' ? () => handleStatusChange('ALL') : undefined}
          />
        </div>
      )}

      {/* 페이지네이션 — 하단 고정 */}
      {!isLoading && (
        <div className="mt-auto pt-4">
          <Pagination
            currentPage={page + 1}
            totalPages={data?.totalPages ?? 1}
            onPageChange={(p) => setPage(p - 1)}
          />
        </div>
      )}
    </div>
  );
}
