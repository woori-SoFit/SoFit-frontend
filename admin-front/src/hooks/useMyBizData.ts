import { useQuery } from '@tanstack/react-query';
import { LOAN_KEYS } from '@/constants/queryKeys';
import { fetchMyBizData } from '@/api/loanDetailApi';
import type { MyBizData } from '@/types';

/**
 * My Biz Data 탭 데이터를 조회하는 커스텀 훅.
 * GET /api/admin/loan-applications/{id}/mybiz-data
 *
 * @param id 대출 신청 ID
 * @param enabled 탭이 활성화되었을 때만 조회
 */
export function useMyBizData(id: number, enabled: boolean) {
  const { data, isLoading, isError, error, refetch } = useQuery<MyBizData, Error>({
    queryKey: LOAN_KEYS.myBizData(id),
    queryFn: () => fetchMyBizData(id),
    staleTime: 30_000,
    enabled: id > 0 && enabled,
  });

  return {
    data: data ?? null,
    isLoading,
    isError,
    error: error ?? null,
    refetch,
  };
}
