import { useQuery } from '@tanstack/react-query';
import { LOAN_KEYS } from '@/constants/queryKeys';
import { fetchLoanApplications } from '@/api/loanApi';
import type { LoanApplicationListRequest, LoanApplicationListResponse } from '@/types/loan';

export interface UseLoanApplicationsReturn {
  data: LoanApplicationListResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * 대출 신청 목록을 페이징으로 조회하는 커스텀 훅.
 * 파라미터가 변경되면 자동으로 재조회합니다.
 */
export function useLoanApplications(params: LoanApplicationListRequest): UseLoanApplicationsReturn {
  const { data, isLoading, isError, error, refetch } = useQuery<LoanApplicationListResponse, Error>({
    queryKey: [...LOAN_KEYS.applications(), params],
    queryFn: () => fetchLoanApplications(params),
    staleTime: 30_000,
  });

  return {
    data,
    isLoading,
    isError,
    error: error ?? null,
    refetch,
  };
}
