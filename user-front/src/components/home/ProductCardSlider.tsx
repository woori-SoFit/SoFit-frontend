/**
 * 상품 카드 부채꼴 슬라이더 컴포넌트
 *
 * 사용처:
 * - 홈 페이지 상품 카드 영역
 *
 * 기능:
 * - 부채꼴(fan) 형태 카드 배치
 * - 자동 슬라이드 (3초 간격)
 * - 좌우 버튼 / 일시정지
 * - 점프 카드 감지 → 즉시 이동 (어색한 가로질러 이동 방지)
 */
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import iconMenuCard from "@/assets/icons/menu-card1.svg";

export interface ProductCard {
  id: number;
  bg: string;
  tag: string;
  rate: string;
  desc: string;
  title: string;
  subtitle: string;
}

interface ProductCardSliderProps {
  cards: ProductCard[];
  /** 자동 슬라이드 간격 (ms, 기본 3000) */
  interval?: number;
}

export function ProductCardSlider({ cards, interval = 3000 }: ProductCardSliderProps) {
  const N = cards.length;
  const [displayIndex, setDisplayIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevIndexRef = useRef(0);

  // 자동 슬라이드
  useEffect(() => {
    if (isPaused || N <= 1) return;
    timerRef.current = setInterval(() => {
      advance(1);
    }, interval);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, N, interval]);

  const advance = (dir: 1 | -1) => {
    setDisplayIndex((prev) => {
      prevIndexRef.current = prev;
      return ((prev + dir) % N + N) % N;
    });
  };

  const handlePrev = () => advance(-1);
  const handleNext = () => advance(1);

  return (
    <section className="pb-3">
      <div className="relative h-[340px] overflow-hidden">
        {cards.map((card, i) => {
          // 현재 active 기준 offset 계산
          let offset = i - displayIndex;
          if (offset > 1) offset -= N;
          if (offset < -1) offset += N;

          // 이전 active 기준 offset (점프 감지용)
          let prevOffset = i - prevIndexRef.current;
          if (prevOffset > 1) prevOffset -= N;
          if (prevOffset < -1) prevOffset += N;

          // 점프 감지: 양쪽 끝을 넘어가는 카드
          const isJumping =
            (prevOffset === -1 && offset === 1) ||
            (prevOffset === 1 && offset === -1);

          // 부채꼴 transform 계산
          const rotate = offset * 6;
          const scale = offset === 0 ? 1 : 0.92;
          const translateX = offset * 72;
          const zIndex = offset === 0 ? 10 : 1;

          return (
            <div
              key={card.id}
              className="absolute top-0 left-1/2 w-[64%]"
              style={{
                transform: `translateX(calc(-50% + ${translateX}%)) rotate(${rotate}deg) scale(${scale})`,
                transformOrigin: "center bottom",
                zIndex,
                opacity: isJumping ? 0 : 1,
                transition: isJumping
                  ? "none"
                  : "transform 500ms cubic-bezier(0.4, 0, 0.2, 1), opacity 200ms ease 300ms",
                pointerEvents: offset === 0 ? "auto" : "none",
              }}
            >
              {/* 카드 본체 — 개별 그림자 + 글래스모피즘 */}
              <div
                className="rounded-2xl p-5 text-white shadow-[0_8px_24px_rgba(0,0,0,0.25)] backdrop-blur-xl border border-white/20"
                style={{ backgroundColor: `${card.bg}cc` }}
              >
              <p className="text-sm text-white/80 leading-snug">{card.subtitle}</p>
              <p className="mt-1 text-lg font-bold leading-snug">{card.title}</p>

              {/* 중앙 일러스트 영역 */}
              <div className="my-6 h-32 flex items-center justify-center">
                <img src={iconMenuCard} alt="" aria-hidden="true" className="w-36 h-36 object-contain" />
              </div>

              {/* 금리 정보 */}
              <div>
                <p className="text-xs text-white/70">{card.tag}</p>
                <p className="text-3xl font-extrabold tracking-tight">{card.rate}</p>
                <p className="mt-0.5 text-xs text-white/70">{card.desc}</p>
              </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 페이지 인디케이터 */}
      <div className="flex items-center justify-center gap-2 mt-3 text-sm text-text-secondary">
        <button type="button" aria-label="이전" className="p-1" onClick={handlePrev}>
          <ChevronLeft size={16} />
        </button>
        <span className="font-medium pt-0.5">{displayIndex + 1} / {cards.length}</span>
        <button type="button" aria-label="다음" className="p-1" onClick={handleNext}>
          <ChevronRight size={16} />
        </button>
        <button
          type="button"
          aria-label={isPaused ? "재생" : "일시정지"}
          className="p-1 ml-1"
          onClick={() => setIsPaused((p) => !p)}
        >
          {isPaused ? <Play size={12} /> : <Pause size={12} />}
        </button>
      </div>
    </section>
  );
}
