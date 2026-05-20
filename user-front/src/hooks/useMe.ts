import { useQuery } from "@tanstack/react-query";
import { AUTH_KEYS } from "@/constants/queryKeys";
import { fetchMe } from "@/api/authApi";

/**
 * 현재 로그인 사용자 정보를 조회하는 훅
 *
 * 백엔드는 항상 200을 반환하며 code로 상태를 구분:
 * - USER2001: 로그인됨 (result에 사용자 정보)
 * - USER2000: 비로그인 (result: null)
 */
export function useMe() {
  const { data, isLoading } = useQuery({
    queryKey: AUTH_KEYS.me,
    queryFn: fetchMe,
    staleTime: 1000 * 60,
  });

  const isLoggedIn = !isLoading && data?.code === "USER2001" && !!data.result;

  return {
    me: data?.result ?? null,
    isLoading,
    isLoggedIn,
  };
}
