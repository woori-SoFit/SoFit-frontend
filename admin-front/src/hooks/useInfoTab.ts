import { useQuery } from '@tanstack/react-query';
import { LOAN_KEYS } from '@/constants/queryKeys';
import { fetchInfoTab } from '@/api/loanDetailApi';
import type { LoanInfoTabResponse } from '@/types';

export interface UseInfoTabReturn {
  data: LoanInfoTabResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * 정보 탭 데이터를 조회하는 커스텀 훅.
 * GET /api/admin/loan-applications/{id}/info
 * - staleTime 30초
 * - 404 응답 시 retry 하지 않음, 그 외 오류는 최대 3회 retry
 */
export function useInfoTab(id: number): UseInfoTabReturn {
  const { data, isLoading, isError, error, refetch } = useQuery<LoanInfoTabResponse, Error>({
    queryKey: LOAN_KEYS.detail(id),
    queryFn: () => fetchInfoTab(id),
    staleTime: 30_000,
    enabled: id > 0,
    retry: (failureCount, err) => {
      // 404 응답 시 retry 하지 않음
      if (
        err &&
        'response' in err &&
        (err as { response?: { status?: number } }).response?.status === 404
      ) {
        return false;
      }
      return failureCount < 3;
    },
  });

  return {
    data,
    isLoading,
    isError,
    error: error ?? null,
    refetch,
  };
}
