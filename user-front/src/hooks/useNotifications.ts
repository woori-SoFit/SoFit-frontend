import { useQuery } from "@tanstack/react-query";
import { NOTIFICATION_KEYS } from "@/constants/queryKeys";
import { fetchNotifications } from "@/api/notificationApi";
import type { NotificationItem } from "@/types/notification";

/**
 * 알림 목록을 조회하는 훅
 *
 * @returns data - 알림 목록 (NotificationItem[] | undefined)
 * @returns isLoading - 로딩 상태
 * @returns isError - 에러 발생 여부
 * @returns refetch - 수동 재조회 함수
 */
export function useNotifications(): {
  data: NotificationItem[] | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
} {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: NOTIFICATION_KEYS.all,
    queryFn: fetchNotifications,
    structuralSharing: false,
    staleTime: Infinity,
  });

  return {
    data: data?.result?.notifications,
    isLoading,
    isError,
    refetch,
  };
}
