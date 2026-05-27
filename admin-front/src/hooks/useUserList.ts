import { useQuery } from '@tanstack/react-query';
import { USER_KEYS } from '@/constants/queryKeys';
import { fetchUsers } from '@/api/userApi';
import type { UserListParams, PaginatedUserResponse } from '@/types/user';

export interface UseUserListReturn {
  data: PaginatedUserResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * 사용자 목록을 페이징으로 조회하는 커스텀 훅.
 * 파라미터가 변경되면 자동으로 재조회합니다.
 */
export function useUserList(params: UserListParams): UseUserListReturn {
  const { data, isLoading, isError, error, refetch } = useQuery<PaginatedUserResponse, Error>({
    queryKey: [...USER_KEYS.list(), params],
    queryFn: () => fetchUsers(params),
    staleTime: 30_000,
    retry: 3,
  });

  return {
    data,
    isLoading,
    isError,
    error: error ?? null,
    refetch,
  };
}
