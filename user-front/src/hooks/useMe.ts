import { useQuery } from "@tanstack/react-query";
import { AUTH_KEYS } from "@/constants/queryKeys";
import { fetchMe } from "@/api/authApi";

/**
 * 현재 로그인 사용자 정보를 조회하는 훅
 *
 * 백엔드는 항상 200을 반환하며 code로 상태를 구분:
 * - USER2001: 로그인됨 (result에 사용자 정보)
 * - USER2000: 비로그인 (result: null)
 *
 * structuralSharing: true (기본값)로 데이터가 동일하면 리렌더 방지.
 * staleTime: 5분 — 로그인 직후 setQueryData로 설정한 값이 불필요하게
 * 즉시 refetch되어 덮어씌워지는 것을 방지합니다.
 */
export function useMe() {
  const { data, isLoading } = useQuery({
    queryKey: AUTH_KEYS.me,
    queryFn: fetchMe,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    retryDelay: 500,
  });

  const isLoggedIn = !isLoading && data?.code === "USER2001" && !!data.result;

  return {
    me: data?.result ?? null,
    isLoading,
    isLoggedIn,
  };
}
