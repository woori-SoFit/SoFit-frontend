import { useQuery } from '@tanstack/react-query';
import { LOAN_KEYS } from '@/constants/queryKeys';
import { fetchSGradeTab } from '@/api/loanDetailApi';
import type { SGradeTabResponse } from '@/types';

/**
 * S등급 분석 탭 데이터를 조회하는 커스텀 훅.
 * GET /api/admin/loan-applications/{id}/grade
 *
 * @param id 대출 신청 ID
 * @param enabled 탭이 활성화되었을 때만 조회
 */
export function useSGradeTab(id: number, enabled: boolean) {
  const { data, isLoading, isError, error, refetch } = useQuery<SGradeTabResponse, Error>({
    queryKey: LOAN_KEYS.sGradeTab(id),
    queryFn: () => fetchSGradeTab(id),
    staleTime: 30_000,
    enabled: id > 0 && enabled,
  });

  return {
    data,
    isLoading,
    isError,
    error: error ?? null,
    refetch,
  };
}
