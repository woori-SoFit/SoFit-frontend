import { useState } from 'react';
import { useUserList } from '@/hooks/useUserList';
import { useUserStatistics } from '@/hooks/useUserStatistics';
import { buildUserListParams } from '@/utils/userUtils';
import type { UserFilters } from '@/types/user';

import StatisticsCards from '@/components/user-management/StatisticsCards';
import SearchFilter from '@/components/user-management/SearchFilter';
import UserTable from '@/components/user-management/UserTable';
import LoadingState from '@/components/common/LoadingState';
import ErrorState from '@/components/common/ErrorState';

const PAGE_SIZE = 8;

/**
 * 사용자 관리 페이지 컴포넌트.
 */
export default function UserManagementPage() {
  const [filters, setFilters] = useState<UserFilters>({
    keyword: '',
    role: '',
    status: '',
  });
  const [page, setPage] = useState(0);

  const params = buildUserListParams('all', filters, page + 1, PAGE_SIZE);

  const { data: userData, isLoading, isError, refetch } = useUserList(params);
  const {
    data: statsData,
    isLoading: statsLoading,
    isError: statsError,
    refetch: statsRefetch,
  } = useUserStatistics();

  const handleFiltersChange = (newFilters: UserFilters) => {
    setFilters(newFilters);
    setPage(0);
  };

  return (
    <div className="flex flex-col h-full p-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-text-primary">고객 관리</h1>
          {!isLoading && userData && (
            <span className="text-sm text-text-secondary">
              총 {userData.totalCount}명
            </span>
          )}
        </div>

        {/* 필터 (오른쪽) */}
        <SearchFilter
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />
      </div>

      {/* 통계 카드 */}
      <div className="mb-6">
        <StatisticsCards
          data={statsData}
          isLoading={statsLoading}
          isError={statsError}
          onRetry={statsRefetch}
        />
      </div>

      {/* 로딩 상태 */}
      {isLoading && <LoadingState />}

      {/* 에러 상태 */}
      {isError && <ErrorState onRetry={() => refetch()} />}

      {/* 테이블 */}
      {!isLoading && !isError && userData && (
        <div className="flex-1">
          <UserTable
            data={userData.users}
            totalCount={userData.totalCount}
            currentPage={page + 1}
            pageSize={PAGE_SIZE}
          />
        </div>
      )}

      {/* 페이지네이션 (하단 고정) */}
      {!isLoading && !isError && userData && userData.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4 mt-auto">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-3 py-1.5 text-sm border border-border-default rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            이전
          </button>
          <span className="text-sm text-text-secondary">
            {page + 1} / {userData.totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(userData.totalPages - 1, p + 1))}
            disabled={page >= userData.totalPages - 1}
            className="px-3 py-1.5 text-sm border border-border-default rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}
