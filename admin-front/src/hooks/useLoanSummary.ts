import { useQuery } from '@tanstack/react-query';
import { LOAN_KEYS } from '@/constants/queryKeys';
import { fetchLoanSummary } from '@/api/loanDetailApi';
import type { LoanSummary } from '@/types';

/**
 * 대출 신청 공통 정보(헤더용)를 조회하는 커스텀 훅.
 * GET /api/admin/loan-applications/{id} 응답에 대응합니다.
 */
export function useLoanSummary(id: number) {
  const { data, isLoading, isError, error, refetch } = useQuery<LoanSummary, Error>({
    queryKey: LOAN_KEYS.summary(id),
    queryFn: () => fetchLoanSummary(id),
    staleTime: 30_000,
    enabled: id > 0,
  });

  return {
    data,
    isLoading,
    isError,
    error: error ?? null,
    refetch,
  };
}
