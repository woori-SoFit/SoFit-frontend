import { useQuery } from '@tanstack/react-query';
import { LOAN_KEYS } from '@/constants/queryKeys';
import { fetchLoanStatusCounts } from '@/api/loanApi';
import type { LoanStatusCounts } from '@/types';

/**
 * 대출 신청 상태별 건수를 조회하는 커스텀 훅.
 */
export function useLoanStatusCounts() {
  const { data, isLoading, isError } = useQuery<LoanStatusCounts>({
    queryKey: LOAN_KEYS.statusCounts(),
    queryFn: fetchLoanStatusCounts,
    staleTime: 30_000,
  });

  return { data, isLoading, isError };
}
