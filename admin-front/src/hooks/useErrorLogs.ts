import { useQuery } from '@tanstack/react-query';
import { ERROR_LOG_KEYS } from '@/constants/queryKeys';
import { fetchErrorLogs } from '@/api/errorLogApi';
import type { ErrorLogListParams, PaginatedErrorLogResponse } from '@/types/errorLog';

export interface UseErrorLogsReturn {
  data: PaginatedErrorLogResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * 에러 로그 목록을 페이징으로 조회하는 커스텀 훅.
 * 파라미터가 변경되면 자동으로 재조회한다.
 */
export function useErrorLogs(params: ErrorLogListParams): UseErrorLogsReturn {
  const { data, isLoading, isError, error, refetch } = useQuery<PaginatedErrorLogResponse, Error>({
    queryKey: [...ERROR_LOG_KEYS.list(), params],
    queryFn: () => fetchErrorLogs(params),
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
