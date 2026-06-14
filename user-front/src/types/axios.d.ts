import "axios";

declare module "axios" {
  interface InternalAxiosRequestConfig {
    /** CSRF 토큰 갱신 후 재시도 여부 (무한 루프 방지) */
    _csrfRetry?: boolean;
  }
}
