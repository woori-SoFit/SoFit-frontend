/**
 * 알림 관련 타입 정의
 */

/** 알림 타입 */
export type NotificationType =
  | "LOAN_SUBMITTED"
  | "LOAN_DECIDED"
  | "LOAN_EXECUTED";

/** 알림 항목 */
export interface NotificationItem {
  notificationId: number;
  type: NotificationType;
  title: string;
  message: string;
  referenceId: number;
  referenceLabel: string;
  isRead: boolean;
  createdAt: string;
}

/** 알림 목록 API 응답 */
export interface NotificationsResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    notifications: NotificationItem[];
  };
}
