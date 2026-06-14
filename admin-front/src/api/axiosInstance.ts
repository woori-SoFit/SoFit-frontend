import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

/**
 * 공통 Axios 인스턴스
 *
 * - baseURL: 환경변수 VITE_API_BASE_URL
 * - withCredentials: true — Session-Cookie 기반 인증 필수 설정
 */
const axiosInstance = axios.create({
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  // 배열 파라미터를 status=A&status=B 형태로 직렬화 (Spring Boot 호환)
  paramsSerializer: {
    indexes: null,
  },
});

// --- CSRF 토큰 관리 ---
let csrfToken: string | null = null;
let csrfFetchPromise: Promise<string> | null = null;

/** GET /api/csrf-token 으로 CSRF 토큰 발급 */
async function fetchCsrfToken(): Promise<string> {
  const res = await axios.get<{ result: { token: string } }>("/api/csrf-token", {
    withCredentials: true,
  });
  csrfToken = res.data.result.token;
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

// 응답 인터셉터: 공통 래퍼 언래핑 + 에러 처리
axiosInstance.interceptors.response.use(
  (response) => {
    // 서버 공통 응답 형식: { isSuccess, code, message, result }
    // result만 꺼내서 반환
    const data = response.data;
    if (data && typeof data === 'object' && 'result' in data) {
      response.data = data.result;
    }
    return response;
  },
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // 세션 만료 또는 미인증 → 로그인 페이지로 리다이렉트
      resetCsrfToken();
      window.location.href = "/login";
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
