import { useNavigate } from "react-router-dom";
import { TrendingUp } from "lucide-react";

/**
 * 성장 S등급 배너 CTA
 *
 * - "내 성장 S 등급 보러가기" 텍스트
 * - 탭 시 /grade-report 으로 네비게이션
 * - MenuCard와 다른 배경색(primary-light 계열)
 * - 접근성: role="button", aria-label
 */
export function GrowthBanner() {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      role="button"
      aria-label="내 성장 S 등급 보러가기"
      onClick={() => navigate("/grade-report")}
      className="w-full flex items-center gap-3 px-4 py-4 bg-primary/5 border border-primary/20 rounded-xl active:bg-primary/10 transition-colors text-left"
    >
      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <TrendingUp size={18} className="text-primary" />
      </div>
      <span className="flex-1 text-sm font-bold text-primary">
        내 성장 S 등급 보러가기
      </span>
    </button>
  );
}
