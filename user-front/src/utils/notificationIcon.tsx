/**
 * 알림 유형별 아이콘 + 배경색 매핑 유틸
 */
import { Bell, FileCheck, FileText, Megaphone } from "lucide-react";
import type { NotificationType } from "@/types/notification";

export interface NotificationIconConfig {
  icon: React.ReactNode;
  bg: string;
}

export function getNotificationIcon(type: string): NotificationIconConfig {
  switch (type as NotificationType) {
    case "LOAN_SUBMITTED":
      return {
        icon: <FileText size={22} className="text-primary" />,
        bg: "bg-primary/10",
      };
    case "LOAN_DECIDED":
      return {
        icon: <FileCheck size={22} className="text-primary" />,
        bg: "bg-primary/10",
      };
    case "LOAN_EXECUTED":
      return {
        icon: <Megaphone size={22} className="text-green-600" />,
        bg: "bg-green-100",
      };
    default:
      return {
        icon: <Bell size={22} className="text-gray-500" />,
        bg: "bg-gray-100",
      };
  }
}
