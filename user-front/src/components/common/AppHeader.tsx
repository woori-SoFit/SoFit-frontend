/**
 * AppHeader — 앱 상단 헤더
 *
 * 비로그인: 로그인 버튼만 표시
 * 로그인:   알림 아이콘 + 마이페이지 아이콘 표시
 *
 * visible prop으로 show/hide 애니메이션 제어
 */
import { Link } from "react-router-dom";
import { useMe } from "@/hooks/useMe";
import { Bell, ChevronRight, UserCircle } from "lucide-react";
import mainLogo from "@/assets/mainLogo.svg";
import { useNotificationStore } from "@/stores/notificationStore";

interface AppHeaderProps {
  /** 헤더 표시 여부 (기본: true) */
  visible?: boolean;
}

export function AppHeader({ visible = true }: AppHeaderProps) {
  const { isLoggedIn } = useMe();
  const unreadCount = useNotificationStore((s) => s.unreadCount);

  return (
    <header
      className={`absolute top-0 left-0 right-0 z-50 w-full bg-transparent transition-transform duration-300 ease-in-out ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="flex items-center justify-between px-4 h-14">
        {/* 로고 */}
        <Link to="/" className="flex items-center">
          <img src={mainLogo} alt="SoFit" width={72} height={40} />
        </Link>

        {/* 우측 액션 */}
        <div className="flex items-center gap-1 pt-1">
          {isLoggedIn ? (
            <>
              {/* 알림 */}
              <Link
                to="/notifications"
                aria-label="알림"
                className="relative w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-text-primary"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Link>

              {/* 마이페이지 */}
              <Link
                to="/mypage"
                aria-label="마이페이지"
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-text-primary"
              >
                <UserCircle size={20} />
              </Link>
            </>
          ) : (
            /* 비로그인: 로그인 버튼만 */
            <Link
              to="/login"
              className="flex items-center text-xs font-medium text-text-primary hover:text-primary"
            >
              로그인<ChevronRight size={18} />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
