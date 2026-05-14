/**
 * StepLayout — 다단계 흐름(신청, 회원가입 등)용 레이아웃
 *
 * - 상단: 뒤로가기 + 타이틀(layoutStore) + 홈 아이콘
 * - 하단 탭바 없음
 * - 앱 컨테이너 적용
 *
 * 타이틀은 각 페이지에서 useLayoutStore.setStepTitle()로 설정
 */
import { Outlet, useNavigate, Link } from "react-router-dom";
import { ChevronLeft, House } from "lucide-react";
import { useLayoutStore } from "@/stores/layoutStore";

export function StepLayout() {
  const navigate = useNavigate();
  const title = useLayoutStore((s) => s.stepTitle);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="app-container flex flex-col min-h-screen">
      {/* 상단 헤더 */}
      <header className="sticky top-0 z-50">
        <div className="flex items-center px-2 h-16 relative">
          {/* 뒤로가기 */}
          <button
            type="button"
            onClick={handleBack}
            aria-label="뒤로가기"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors z-10"
          >
            <ChevronLeft size={26} className="text-gray-700" />
          </button>

          {/* 타이틀 — 중앙 고정 */}
          {title && (
            <h1 className="absolute inset-0 flex items-center justify-center text-base font-semibold text-text-primary pointer-events-none pt-1">
              {title}
            </h1>
          )}

          {/* 홈 */}
          <Link
            to="/"
            aria-label="홈으로"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors ml-auto z-10"
          >
            <House size={22} className="text-gray-700" />
          </Link>
        </div>
      </header>

      {/* 콘텐츠 */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
