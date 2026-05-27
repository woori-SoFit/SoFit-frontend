import axios, { type AxiosError } from "axios";

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
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // 세션 만료 또는 미인증 → 로그인 페이지로 리다이렉트
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
