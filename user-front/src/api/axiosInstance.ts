import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { useSessionStore } from "@/stores/sessionStore";

/**
 * 공통 Axios 인스턴스
 *
 * - baseURL: 환경변수 VITE_API_BASE_URL
 * - withCredentials: true — Session-Cookie 기반 인증 필수 설정
 */
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- CSRF 토큰 관리 ---
let csrfToken: string | null = null;
let csrfFetchPromise: Promise<string> | null = null;

/** Spring CsrfToken 응답 형식 */
interface CsrfTokenResponse {
  headerName: string;
  parameterName: string;
  token: string;
}

/** GET /api/csrf-token 으로 CSRF 토큰 발급 */
async function fetchCsrfToken(): Promise<string> {
  const res = await axios.get<CsrfTokenResponse>(
    `${import.meta.env.VITE_API_BASE_URL}/csrf-token`,
    { withCredentials: true }
  );
  // Spring CsrfToken 객체 또는 래핑된 응답 모두 대응
  const data = res.data;
  csrfToken = data.token ?? (data as unknown as { result: CsrfTokenResponse }).result?.token ?? "";
  return csrfToken;
}

/** CSRF 토큰을 가져온다 (캐시된 값 우선, 없으면 발급) */
async function getCsrfToken(): Promise<string> {
  if (csrfToken) return csrfToken;
  // 동시 요청 시 중복 호출 방지
  if (!csrfFetchPromise) {
    csrfFetchPromise = fetchCsrfToken().finally(() => {
      csrfFetchPromise = null;
    });
  }
  return csrfFetchPromise;
}

/** CSRF 토큰 초기화 (로그아웃, 세션 만료 시 호출) */
export function resetCsrfToken(): void {
  csrfToken = null;
}

// 요청 인터셉터: 상태 변경 메서드(POST, PUT, PATCH, DELETE)에 X-CSRF-TOKEN 헤더 추가
const CSRF_METHODS = ["post", "put", "patch", "delete"];

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const method = config.method?.toLowerCase() ?? "";
    if (CSRF_METHODS.includes(method)) {
      try {
        const token = await getCsrfToken();
        config.headers.set("X-CSRF-TOKEN", token);
      } catch {
        // CSRF 토큰 발급 실패 시에도 요청은 계속 진행 (로그아웃 등)
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 공통 에러 처리
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      const requestUrl = error.config?.url ?? "";
      // 로그인/me 요청은 세션 만료 모달 대상에서 제외
      const noModalPaths = ["/auth/login", "/users/me", "/report/mybiz-status"];
      if (!noModalPaths.includes(requestUrl)) {
        // 이전에 로그인한 적이 있을 때만 세션 만료 모달 표시
        const wasLoggedIn = sessionStorage.getItem("wasLoggedIn");
        if (wasLoggedIn) {
          sessionStorage.removeItem("wasLoggedIn");
          useSessionStore.getState().setSessionExpired();
        }
      }
      // 세션 만료 시 CSRF 토큰도 초기화
      resetCsrfToken();
    }
    // 403 + CSRF 토큰 만료 시 토큰 갱신 후 재시도
    if (error.response?.status === 403) {
      resetCsrfToken();
      const originalRequest = error.config;
      if (originalRequest && !originalRequest._csrfRetry) {
        originalRequest._csrfRetry = true;
        const newToken = await getCsrfToken();
        originalRequest.headers.set("X-CSRF-TOKEN", newToken);
        return axiosInstance(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
