/**
 * 알림 목록 페이지
 * Route: /notifications
 * Layout: StepLayout
 */
import { useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { useLayoutStore } from "@/stores/layoutStore";
import { MOCK_NOTIFICATIONS, type MockNotification } from "@/mocks/notifications";
import { getNotificationIcon } from "@/utils/notificationIcon";

function NotificationItem({ notification }: { notification: MockNotification }) {
  const { icon, bg } = getNotificationIcon(notification.type);

  return (
    <div className="flex items-center gap-3 rounded-lg mb-2 px-5 py-5 bg-white border-b border-gray-100 last:border-b-0">
      {/* 아이콘 */}
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${bg}`}>
        {icon}
      </div>

      {/* 내용 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          {!notification.isRead && (
            <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
          )}
          <span className="text-sm font-bold text-gray-900 truncate">
            {notification.title}
          </span>
        </div>
        <p className="mt-0.5 text-sm text-gray-500 truncate">
          {notification.content}
        </p>
      </div>

      {/* 화살표 */}
      <ChevronRight size={18} className="text-gray-400 shrink-0" />
    </div>
  );
}

export default function NotificationsPage() {
  useEffect(() => {
    useLayoutStore.getState().setStepTitle("알림");
    useLayoutStore.getState().setOnBack(null);
  }, []);

  return (
    <div className="bg-gray-50 pt-5" data-testid="notifications-page">
      {MOCK_NOTIFICATIONS.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-500">알림이 없습니다</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100 px-5">
          {MOCK_NOTIFICATIONS.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </div>
      )}
    </div>
  );
}
