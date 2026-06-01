import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createSSEClient } from "@/api/sseClient";
import { useNotificationStore } from "@/stores/notificationStore";
import { NOTIFICATION_KEYS } from "@/constants/queryKeys";
import { useMe } from "@/hooks/useMe";

/**
 * SSE 연결을 관리하는 훅
 *
 * - useMe()로 로그인 상태 확인
 * - 로그인 시 SSE 연결 수립, 로그아웃 시 연결 종료
 * - notification 이벤트 수신 시 notificationStore.incrementUnread() + queryClient.invalidateQueries
 * - notificationStore.setConnectionStatus()로 연결 상태 반영
 */
export function useSSE(): void {
  const { isLoggedIn } = useMe();
  const queryClient = useQueryClient();
  const { incrementUnread, setConnectionStatus } = useNotificationStore();
  const disconnectRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      // 로그아웃 상태: 기존 연결 종료
      if (disconnectRef.current) {
        disconnectRef.current();
        disconnectRef.current = null;
      }
      setConnectionStatus("disconnected");
      return;
    }

    // 로그인 상태: SSE 연결 수립
    const sseClient = createSSEClient({
      url: "/api/notifications/subscribe",
      onConnect: () => {
        setConnectionStatus("connected");
      },
      onNotification: () => {
        incrementUnread();
        queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
      },
      onError: () => {
        setConnectionStatus("failed");
      },
    });

    sseClient.connect();
    disconnectRef.current = sseClient.disconnect;

    // cleanup: 컴포넌트 언마운트 또는 의존성 변경 시 연결 종료
    return () => {
      sseClient.disconnect();
      disconnectRef.current = null;
      setConnectionStatus("disconnected");
    };
  }, [isLoggedIn, queryClient, incrementUnread, setConnectionStatus]);
}
