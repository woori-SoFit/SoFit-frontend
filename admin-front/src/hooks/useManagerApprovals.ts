import { useQuery } from '@tanstack/react-query';
import { LOAN_KEYS } from '@/constants/queryKeys';
import { fetchManagerApprovals } from '@/api/loanDetailApi';
import type { ManagerApprovalItem } from '@/types';

export interface UseManagerApprovalsReturn {
  data: ManagerApprovalItem[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * 지점장 결재 대기 목록(MANAGER_REVIEW 상태)을 조회하는 커스텀 훅.
 * 신청일 기준 내림차순으로 정렬된 목록을 반환합니다.
 */
export function useManagerApprovals(): UseManagerApprovalsReturn {
  const { data, isLoading, isError, error, refetch } = useQuery<ManagerApprovalItem[], Error>({
    queryKey: LOAN_KEYS.managerApprovals(),
    queryFn: fetchManagerApprovals,
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
