import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

interface PageHeaderProps {
  title: string;
  onBack?: () => void;
}

/**
 * PageHeader — 뒤로가기 버튼 + 타이틀(중앙 배치)을 표시하는 재사용 가능한 헤더
 *
 * StepLayout과 동일한 패턴 (ChevronLeft + 타이틀 중앙 고정)
 * onBack 미지정 시 navigate(-1) 호출
 */
export function PageHeader({ title, onBack }: PageHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white px-2 h-14">
      <div className="flex items-center h-full relative">
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
        <h1 className="absolute inset-0 flex items-center justify-center text-base font-semibold text-text-primary pointer-events-none">
          {title}
        </h1>
      </div>
    </header>
  );
}
