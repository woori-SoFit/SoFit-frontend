/**
 * 세션 만료 상태 관리 (Zustand)
 *
 * 401 응답 시 세션 만료 모달을 띄우기 위한 전역 상태
 */
import { create } from "zustand";

interface SessionState {
  /** 세션 만료 여부 */
  isSessionExpired: boolean;
  /** 세션 만료 처리 — 모달 표시 */
  setSessionExpired: () => void;
  /** 상태 초기화 — 로그인 페이지 이동 후 */
  resetSession: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  isSessionExpired: false,
  setSessionExpired: () => set({ isSessionExpired: true }),
  resetSession: () => set({ isSessionExpired: false }),
}));
