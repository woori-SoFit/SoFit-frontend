import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { NOTIFICATION_KEYS } from "@/constants/queryKeys";
import { fetchNotifications } from "@/api/notificationApi";
import { useNotificationStore } from "@/stores/notificationStore";
import { useMe } from "@/hooks/useMe";

/**
 * 미읽음 알림 개수를 조회하고 store에 반영하는 훅
 *
 * - 로그인 상태에서만 API 호출 (비로그인 시 쿼리 비활성화)
 * - 앱 진입 시 fetchNotifications() 응답에서 isRead === false 항목 개수를 계산
 * - notificationStore.setUnreadCount()로 초기값 설정
 * - 에러 시 unreadCount를 0으로 설정
 * - 로딩 중에는 store를 업데이트하지 않음 (뱃지 미표시)
 *
 * @returns unreadCount - 미읽음 알림 개수
 * @returns isLoading - 로딩 상태
 */
export function useUnreadCount(): {
  unreadCount: number;
  isLoading: boolean;
} {
  const { isLoggedIn } = useMe();
  const { unreadCount, setUnreadCount } = useNotificationStore();

  const { data, isLoading, isError } = useQuery({
    queryKey: NOTIFICATION_KEYS.all,
    queryFn: fetchNotifications,
    enabled: isLoggedIn,
  });

  useEffect(() => {
    if (isLoading) return;

    if (isError || !data) {
      setUnreadCount(0);
      return;
    }

    const notifications = data.result?.notifications;
    if (!Array.isArray(notifications)) {
      setUnreadCount(0);
      return;
    }

    const count = notifications.filter((item) => item.isRead === false).length;
    setUnreadCount(count);
  }, [data, isLoading, isError, setUnreadCount]);

  return {
    unreadCount,
    isLoading,
  };
}
