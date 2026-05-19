/**
 * 인증 도메인 타입 정의
 */

/** 로그인 요청 */
export interface LoginRequest {
  loginId: string;
  password: string;
}

/** 로그인 사용자 정보 */
export interface LoginUser {
  userId: number;
  loginId: string;
  name: string;
  role: string;
}

/** 로그인 응답 */
export interface LoginResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: LoginUser;
}
