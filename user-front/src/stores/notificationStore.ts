/**
 * 알림 클라이언트 상태 관리 (Zustand)
 *
 * 미읽음 알림 개수와 SSE 연결 상태를 관리한다.
 * 서버 상태(알림 목록)는 React Query로 관리하고,
 * 클라이언트 상태(미읽음 개수, 연결 상태)만 이 스토어에서 관리한다.
 */
import { create } from "zustand";

interface NotificationState {
  /** 미읽음 알림 개수 */
  unreadCount: number;
  /** SSE 연결 상태 */
  connectionStatus: "connected" | "disconnected" | "reconnecting" | "failed";
  /** 미읽음 개수 설정 */
  setUnreadCount: (count: number) => void;
  /** 미읽음 개수 증가 */
  incrementUnread: () => void;
  /** 미읽음 개수 감소 (최솟값 0) */
  decrementUnread: () => void;
  /** SSE 연결 상태 설정 */
  setConnectionStatus: (
    status: NotificationState["connectionStatus"]
  ) => void;
  /** 상태 초기화 (로그아웃 시) */
  reset: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  unreadCount: 0,
  connectionStatus: "disconnected",
  setUnreadCount: (count) => set({ unreadCount: count }),
  incrementUnread: () =>
    set((state) => ({ unreadCount: state.unreadCount + 1 })),
  decrementUnread: () =>
    set((state) => ({ unreadCount: Math.max(0, state.unreadCount - 1) })),
  setConnectionStatus: (status) => set({ connectionStatus: status }),
  reset: () => set({ unreadCount: 0, connectionStatus: "disconnected" }),
}));
