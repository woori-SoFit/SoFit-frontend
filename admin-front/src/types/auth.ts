import type { AdminRole } from "./index";

/** 로그인 요청 */
export interface LoginRequest {
  loginId: string;
  password: string;
}

/** 로그인 응답 (result 필드 내부) */
export interface LoginResponse {
  userId: number;
  name: string;
  role: AdminRole;
}

/** /auth/me 응답 */
export interface AuthMeResponse {
  userId?: number;
  name: string;
  loginId: string;
  phoneNumber: string;
  role: AdminRole;
}

/** Zustand 스토어 및 앱 내부에서 사용하는 인증 사용자 타입 */
export interface AuthUser {
  userId?: number;
  name: string;
  loginId?: string;
  phoneNumber?: string;
  role: AdminRole;
}
