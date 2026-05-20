import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AdminRole } from "@/types";

export const AUTH_STORE_KEY = "sofit-admin-auth";

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

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: AUTH_STORE_KEY,
    }
  )
);
