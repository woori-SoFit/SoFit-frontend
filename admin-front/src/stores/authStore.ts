import { create } from "zustand";
import type { AdminRole } from "@/types";

export interface MockUser {
  id: number;
  name: string;
  role: AdminRole;
}

interface AuthState {
  /** mock 로그인된 사용자 (null이면 미인증) */
  user: MockUser | null;
  /** mock 로그인 */
  login: (user: MockUser) => void;
  /** mock 로그아웃 */
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
