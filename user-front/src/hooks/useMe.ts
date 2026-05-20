import { useQuery } from "@tanstack/react-query";
import { AUTH_KEYS } from "@/constants/queryKeys";
import { fetchMe } from "@/api/authApi";

/**
 * 현재 로그인 사용자 정보를 조회하는 훅
 * 세션이 유효하면 사용자 정보를 반환하고, 아니면 undefined
 */
export function useMe() {
  const { data, isLoading } = useQuery({
    queryKey: AUTH_KEYS.me,
    queryFn: fetchMe,
    retry: false,
    staleTime: 1000 * 60,
  });

  return {
    me: data ?? null,
    isLoading,
    isLoggedIn: !isLoading && !!data,
  };
}
