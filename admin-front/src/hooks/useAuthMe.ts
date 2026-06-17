import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAuthMe } from "@/api/authApi";
import { useAuthStore } from "@/stores/authStore";
import { AUTH_KEYS } from "@/constants/queryKeys";
import type { AuthUser } from "@/types";

/**
 * 현재 로그인한 사용자 정보를 조회하는 커스텀 훅.
 *
 * - GET /api/admin/auth/me를 React Query로 호출
 * - 성공 시 useEffect로 Zustand 스토어에 동기화
 * - Zustand에 user가 이미 있으면 API 호출 생략 (로그인 직후)
 * - 세션 만료 시 isAuthenticated = false
 */
export function useAuthMe() {
  const login = useAuthStore((s) => s.login);
  const storeUser = useAuthStore((s) => s.user);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: AUTH_KEYS.me,
    queryFn: fetchAuthMe,
    // Zustand에 user가 이미 있으면 API 호출 생략 (로그인 직후)
    enabled: !storeUser,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5분
  });

  // /auth/me 응답 데이터 변경 시 Zustand 동기화
  useEffect(() => {
    if (data) {
      const user: AuthUser = {
        userId: data.userId,
        name: data.name,
        loginId: data.loginId,
        phoneNumber: data.phoneNumber,
        role: data.role,
      };
      login(user);
    }
  }, [data, login]);

  const user: AuthUser | undefined = storeUser ?? (data ? {
    userId: data.userId,
    name: data.name,
    loginId: data.loginId,
    phoneNumber: data.phoneNumber,
    role: data.role,
  } : undefined);

  return {
    data: user,
    isLoading: !storeUser && isLoading,
    isAuthenticated: !!user,
    isError: !storeUser && isError,
    error,
  };
}
