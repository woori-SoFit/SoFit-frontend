import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { postLogin } from "@/api/authApi";
import type { LoginRequest, LoginResponse } from "@/types/auth";

interface UseLoginOptions {
  onSuccess?: () => void;
  onError?: (error: AxiosError) => void;
}

/**
 * 로그인 API 호출을 위한 커스텀 훅
 * React Query useMutation을 사용하여 postLogin을 호출합니다.
 */
export function useLogin(options?: UseLoginOptions) {
  return useMutation<LoginResponse, AxiosError, LoginRequest>({
    mutationFn: postLogin,
    onSuccess: () => {
      options?.onSuccess?.();
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
}
