/**
 * 대출 신청 이어하기 카드 컴포넌트
 *
 * 홈 화면에서 임시저장된 대출 신청이 있을 때 표시.
 * 이미지 참고: 태그 배지 + 제목(건수 강조) + 설명 + 상품 리스트
 *
 * 사용처: HomePage (상품 슬라이더 아래, 대출 현황 위)
 */
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import type { LoanDraftItem } from "@/types/loan";
import draftIcon from "@/assets/icons/draft.svg";

interface DraftResumeCardProps {
  drafts: LoanDraftItem[];
}

export function DraftResumeCard({ drafts }: DraftResumeCardProps) {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  if (drafts.length === 0) return null;

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll <= 0) { setActiveIndex(0); return; }
    const ratio = scrollLeft / maxScroll;
    setActiveIndex(Math.round(ratio * (drafts.length - 1)));
  };

  return (
    <section className="px-5 mt-2">
      <div className="relative bg-linear-to-br from-blue-50 to-white rounded-2xl p-5 border border-border-default overflow-hidden">
        {/* 우측 상단 일러스트 */}
        <div className="absolute top-4 right-5 w-16 h-16">
          <img src={draftIcon} alt="" aria-hidden="true" className="w-full h-full object-contain" />
        </div>

        {/* 태그 배지 */}
        <span className="inline-block px-3 py-1 rounded-sm bg-primary/10 text-xs font-medium text-primary mb-3">
          이어서 신청하기
        </span>

        {/* 제목 */}
        <h3 className="text-lg font-bold text-text-primary mb-1">
          신청 중인 대출상품 <span className="text-primary">{drafts.length}건</span>
        </h3>

        {/* 설명 */}
        <p className="text-xs text-text-secondary mb-4">
          이전에 신청하던 대출상품을 이어서 진행해 보세요.
        </p>

        {/* 상품 리스트 — 가로 스크롤 */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-2 overflow-x-auto scrollbar-none snap-x snap-mandatory"
        >
          {drafts.map((draft) => (
            <button
              key={draft.applicationId}
              type="button"
              onClick={() =>
                navigate("/loan/apply", {
                  state: {
                    productId: draft.productId,
                    applicationId: draft.applicationId,
                    resumeStep: draft.resumeStep,
                  },
                })
              }
              className="flex items-center gap-3 min-w-full shrink-0 snap-start px-4 py-3 rounded-lg bg-white border border-border-default active:bg-gray-50 transition-colors"
            >
              <span className="text-sm font-medium text-text-primary flex-1 text-left truncate">
                {draft.productName}
              </span>
              <ChevronRight size={16} className="text-gray-400 shrink-0" />
            </button>
          ))}
        </div>

        {/* 점 인디케이터 — 2개 이상일 때만 */}
        {drafts.length > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-3">
            {drafts.map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-200 ${
                  i === activeIndex ? "w-1.5 h-1.5 bg-primary" : "w-1.5 h-1.5 bg-gray-300"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
