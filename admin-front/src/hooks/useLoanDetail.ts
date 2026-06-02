import { useQuery } from '@tanstack/react-query';
import { LOAN_KEYS } from '@/constants/queryKeys';
import { fetchLoanDetail } from '@/api/loanDetailApi';
import type { LoanDetailData } from '@/types';

export interface UseLoanDetailReturn {
  data: LoanDetailData | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * 대출 신청 상세 데이터를 조회하는 커스텀 훅.
 * - staleTime 30초
 * - 404 응답 시 retry 하지 않음, 그 외 오류는 최대 3회 retry
 */
export function useLoanDetail(id: number): UseLoanDetailReturn {
  const { data, isLoading, isError, error, refetch } = useQuery<LoanDetailData | undefined, Error>({
    queryKey: LOAN_KEYS.detail(id),
    queryFn: () => fetchLoanDetail(id),
    staleTime: 30_000,
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
