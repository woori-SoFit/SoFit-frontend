import axios, { type AxiosError } from "axios";

/**
 * 공통 Axios 인스턴스
 *
 * - baseURL: 환경변수 VITE_API_BASE_URL
 * - withCredentials: true — Session-Cookie 기반 인증 필수 설정
 */
const axiosInstance = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 응답 인터셉터: 공통 에러 처리
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const requestUrl = error.config?.url ?? "";
    if (error.response?.status === 401) {
      // /members/me는 인증 확인용이므로 리다이렉트하지 않음
      if (requestUrl.includes("/users/me")) {
        return Promise.reject(error);
      }
      // 그 외 401 → 로그인 페이지로 이동
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
