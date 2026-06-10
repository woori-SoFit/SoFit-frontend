import { useNavigate } from "react-router-dom";
import sGradeIcon from "@/assets/icons/s-grade.svg";

/**
 * 성장 S등급 배너 CTA
 *
 * - 좌측 s-grade.png 아이콘
 * - "내 성장 S 등급 보러가기" + 부제
 * - 우측 "바로가기" 버튼
 * - 탭 시 /grade-report 네비게이션
 */
export function GrowthBanner() {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      role="button"
      aria-label="내 성장 S 등급 보러가기"
      onClick={() => navigate("/grade-report")}
      className="w-full flex items-center gap-3 px-4 py-4 bg-blue-100 rounded-xl border border-gray-200 active:bg-gray-100 transition-colors text-left"
    >
      {/* 아이콘 */}
      <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
        <img src={sGradeIcon} alt="S등급" className="w-7 h-7 object-contain" />
      </div>

      {/* 텍스트 */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-text-primary leading-snug">내 성장 S 등급 보러가기</p>
        <p className="text-xs text-text-secondary mt-0.5">성장 분석 리포트를 바로 볼 수 있어요.</p>
      </div>

      {/* 바로가기 버튼 */}
      <span className="shrink-0 px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded-md">
        바로가기
      </span>
    </button>
  );
}
