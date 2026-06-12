import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createSSEClient } from "@/api/sseClient";
import { useNotificationStore } from "@/stores/notificationStore";
import { NOTIFICATION_KEYS, LOAN_KEYS } from "@/constants/queryKeys";
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
 *   3. 대출 상태 변경 알림(LOAN_DECIDED) 수신 시 대출 목록 invalidate
 * - notificationStore.setConnectionStatus()로 연결 상태 반영
 */
export function useSSE(): void {
  const { isLoggedIn } = useMe();
  const queryClient = useQueryClient();
  const disconnectRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      if (disconnectRef.current) {
        disconnectRef.current();
        disconnectRef.current = null;
      }
      useNotificationStore.getState().setConnectionStatus("disconnected");
      return;
    }

    const sseClient = createSSEClient({
      url: "/api/notifications/subscribe",
      onConnect: () => {
        useNotificationStore.getState().setConnectionStatus("connected");
      },
      onNotification: (data: NotificationItem) => {
        useNotificationStore.getState().incrementUnread();

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

        // 대출 심사 상태 변경 시 대출 진행 목록 갱신
        if (data.type === "LOAN_DECIDED") {
          queryClient.invalidateQueries({ queryKey: LOAN_KEYS.applicationsInProgress() });
          queryClient.invalidateQueries({ queryKey: LOAN_KEYS.applicationsCompleted() });
        }

        // 대출 실행 완료 시 대출 관리 목록 갱신
        if (data.type === "LOAN_EXECUTED") {
          queryClient.invalidateQueries({ queryKey: LOAN_KEYS.management() });
        }
      },
      onError: () => {
        useNotificationStore.getState().setConnectionStatus("failed");
      },
    });

    sseClient.connect();
    disconnectRef.current = sseClient.disconnect;

    return () => {
      sseClient.disconnect();
      disconnectRef.current = null;
      useNotificationStore.getState().setConnectionStatus("disconnected");
    };
  }, [isLoggedIn, queryClient]);
}
