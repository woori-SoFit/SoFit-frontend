import { useQuery } from '@tanstack/react-query';
import { BATCH_KEYS } from '@/constants/queryKeys';
import { fetchBatchLatest } from '@/api/batchApi';
import type { BatchLatestInfo } from '@/types/batch';

/**
 * 배치 주기별 최신 실행 정보를 조회하는 커스텀 훅.
 * 페이지 진입 시 1회 호출, 페이징과 무관하게 캐싱된다.
 */
export function useBatchLatest() {
  const { data, isLoading, isError } = useQuery<BatchLatestInfo[], Error>({
    queryKey: BATCH_KEYS.latest(),
    queryFn: fetchBatchLatest,
    staleTime: 60_000,
    retry: 3,
  });

  return { data, isLoading, isError };
}
