/**
 * 마이페이지 메뉴 항목 컴포넌트
 * - to 지정 시 Link 래핑 (네비게이션)
 * - onClick 지정 시 button 래핑 (로그아웃/탈퇴 등 액션)
 * - variant='danger' 시 빨간색 텍스트
 */
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface MenuItemProps {
  label: string;
  to?: string;
  onClick?: () => void;
  variant?: "default" | "danger";
}

export function MenuItem({ label, to, onClick, variant = "default" }: MenuItemProps) {
  const textColor = variant === "danger" ? "text-error" : "text-text-primary";

  const content = (
    <div className="flex items-center justify-between w-full px-5 py-4">
      <span className={`text-base font-medium ${textColor}`}>{label}</span>
      <ChevronRight size={18} className="text-gray-400" />
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="block w-full active:bg-gray-50 transition-colors">
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="block w-full text-left active:bg-gray-50 transition-colors"
    >
      {content}
    </button>
  );
}
