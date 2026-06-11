import { useQuery } from '@tanstack/react-query';
import { LOAN_KEYS } from '@/constants/queryKeys';
import type { MyBizData } from '@/types';
import { MOCK_MY_BIZ_DATA } from '@/mocks/myBizData';

/**
 * My Biz Data 탭 데이터를 조회하는 커스텀 훅.
 * TODO: API 연동 후 fetchMyBizData로 교체
 *
 * @param id 대출 신청 ID
 * @param enabled 탭이 활성화되었을 때만 조회
 */
export function useMyBizData(id: number, enabled: boolean) {
  const { data, isLoading, isError, error, refetch } = useQuery<MyBizData, Error>({
    queryKey: LOAN_KEYS.myBizData(id),
    queryFn: () => Promise.resolve(MOCK_MY_BIZ_DATA),
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
