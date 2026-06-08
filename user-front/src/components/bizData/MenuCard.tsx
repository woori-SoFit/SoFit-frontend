import { ChevronRight } from "lucide-react";

interface MenuCardProps {
  title: string;
  description?: string;
  onPress: () => void;
}

/**
 * MenuHub 내 개별 메뉴 카드
 *
 * - 둥근 모서리, 배경색, 좌우 패딩 카드 형태
 * - 제목(볼드) + 설명(보조색) + 우측 chevron
 * - 눌림 상태: active:bg-gray-100
 * - 접근성: role="button", aria-label={title}
 */
export function MenuCard({ title, description, onPress }: MenuCardProps) {
  return (
    <button
      type="button"
      role="button"
      aria-label={title}
      onClick={onPress}
      className="w-full flex items-center gap-3 px-4 py-4 bg-bg-surface rounded-xl shadow-card active:bg-gray-100 transition-colors text-left"
    >
      <div className={`flex-1 ${description ? "" : "flex items-center"}`}>
        <p className="text-sm font-bold text-text-primary">{title}</p>
        {description && (
          <p className="text-xs text-text-secondary mt-0.5">{description}</p>
        )}
      </div>
      <ChevronRight size={18} className="text-gray-400 shrink-0" />
    </button>
  );
}
