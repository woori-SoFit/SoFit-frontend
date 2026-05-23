import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface PageHeaderProps {
  title: string;
  onBack?: () => void;
}

/**
 * PageHeader — 뒤로가기 버튼 + 타이틀을 표시하는 재사용 가능한 헤더
 *
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
    <header className="sticky top-0 z-40 flex items-center gap-3 bg-white px-4 h-14 border-b border-gray-200">
      <button
        type="button"
        onClick={handleBack}
        aria-label="뒤로가기"
        className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
      >
        <ArrowLeft size={20} className="text-text-primary" />
      </button>
      <h1 className="text-lg font-semibold text-text-primary">{title}</h1>
    </header>
  );
}
