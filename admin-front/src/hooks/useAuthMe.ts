import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosInstance";
import { AUTH_KEYS } from "@/constants/queryKeys";
import { type AdminRole, isValidRole } from "@/types";

export interface AuthMeResponse {
  id: number;
  name: string;
  role: AdminRole;
}

/**
 * 현재 로그인한 사용자 정보를 조회하는 커스텀 훅.
 * GET /api/auth/me 호출 후 역할 유효성 검증을 수행한다.
 */
export function useAuthMe() {
  return useQuery<AuthMeResponse>({
    queryKey: AUTH_KEYS.me,
    queryFn: async (): Promise<AuthMeResponse> => {
      const { data } = await axiosInstance.get<AuthMeResponse>("/api/auth/me");

      if (!isValidRole(data.role)) {
        throw new Error(
          `유효하지 않은 역할입니다: ${String(data.role)}`
        );
      }

      return data;
    },
  });
}
