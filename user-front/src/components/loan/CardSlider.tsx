/**
 * 카드 슬라이더 — 중앙 정렬 + 고정 너비 + 인디케이터 점
 * 대출 진행 관리 페이지에서 사용
 */
import { useRef, useState } from "react";
import type { LoanApplication } from "@/types/loan";
import { LoanApplicationCard } from "./LoanApplicationCard";

interface CardSliderProps {
  items: LoanApplication[];
  onCardClick: (app: LoanApplication) => void;
}

export function CardSlider({ items, onCardClick }: CardSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
  const el = scrollRef.current;
  if (!el) return;

  const firstCard = el.children[0] as HTMLElement | undefined;
  if (!firstCard) return;

  const gap = 16;
  const cardWidth = firstCard.offsetWidth + gap;
  const index = Math.round(el.scrollLeft / cardWidth);

  setActiveIndex(index);
};

  return (
    <div>
      {/* 카드 스크롤 영역 — 고정 너비, 중앙 정렬 */}
      <div className="flex justify-center">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none px-5 w-full max-w-sm"
        >
          {items.map((app) => (
            <LoanApplicationCard
              key={app.id}
              app={app}
              onClick={() => onCardClick(app)}
            />
          ))}
        </div>
      </div>

      {/* 인디케이터 점 (2개 이상일 때만) */}
      {items.length >= 2 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {items.map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                index === activeIndex ? "bg-primary" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
