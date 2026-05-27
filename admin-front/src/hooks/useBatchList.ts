import { useQuery } from '@tanstack/react-query';
import { BATCH_KEYS } from '@/constants/queryKeys';
import { fetchBatchList } from '@/api/batchApi';
import type { BatchListParams, PaginatedBatchResponse } from '@/types/batch';

export interface UseBatchListReturn {
  data: PaginatedBatchResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * S등급 배치 실행 이력을 페이징으로 조회하는 커스텀 훅.
 */
export function useBatchList(params: BatchListParams): UseBatchListReturn {
  const { data, isLoading, isError, error, refetch } = useQuery<PaginatedBatchResponse, Error>({
    queryKey: [...BATCH_KEYS.list(), params],
    queryFn: () => fetchBatchList(params),
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
