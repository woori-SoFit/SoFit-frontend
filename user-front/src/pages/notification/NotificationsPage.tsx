/**
 * 알림 목록 페이지
 * Route: /notifications
 * Layout: StepLayout
 */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useLayoutStore } from "@/stores/layoutStore";
import { EmptyError } from "@/components/common/EmptyError";
import { CharacterLoadingSpinner } from "@/components/common/CharacterLoadingSpinner";
import { useNotifications } from "@/hooks/useNotifications";
import { useMarkAsRead } from "@/hooks/useMarkAsRead";
import { getNotificationIcon } from "@/utils/notificationIcon";
import type { NotificationItem as NotificationItemType } from "@/types/notification";

/** 알림 타입별 이동 경로 매핑 */
function getNotificationRoute(notification: NotificationItemType): string | null {
  switch (notification.type) {
    case "LOAN_SUBMITTED":
      return `/loan-applications`;
    case "LOAN_DECIDED":
      return `/loan-applications`;
    case "LOAN_EXECUTED":
      return `/loan/execution/${notification.referenceId}`;
    default:
      return null;
  }
}

function NotificationItemRow({
  notification,
  onClickItem,
  isPending,
}: {
  notification: NotificationItemType;
  onClickItem: (notification: NotificationItemType) => void;
  isPending: boolean;
}) {
  const { icon, bg } = getNotificationIcon(notification.type);

  return (
    <button
      type="button"
      onClick={() => onClickItem(notification)}
      disabled={isPending}
      className="flex items-center gap-4 rounded-lg mb-2 px-5 py-5 bg-white border-b border-gray-100 last:border-b-0 w-full text-left hover:bg-gray-50 transition-colors disabled:opacity-50"
    >
      {/* 아이콘 */}
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${bg}`}>
        {icon}
      </div>

      {/* 내용 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-bold text-gray-900 truncate">
            {notification.title}
          </span>
          {!notification.isRead && (
            <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
          )}
        </div>
        {notification.referenceLabel && (
          <span className="mt-1 inline-block text-xs font-medium text-primary bg-primary/10 rounded px-1.5 py-0.5">
            {notification.referenceLabel}
          </span>
        )}
        <p className="mt-0.5 text-sm text-gray-500 truncate">
          {notification.message}
        </p>
      </div>

      {/* 화살표 */}
      <ChevronRight size={18} className="text-gray-400 shrink-0" />
    </button>
  );
}

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { data: notifications, isLoading, isError } = useNotifications();
  const { markAsRead, isPending, errorMessage } = useMarkAsRead();

  useEffect(() => {
    useLayoutStore.getState().setStepTitle("알림");
    useLayoutStore.getState().setOnBack(null);
  }, []);

  /** 알림 클릭: 읽음 처리 + 페이지 이동 */
  const handleClickNotification = (notification: NotificationItemType) => {
    // 미읽음이면 읽음 처리
    if (!notification.isRead) {
      markAsRead(notification.notificationId);
    }

    // 알림 타입에 따라 페이지 이동
    const route = getNotificationRoute(notification);
    if (route) {
      navigate(route);
    }
  };

  // 로딩 상태
  if (isLoading) {
    return <CharacterLoadingSpinner text="알림을 불러오는 중..." />;
  }

  // 에러 상태
  if (isError) {
    return <EmptyError message="알림을 불러오지 못했습니다" />;
  }

  return (
    <div className="bg-gray-50" data-testid="notifications-page">
      {/* 에러 토스트 */}
      {errorMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 rounded-lg bg-red-500 px-4 py-2 text-sm text-white shadow-lg">
          {errorMessage}
        </div>
      )}

      {!notifications || notifications.length === 0 ? (
        <div className="flex items-center justify-center h-[calc(100dvh-56px)]">
          <EmptyError
            message="알림이 없습니다"
            buttonLabel="홈으로 가기"
            navigateTo="/"
          />
        </div>
      ) : (
        <div className="divide-y divide-gray-100 px-5">
          {notifications.map((notification) => (
            <NotificationItemRow
              key={notification.notificationId}
              notification={notification}
              onClickItem={handleClickNotification}
              isPending={isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}
