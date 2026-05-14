/**
 * StepLayout — 다단계 흐름(신청, 회원가입 등)용 레이아웃
 *
 * - 상단: 뒤로가기 + 타이틀 + 진행 바
 * - 하단 탭바 없음
 * - 앱 컨테이너 적용
 */
import { Outlet, useNavigate, Link } from "react-router-dom";
import { ChevronLeft, House } from "lucide-react";

interface StepLayoutProps {
  title?: string;
  currentStep?: number;
  totalSteps?: number;
  onBack?: () => void;
}

export function StepLayout({ title, currentStep, totalSteps, onBack }: StepLayoutProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const progress =
    currentStep && totalSteps ? (currentStep / totalSteps) * 100 : null;

  return (
    <div className="app-container flex flex-col min-h-screen">
      {/* 상단 헤더 */}
      <header className="sticky top-0 z-50">
        <div className="flex items-center px-2 h-16 gap-3">
          {/* 뒤로가기 */}
          <button
            type="button"
            onClick={handleBack}
            aria-label="뒤로가기"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
          >
            <ChevronLeft size={26} className="text-gray-700" />
          </button>

          {/* 타이틀 */}
          {title && (
            <h1 className="flex-1 text-base font-semibold text-[--color-text-primary] truncate">
              {title}
            </h1>
          )}

          {/* 홈 */}
          <Link
            to="/"
            aria-label="홈으로"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors ml-auto"
          >
            <House size={22} className="text-gray-700" />
          </Link>
        </div>

        {/* 진행 바 */}
        {progress !== null && (
          <div className="h-0.5 bg-gray-100">
            <div
              className="h-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </header>

      {/* 콘텐츠 */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
