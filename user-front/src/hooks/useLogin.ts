import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { postLogin } from "@/api/authApi";
import { AUTH_KEYS } from "@/constants/queryKeys";
import type { LoginRequest, LoginResponse } from "@/types/auth";

interface UseLoginOptions {
  onSuccess?: () => void;
  onError?: (error: AxiosError) => void;
}

/**
 * 로그인 API 호출을 위한 커스텀 훅
 * React Query useMutation을 사용하여 postLogin을 호출합니다.
 * 로그인 성공 시 인증 상태 쿼리를 invalidate하여 헤더 UI를 갱신합니다.
 */
export function useLogin(options?: UseLoginOptions) {
  const queryClient = useQueryClient();

  return useMutation<LoginResponse, AxiosError, LoginRequest>({
    mutationFn: postLogin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.me });
      options?.onSuccess?.();
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
}
