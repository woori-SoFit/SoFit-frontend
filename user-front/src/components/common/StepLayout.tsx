/**
 * StepLayout — 다단계 흐름(신청, 회원가입 등)용 레이아웃
 *
 * - 상단: 뒤로가기 + 타이틀(layoutStore) + 홈 아이콘
 * - 하단 탭바 없음
 * - 앱 컨테이너 적용
 *
 * overlayHeader = true일 때:
 *   헤더가 height:0으로 축소되어 레이아웃 공간을 차지하지 않음.
 *   뒤로가기/홈 버튼은 페이지 컴포넌트가 직접 absolute로 렌더링해야 함.
 *   (콘텐츠가 화면 최상단부터 시작 → 투명 헤더 효과)
 *
 * 타이틀은 각 페이지에서 useLayoutStore.setStepTitle()로 설정
 */
import { Outlet, useNavigate } from "react-router-dom";
import { ChevronLeft, House } from "lucide-react";
import { useLayoutStore } from "@/stores/layoutStore";

export function StepLayout() {
  const navigate = useNavigate();
  const title = useLayoutStore((s) => s.stepTitle);
  const onBack = useLayoutStore((s) => s.onBack);
  const onHome = useLayoutStore((s) => s.onHome);
  const overlayHeader = useLayoutStore((s) => s.overlayHeader);

  const handleBack = () => {
    if (onBack) onBack();
    else navigate(-1);
  };

  const handleHome = () => {
    if (onHome) onHome();
    else navigate("/");
  };

  return (
    <div className="app-container flex flex-col min-h-screen">
      {/* 상단 헤더
          overlayHeader = true → height:0으로 레이아웃에서 제거 (콘텐츠가 최상단부터 시작)
          overlayHeader = false → 일반 sticky 헤더
      */}
      {!overlayHeader && (
        <header className="sticky top-0 z-50 bg-bg-base">
          <div className="flex items-center px-2 h-14 relative">
            {/* 뒤로가기 */}
            <button
              type="button"
              onClick={handleBack}
              aria-label="뒤로가기"
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors z-10"
            >
              <ChevronLeft size={26} className="text-gray-700" />
            </button>

            {/* 타이틀 */}
            {title && (
              <h1 className="absolute inset-0 flex items-center justify-center text-base font-semibold text-text-primary pointer-events-none pt-1">
                {title}
              </h1>
            )}

            {/* 홈 */}
            <button
              type="button"
              onClick={handleHome}
              aria-label="홈으로"
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors ml-auto z-10"
            >
              <House size={22} className="text-gray-700" />
            </button>
          </div>
        </header>
      )}

      {/* 콘텐츠 */}
      <main className="flex-1 overflow-y-auto scrollbar-none">
        <Outlet />
      </main>
    </div>
  );
}
