/**
 * 알림 유형별 아이콘 + 배경색 매핑 유틸
 */
import { FileCheck, FileText, Megaphone } from "lucide-react";
import type { NotificationType } from "@/mocks/notifications";

interface NotificationIconConfig {
  icon: React.ReactNode;
  bg: string;
}

export function getNotificationIcon(type: NotificationType): NotificationIconConfig {
  switch (type) {
    case "LOAN_REVIEWED":
      return {
        icon: <FileCheck size={22} className="text-primary" />,
        bg: "bg-primary/10",
      };
    case "LOAN_APPLIED":
      return {
        icon: <FileText size={22} className="text-primary" />,
        bg: "bg-primary/10",
      };
    case "LOAN_EXECUTED":
      return {
        icon: <Megaphone size={22} className="text-green-600" />,
        bg: "bg-green-100",
      };
  }
}
