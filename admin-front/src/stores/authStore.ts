import { create } from "zustand";
import type { AuthUser } from "@/types";

interface AuthState {
  /** 로그인된 사용자 (null이면 미인증) */
  user: AuthUser | null;
  /** 로그인 성공 시 사용자 정보 저장 */
  login: (user: AuthUser) => void;
  /** 로그아웃 시 상태 초기화 */
  logout: () => void;
}

/**
 * 인증 상태 스토어
 *
 * - 세션 기반 인증이므로 persist 사용하지 않음
 * - 로그인 API 응답 또는 /auth/me 응답으로 user 설정
 * - 로그아웃 또는 401 시 user를 null로 초기화
 */
export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
