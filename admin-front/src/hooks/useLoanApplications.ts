import { useQuery } from '@tanstack/react-query';
import { LOAN_KEYS } from '@/constants/queryKeys';
import { fetchLoanApplications } from '@/api/loanApi';
import type { ReviewStatus, LoanApplicationListRequest, LoanApplicationListResponse } from '@/types/loan';

/** 필터 UI에서 사용하는 상태 타입 (ALL, PENDING, DECIDED는 UI 전용 가상 필터) */
export type StatusFilterValue = ReviewStatus | 'ALL' | 'PENDING' | 'DECIDED';

export interface UseLoanApplicationsParams {
  page: number;
  size: number;
  statusFilter: StatusFilterValue;
  myOnly?: boolean;
}

export interface UseLoanApplicationsReturn {
  data: LoanApplicationListResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * UI 필터 값을 API 요청 파라미터로 변환합니다.
 * - 'ALL': status 미지정 (전체 조회)
 * - 'PENDING': SYSTEM_APPROVED + SYSTEM_REJECTED (은행원 심사 대기 건)
 * - 'DECIDED': APPROVED + REJECTED (심사 완료 건)
 * - 그 외: 해당 상태 단건 필터
 */
function resolveStatusFilter(statusFilter: StatusFilterValue): ReviewStatus | ReviewStatus[] | undefined {
  if (statusFilter === 'ALL') return undefined;
  if (statusFilter === 'PENDING') return ['SYSTEM_APPROVED', 'SYSTEM_REJECTED'];
  if (statusFilter === 'DECIDED') return ['APPROVED', 'REJECTED'];
  return statusFilter;
}

/**
 * 대출 신청 목록을 페이징으로 조회하는 커스텀 훅.
 * UI 필터 값을 내부에서 API 파라미터로 변환하여 호출합니다.
 */
export function useLoanApplications(params: UseLoanApplicationsParams): UseLoanApplicationsReturn {
  const requestParams: LoanApplicationListRequest = {
    page: params.page,
    size: params.size,
    status: resolveStatusFilter(params.statusFilter),
    myOnly: params.myOnly || undefined,
  };

  const { data, isLoading, isError, error, refetch } = useQuery<LoanApplicationListResponse, Error>({
    queryKey: [...LOAN_KEYS.applications(), requestParams],
    queryFn: () => fetchLoanApplications(requestParams),
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
