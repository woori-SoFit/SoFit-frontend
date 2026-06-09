import { ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface MenuCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  onPress: () => void;
}

/**
 * MenuHub 내 개별 메뉴 카드
 *
 * - 좌측 아이콘 + 제목/설명 + 우측 chevron
 * - 둥근 모서리, 배경색, 패딩
 * - 눌림 상태: active:bg-gray-100
 * - 접근성: role="button", aria-label={title}
 */
export function MenuCard({ title, description, icon: Icon, iconBg, iconColor, onPress }: MenuCardProps) {
  return (
    <button
      type="button"
      role="button"
      aria-label={title}
      onClick={onPress}
      className="w-full flex items-center gap-3 px-4 py-4 bg-bg-surface rounded-lg border border-gray-200 active:bg-gray-100 transition-colors text-left"
    >
      {/* 아이콘 영역 */}
      {Icon && (
        <div className={`w-11 h-11 rounded-xl ${iconBg ?? "bg-gray-100"} flex items-center justify-center shrink-0`}>
          <Icon size={22} className={iconColor ?? "text-gray-500"} />
        </div>
      )}

      {/* 텍스트 영역 */}
      <div className={`flex-1 min-w-0 ${description ? "" : "flex items-center"}`}>
        <p className="text-sm font-bold text-text-primary leading-snug">{title}</p>
        {description && (
          <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">{description}</p>
        )}
      </div>

      {/* Chevron */}
      <ChevronRight size={18} className="text-gray-400 shrink-0" />
    </button>
  );
}
