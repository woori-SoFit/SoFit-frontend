import axios, { type AxiosError } from "axios";
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

// 응답 인터셉터: 공통 에러 처리
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
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
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
