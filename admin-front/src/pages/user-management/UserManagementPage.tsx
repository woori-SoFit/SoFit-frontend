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
import Pagination from '@/components/common/Pagination';

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
  const [page, setPage] = useState(1);

  const params = buildUserListParams('all', filters, page, PAGE_SIZE);

  const { data: userData, isLoading, isError, refetch } = useUserList(params);
  const {
    data: statsData,
    isLoading: statsLoading,
    isError: statsError,
    refetch: statsRefetch,
  } = useUserStatistics();

  const handleFiltersChange = (newFilters: UserFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  return (
    <div className="flex flex-col h-full p-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-text-primary">계정 관리</h1>
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
            currentPage={page}
            pageSize={PAGE_SIZE}
          />
        </div>
      )}

      {/* 페이지네이션 (하단 고정) */}
      {!isLoading && !isError && userData && (
        <Pagination
          currentPage={page}
          totalPages={userData.totalPages}
          onPageChange={setPage}
          className="mt-auto"
        />
      )}
    </div>
  );
}
