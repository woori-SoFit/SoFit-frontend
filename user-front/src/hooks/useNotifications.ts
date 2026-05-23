import { useQuery } from "@tanstack/react-query";
import { MYPAGE_KEYS } from "@/constants/queryKeys";
import { fetchNotifications } from "@/api/mypageApi";
import type { NotificationItem } from "@/types/mypage";

/**
 * 알림 목록을 조회하는 훅
 *
 * @returns data - 알림 목록 (NotificationItem[] | undefined)
 * @returns isLoading - 로딩 상태
 * @returns isError - 에러 발생 여부
 */
export function useNotifications(): {
  data: NotificationItem[] | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const { data, isLoading, isError } = useQuery({
    queryKey: MYPAGE_KEYS.notifications(),
    queryFn: fetchNotifications,
  });

  return {
    data: data?.result,
    isLoading,
    isError,
  };
}
