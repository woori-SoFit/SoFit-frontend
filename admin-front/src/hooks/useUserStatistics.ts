import { useQuery } from '@tanstack/react-query';
import { USER_KEYS } from '@/constants/queryKeys';
import { fetchUserStatistics } from '@/api/userApi';
import type { UserStatistics } from '@/types/user';

export interface UseUserStatisticsReturn {
  data: UserStatistics | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

/**
 * 사용자 통계 데이터를 조회하는 커스텀 훅.
 * 전체/관리자/은행원/고객/비활성 사용자 수를 반환합니다.
 */
export function useUserStatistics(): UseUserStatisticsReturn {
  const { data, isLoading, isError, refetch } = useQuery<UserStatistics, Error>({
    queryKey: USER_KEYS.statistics(),
    queryFn: fetchUserStatistics,
    staleTime: 30_000,
  });

  return {
    data,
    isLoading,
    isError,
    refetch,
  };
}
