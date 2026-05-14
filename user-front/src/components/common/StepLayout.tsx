/**
 * StepLayout — 다단계 흐름(신청, 회원가입 등)용 레이아웃
 *
 * - 상단: 뒤로가기 + 타이틀 + 진행 바
 * - 하단 탭바 없음
 * - 앱 컨테이너 적용
 */
import { Outlet, useNavigate } from "react-router-dom";

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
    <div className="app-container flex flex-col min-h-screen bg-white">
      {/* 상단 헤더 */}
      <header className="sticky top-0 z-50 bg-white border-b border-[--color-border-default]">
        <div className="flex items-center px-4 h-14 gap-3">
          {/* 뒤로가기 */}
          <button
            type="button"
            onClick={handleBack}
            aria-label="뒤로가기"
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors -ml-1"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-700"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          {/* 타이틀 */}
          {title && (
            <h1 className="flex-1 text-base font-semibold text-[--color-text-primary] truncate">
              {title}
            </h1>
          )}
        </div>

        {/* 진행 바 */}
        {progress !== null && (
          <div className="h-0.5 bg-gray-100">
            <div
              className="h-full bg-[--color-primary] transition-all duration-300 ease-out"
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
