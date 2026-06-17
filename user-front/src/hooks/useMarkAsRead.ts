import { useState, useCallback, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NOTIFICATION_KEYS } from "@/constants/queryKeys";
import { markNotificationAsRead } from "@/api/notificationApi";
import { useNotificationStore } from "@/stores/notificationStore";
import type {
  NotificationItem,
  NotificationsResponse,
} from "@/types/notification";

/**
 * 알림 읽음 처리 훅
 *
 * - useMutation으로 PATCH /notifications/{id}/read 호출
 * - 성공 시: 알림 목록 캐시 낙관적 업데이트 (isRead: true) + notificationStore.decrementUnread()
 * - 실패 시: 캐시 롤백 + 에러 토스트 3초 표시
 * - 타임아웃: 5초
 * - 이미 읽음 상태인 알림은 API 호출하지 않음
 */
export function useMarkAsRead(): {
  markAsRead: (notificationId: number) => void;
  isPending: boolean;
  errorMessage: string | null;
} {
  const queryClient = useQueryClient();
  const decrementUnread = useNotificationStore((s) => s.decrementUnread);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const mutation = useMutation({
    mutationFn: (notificationId: number) => {
      // 5초 타임아웃 설정
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      return markNotificationAsRead(notificationId).finally(() => {
        clearTimeout(timeoutId);
      });
    },
    onMutate: async (notificationId: number) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: NOTIFICATION_KEYS.all });

      // 이전 데이터 스냅샷 저장
      const previousData =
        queryClient.getQueryData<NotificationsResponse>(NOTIFICATION_KEYS.all);

      // 낙관적 업데이트: 해당 알림의 isRead를 true로 변경
      queryClient.setQueryData<NotificationsResponse>(
        NOTIFICATION_KEYS.all,
        (old) => {
          if (!old) return old;
          return {
            ...old,
            result: {
              ...old.result,
              notifications: old.result.notifications.map((item: NotificationItem) =>
                item.notificationId === notificationId ? { ...item, isRead: true } : item
              ),
            },
          };
        }
      );

      return { previousData };
    },
    onError: (_err, _notificationId, context) => {
      // 실패 시 캐시 롤백
      if (context?.previousData) {
        queryClient.setQueryData(NOTIFICATION_KEYS.all, context.previousData);
      }

      // 에러 토스트 3초 표시
      showErrorToast("알림 읽음 처리에 실패했습니다.");
    },
    onSuccess: () => {
      // 성공 시 미읽음 개수 감소
      decrementUnread();
    },
  });

  /** 에러 메시지를 3초간 표시 */
  const showErrorToast = useCallback((message: string) => {
    // 기존 타이머가 있으면 정리
    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current);
    }
    setErrorMessage(message);
    errorTimerRef.current = setTimeout(() => {
      setErrorMessage(null);
      errorTimerRef.current = null;
    }, 3000);
  }, []);

  /**
   * 알림 읽음 처리 실행
   * - 이미 읽음 상태인 알림은 API 호출하지 않음
   * - 진행 중인 요청이 있으면 추가 호출 무시
   */
  const markAsRead = useCallback(
    (notificationId: number) => {
      // 이미 읽음 상태인지 확인
      const cachedData =
        queryClient.getQueryData<NotificationsResponse>(NOTIFICATION_KEYS.all);
      const targetNotification = cachedData?.result?.notifications?.find(
        (item: NotificationItem) => item.notificationId === notificationId
      );

      // 이미 읽음 상태이면 API 호출하지 않음
      if (targetNotification?.isRead) {
        return;
      }

      // 진행 중인 요청이 있으면 무시
      if (mutation.isPending) {
        return;
      }

      mutation.mutate(notificationId);
    },
    [queryClient, mutation]
  );

  return {
    markAsRead,
    isPending: mutation.isPending,
    errorMessage,
  };
}
