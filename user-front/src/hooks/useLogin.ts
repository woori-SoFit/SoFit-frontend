import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { postLogin } from "@/api/authApi";
import { AUTH_KEYS } from "@/constants/queryKeys";
import type { LoginRequest, LoginResponse, MeResponse } from "@/types/auth";

interface UseLoginOptions {
  onSuccess?: () => void;
  onError?: (error: AxiosError) => void;
}

/**
 * 로그인 API 호출을 위한 커스텀 훅
 *
 * 로그인 성공 시:
 * 1. 로그인 응답의 사용자 정보를 me 쿼리 캐시에 즉시 반영 → UI 즉시 갱신
 * 2. 짧은 지연 후 refetch하여 서버 세션 쿠키 기반 검증 동기화
 *
 * 배포 환경에서 Set-Cookie 후 바로 요청하면 쿠키가 안 붙는 타이밍 이슈를 방지합니다.
 */
export function useLogin(options?: UseLoginOptions) {
  const queryClient = useQueryClient();

  return useMutation<LoginResponse, AxiosError, LoginRequest>({
    mutationFn: postLogin,
    onSuccess: (data) => {
      // 로그인 응답에 사용자 정보가 있으면 me 쿼리 캐시에 즉시 설정
      if (data.isSuccess && data.result) {
        const meData: MeResponse = {
          isSuccess: true,
          code: "USER2001",
          message: "로그인 사용자 정보 조회 성공",
          result: data.result,
        };
        queryClient.setQueryData(AUTH_KEYS.me, meData);
      }
      // 세션 쿠키가 브라우저에 안정적으로 설정된 후 백그라운드 검증
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: AUTH_KEYS.me });
      }, 500);
      options?.onSuccess?.();
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
}
