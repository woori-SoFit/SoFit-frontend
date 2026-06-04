/**
 * 알림 도메인 API 함수
 */
import axiosInstance from "./axiosInstance";
import type { NotificationsResponse } from "@/types/notification";

/** 공통 API 응답 래퍼 (void 결과용) */
interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

/** 알림 목록 조회 */
export async function fetchNotifications(): Promise<NotificationsResponse> {
  const res = await axiosInstance.get<NotificationsResponse>("/notifications");
  return res.data;
}

/** 알림 읽음 처리 */
export async function markNotificationAsRead(
  notificationId: number
): Promise<ApiResponse<void>> {
  const res = await axiosInstance.patch<ApiResponse<void>>(
    `/notifications/${notificationId}/read`
  );
  return res.data;
}
