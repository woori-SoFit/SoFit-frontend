/**
 * AppHeader — 앱 상단 헤더
 *
 * 비로그인: 로그인 버튼만 표시
 * 로그인:   알림 아이콘 + 마이페이지 아이콘 표시
 */
import { Link } from "react-router-dom";
// TODO: 백엔드 연결 후 아래 주석 해제
// import { useQuery } from "@tanstack/react-query";
// import axiosInstance from "@/api/axiosInstance";
// import { AUTH_KEYS } from "@/constants/queryKeys";
import { Bell, UserCircle } from "lucide-react";
import mainLogo from "@/assets/mainLogo.svg";

// TODO: 백엔드 연결 후 아래 함수 사용
// function fetchMe() {
//   return axiosInstance.get("/members/me").then((res) => res.data);
// }

export function AppHeader() {
  // TODO: 백엔드 연결 후 아래 useQuery 주석 해제 후 isLoggedIn 교체
  // const { data: me, isLoading } = useQuery({
  //   queryKey: AUTH_KEYS.me,
  //   queryFn: fetchMe,
  //   retry: false,
  //   staleTime: 1000 * 60,
  // });
  // const isLoggedIn = !isLoading && !!me;

  const isLoggedIn = false; // 임시: 백엔드 연결 전까지 비로그인 고정

  return (
    <header className="sticky top-0 z-50 w-full bg-bg-base">
      <div className="flex items-center justify-between px-4 h-16">
        {/* 로고 */}
        <Link to="/" className="flex items-center">
          <img src={mainLogo} alt="SoFit" className="h-6" />
        </Link>

        {/* 우측 액션 */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              {/* 알림 */}
              <Link
                to="/mypage/notifications"
                aria-label="알림"
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-text-primary"
              >
                <Bell size={20} />
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
              className="px-3.5 py-1.5 flex items-center rounded-md bg-white border border-border-default text-xs font-medium text-text-primary hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
