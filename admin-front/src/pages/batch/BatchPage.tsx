import { useState } from 'react';
import { useBatchList } from '@/hooks/useBatchList';
import { useBatchLatest } from '@/hooks/useBatchLatest';
import BatchTable from '@/components/batch/BatchTable';
import BatchScheduleCard from '@/components/batch/BatchScheduleCard';
import LoadingState from '@/components/common/LoadingState';
import ErrorState from '@/components/common/ErrorState';
import Pagination from '@/components/common/Pagination';

const PAGE_SIZE = 5;

/**
 * S등급 배치 관리 페이지 — DEV_ADMIN 전용
 * 상단: 자동 배치 현황 (일단위 / 월단위) — latest API
 * 하단: 배치 실행 이력 테이블 + 페이지네이션 — list API
 */
export default function BatchPage() {
  const [page, setPage] = useState(1);

  const { data: latestData, isLoading: latestLoading } = useBatchLatest();
  const { data, isLoading, isError, refetch } = useBatchList({
    page,
    size: PAGE_SIZE,
  });

  return (
    <div className="flex flex-col h-full p-6">
      {/* 헤더 */}
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-text-primary">S등급 배치 관리</h1>
      </div>

      {/* 자동 배치 현황 카드 */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-base font-semibold text-text-primary">자동 배치 현황</h2>
        </div>
        {latestLoading ? (
          <div className="flex gap-4">
            <div className="flex-1 h-40 bg-gray-50 rounded-lg animate-pulse" />
            <div className="flex-1 h-40 bg-gray-50 rounded-lg animate-pulse" />
          </div>
        ) : (
          <div className="flex gap-4">
            {latestData?.map((latest) => (
              <BatchScheduleCard key={latest.cycle} latest={latest} />
            ))}
          </div>
        )}
      </div>

      {/* 실행 이력 섹션 */}
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-base font-semibold text-text-primary">실행 이력</h2>
        {!isLoading && data && (
          <span className="text-sm text-text-secondary">
            총 {data.totalCount}건
          </span>
        )}
      </div>

      {/* 로딩 상태 */}
      {isLoading && <LoadingState />}

      {/* 에러 상태 */}
      {isError && <ErrorState onRetry={() => refetch()} />}

      {/* 테이블 */}
      {!isLoading && !isError && data && (
        <div className="flex-1">
          <BatchTable data={data.batches} />
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
