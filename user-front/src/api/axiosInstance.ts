import axios, { type AxiosError } from "axios";

/**
 * 공통 Axios 인스턴스
 *
 * - baseURL: 환경변수 VITE_API_BASE_URL
 * - withCredentials: true — Session-Cookie 기반 인증 필수 설정
 */
const axiosInstance = axios.create({
  // baseURL: "/api",
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 응답 인터셉터: 공통 에러 처리
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // 로그인 요청 401은 리다이렉트 X
      const requestUrl = error.config?.url ?? "";
      if (requestUrl !== "/auth/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
