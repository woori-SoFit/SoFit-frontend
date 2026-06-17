import { useQuery } from '@tanstack/react-query';
import { BATCH_KEYS } from '@/constants/queryKeys';
import { fetchBatchList, fetchLoanDecisionBatchList } from '@/api/batchApi';
import type { BatchListParams, PaginatedBatchResponse } from '@/types/batch';

export interface UseBatchListReturn {
  data: PaginatedBatchResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * 배치 실행 이력을 페이징으로 조회하는 커스텀 훅.
 * batchType에 따라 S등급 또는 시스템 심사 API를 호출한다.
 */
export function useBatchList(params: BatchListParams): UseBatchListReturn {
  const fetchFn = params.batchType === 'SYSTEM_REVIEW'
    ? fetchLoanDecisionBatchList
    : fetchBatchList;

  const { data, isLoading, isError, error, refetch } = useQuery<PaginatedBatchResponse, Error>({
    queryKey: [...BATCH_KEYS.list(), params],
    queryFn: () => fetchFn(params),
    staleTime: 30_000,
    retry: 3,
  });

  return {
    data,
    isLoading,
    isError,
    error: error ?? null,
    refetch,
  };
}
