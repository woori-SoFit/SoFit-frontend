import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createSSEClient } from "@/api/sseClient";
import { useNotificationStore } from "@/stores/notificationStore";
import { NOTIFICATION_KEYS } from "@/constants/queryKeys";
import { useMe } from "@/hooks/useMe";
import type { NotificationItem, NotificationsResponse } from "@/types/notification";

/**
 * SSE 연결을 관리하는 훅
 *
 * - useMe()로 로그인 상태 확인
 * - 로그인 시 SSE 연결 수립, 로그아웃 시 연결 종료
 * - notification 이벤트 수신 시:
 *   1. 캐시에 즉시 추가 (새로고침 없이 UI 반영)
 *   2. notificationStore.incrementUnread()
 *   3. invalidateQueries로 서버와 동기화
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
      onNotification: (data: NotificationItem) => {
        console.log("[SSE] notification 이벤트 수신:", data);
        incrementUnread();

        const oldCache = queryClient.getQueryData(NOTIFICATION_KEYS.all);
        console.log("[SSE] setQueryData 전 캐시:", oldCache);

        // 캐시에 즉시 추가 → 새로고침 없이 바로 UI 반영
        queryClient.setQueryData<NotificationsResponse>(
          NOTIFICATION_KEYS.all,
          (old) => {
            if (!old) return old;
            return {
              ...old,
              result: {
                ...old.result,
                notifications: [data, ...(old.result?.notifications ?? [])],
              },
            };
          }
        );

        // 서버와 동기화는 별도로 하지 않음 — setQueryData로 즉시 UI 반영 후,
        // 다음 알림 페이지 진입 시 staleTime 만료로 자연스럽게 서버와 동기화됨
        const newCache = queryClient.getQueryData(NOTIFICATION_KEYS.all);
        console.log("[SSE] setQueryData 후 캐시:", newCache);
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
