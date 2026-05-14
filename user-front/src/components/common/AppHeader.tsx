/**
 * AppHeader — 앱 상단 헤더
 *
 */
import { Link } from "react-router-dom";
import mainLogo from "@/assets/mainLogo.svg";
import { Bell } from 'lucide-react';

export function AppHeader() {
  // TODO: useQuery로 로그인 상태 확인 → 로그인 시 버튼 대신 프로필 아이콘

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="flex items-center justify-between px-4 h-15">
        <Link to="/" className="flex items-center">
          <img src={mainLogo} alt="SoFit" className="h-6" />
        </Link>

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="알림"
            className="w-5 h-5 flex items-center justify-center hover:text-gray-700 transition-colors"
          >
            <Bell />
          </button>

          <Link
            to="/login"
            className="px-3.5 py-1.5 flex items-center rounded-md bg-white border border-border-default text-xs font-medium text-[--color-text-primary] hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            로그인
          </Link>
        </div>
      </div>
    </header>
  );
}
