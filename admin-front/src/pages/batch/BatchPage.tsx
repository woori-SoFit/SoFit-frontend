import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useBatchList } from '@/hooks/useBatchList';
import { triggerManualBatch } from '@/api/batchApi';
import { BATCH_KEYS } from '@/constants/queryKeys';
import BatchTable from '@/components/batch/BatchTable';
import BatchScheduleCard from '@/components/batch/BatchScheduleCard';
import LoanDecisionScheduleCard from '@/components/batch/LoanDecisionScheduleCard';
import LoadingState from '@/components/common/LoadingState';
import ErrorState from '@/components/common/ErrorState';
import Pagination from '@/components/common/Pagination';
import type { BatchType } from '@/types/batch';

const PAGE_SIZE = 5;

const BATCH_TABS: { value: BatchType; label: string }[] = [
  { value: 'S_GRADE', label: 'S등급 산출' },
  { value: 'SYSTEM_REVIEW', label: '시스템 심사' },
];

/**
 * 배치 관리 페이지 — DEV_ADMIN 전용
 * 탭: S등급 산출 / 시스템 심사
 */
export default function BatchPage() {
  const [batchType, setBatchType] = useState<BatchType>('S_GRADE');
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useBatchList({
    page,
    size: PAGE_SIZE,
    batchType,
  });

  const manualBatch = useMutation({
    mutationFn: () => triggerManualBatch(batchType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BATCH_KEYS.all });
    },
  });

  const handleTabChange = (type: BatchType) => {
    setBatchType(type);
    setPage(1);
    manualBatch.reset();
  };

  return (
    <div className="flex flex-col h-full p-6">
      {/* 헤더 + 탭 + 수동 실행 버튼 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-text-primary">배치 관리</h1>
          <span className="text-sm text-text-secondary">—</span>
          <div className="flex items-center border-b border-border-default">
            {BATCH_TABS.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => handleTabChange(tab.value)}
                className={`px-4 py-2 text-sm font-medium transition-all border-b-2 -mb-px ${
                  batchType === tab.value
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-secondary hover:text-text-primary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            if (manualBatch.isSuccess) {
              manualBatch.reset();
            } else {
              manualBatch.mutate();
            }
          }}
          disabled={manualBatch.isPending}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
            manualBatch.isSuccess
              ? 'bg-success text-white'
              : 'bg-primary text-white hover:bg-primary-dark'
          }`}
        >
          {manualBatch.isPending ? '실행 중...' : manualBatch.isSuccess ? '완료' : '수동 실행'}
        </button>
      </div>

      {/* 자동 배치 현황 카드 */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-base font-semibold text-text-primary">자동 배치 현황</h2>
        </div>
        {isLoading ? (
          <div className="flex gap-4">
            <div className="flex-1 h-40 bg-gray-50 rounded-lg animate-pulse" />
          </div>
        ) : (
          <div className="flex gap-4">
            {batchType === 'S_GRADE' ? (
              <BatchScheduleCard latestBatch={data?.batches[0] ?? null} />
            ) : (
              <LoanDecisionScheduleCard latestBatch={data?.batches[0] ?? null} />
            )}
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
