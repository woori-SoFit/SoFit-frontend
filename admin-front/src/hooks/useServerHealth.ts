import { useQuery } from '@tanstack/react-query';
import { SERVER_HEALTH_KEYS } from '@/constants/queryKeys';
import { fetchServerHealth } from '@/api/serverHealthApi';
import type { ServerHealthData } from '@/types/serverHealth';

export interface UseServerHealthReturn {
  data: ServerHealthData | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
  isFetching: boolean;
  dataUpdatedAt: number;
  failureCount: number;
}

/**
 * 서버 상태 데이터를 조회하는 커스텀 훅.
 * - staleTime: 30초
 * - gcTime: 5분
 * - refetchInterval: 30초 (자동 새로고침)
 */
export function useServerHealth(): UseServerHealthReturn {
  const { data, isLoading, isError, error, refetch, isFetching, dataUpdatedAt, failureCount } =
    useQuery<ServerHealthData, Error>({
      queryKey: SERVER_HEALTH_KEYS.status(),
      queryFn: fetchServerHealth,
      staleTime: 30_000,
      gcTime: 300_000,
      refetchInterval: 30_000,
    });

  return {
    data,
    isLoading,
    isError,
    error: error ?? null,
    refetch,
    isFetching,
    dataUpdatedAt,
    failureCount,
  };
}
