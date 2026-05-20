import { useAuthStore, type MockUser } from "@/stores/authStore";

export interface AuthMeResponse {
  id: number;
  name: string;
  role: MockUser["role"];
}

/**
 * 현재 로그인한 사용자 정보를 조회하는 커스텀 훅.
 *
 * [Mock 모드] API 연동 전까지 Zustand 스토어에서 사용자 정보를 읽는다.
 * TODO: API 연동 시 React Query 기반으로 전환
 */
export function useAuthMe() {
  const user = useAuthStore((s) => s.user);

  return {
    data: user ?? undefined,
    isLoading: false,
    isError: !user,
    error: user ? null : new Error("미인증 상태"),
  };
}
