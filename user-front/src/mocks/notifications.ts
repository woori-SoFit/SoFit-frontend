/**
 * 알림 Mock 데이터
 *
 * TODO: API 연동 완료 후 이 파일 삭제
 */

export type NotificationType = "LOAN_APPLIED" | "LOAN_REVIEWED" | "LOAN_EXECUTED";

export interface MockNotification {
  id: number;
  type: NotificationType;
  title: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

export const MOCK_NOTIFICATIONS: MockNotification[] = [
  {
    id: 1,
    type: "LOAN_REVIEWED",
    title: "대출 심사 완료",
    content: "신청하신 대출 심사가 완료되었습니다.",
    createdAt: "2025-05-29T10:30:00",
    isRead: false,
  },
  {
    id: 2,
    type: "LOAN_APPLIED",
    title: "대출 신청 완료",
    content: "대출 신청이 정상적으로 접수되었습니다.",
    createdAt: "2025-05-28T14:20:00",
    isRead: false,
  },
  {
    id: 3,
    type: "LOAN_APPLIED",
    title: "대출 신청 완료",
    content: "대출 신청이 정상적으로 접수되었습니다.",
    createdAt: "2025-05-27T09:15:00",
    isRead: true,
  },
  {
    id: 4,
    type: "LOAN_EXECUTED",
    title: "대출 실행 완료",
    content: "대출이 정상적으로 실행되었습니다.",
    createdAt: "2025-05-25T16:00:00",
    isRead: true,
  },
];
