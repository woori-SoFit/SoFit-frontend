import { useQuery } from "@tanstack/react-query";
import { fetchAuthMe } from "@/api/authApi";
import { useAuthStore } from "@/stores/authStore";
import { AUTH_KEYS } from "@/constants/queryKeys";
import type { AdminRole, AuthUser } from "@/types";

/**
 * 현재 로그인한 사용자 정보를 조회하는 커스텀 훅.
 *
 * - GET /api/admin/auth/me를 React Query로 호출
 * - 성공 시 Zustand 스토어에 동기화
 * - Zustand에 user가 이미 있으면 API 호출 생략 (로그인 직후)
 * - 세션 만료 시 isAuthenticated = false
 */
export function useAuthMe() {
  const login = useAuthStore((s) => s.login);
  const storeUser = useAuthStore((s) => s.user);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: AUTH_KEYS.me,
    queryFn: async () => {
      const result = await fetchAuthMe();
      const user: AuthUser = {
        name: result.name,
        loginId: result.loginId,
        phoneNumber: result.phoneNumber,
        role: result.role as AdminRole,
      };
      login(user);
      return user;
    },
    // Zustand에 user가 이미 있으면 API 호출 생략 (로그인 직후)
    enabled: !storeUser,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5분
  });

  const user = data ?? storeUser ?? undefined;

  return {
    data: user,
    isLoading: !storeUser && isLoading,
    isAuthenticated: !!user,
    isError: !storeUser && isError,
    error,
  };
}
