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
 * - 카드 클릭 → 상품 상세 페이지 이동 (onCardClick 콜백)
 */
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import product2Icon from "@/assets/icons/Product2.png";
import product3Icon from "@/assets/icons/Product3.png";

// 첫 번째 아이콘은 preload된 public 경로 사용
const PRODUCT_ICONS = ["/Product1.png", product2Icon, product3Icon];

export interface ProductCard {
  id: number;
  /** 원본 상품 id (반복 복사 시에도 실제 productId를 유지) */
  productId: number;
  bg: string;
  tag: string;
  rate: string;
  desc: string;
  title: string;
  subtitle: string;
  minRate: number;
}

interface ProductCardSliderProps {
  cards: ProductCard[];
  /** 원본 상품 총 개수 (인디케이터 표시용) */
  originalCount: number;
  /** 카드 클릭 콜백 */
  onCardClick?: (productId: number) => void;
  /** 자동 슬라이드 간격 (ms, 기본 3000) */
  interval?: number;
  /** 자동 슬라이드 시작 지연 (ms, 기본 5000) — LCP 안정화를 위해 초기 렌더 후 일정 시간 고정 */
  autoplayDelayStart?: number;
}

export function ProductCardSlider({
  cards,
  originalCount,
  onCardClick,
  interval = 3000,
  autoplayDelayStart = 5000,
}: ProductCardSliderProps) {
  const N = cards.length;
  const [displayIndex, setDisplayIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevIndexRef = useRef(0);

  // 터치 스와이프 상태
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);
  const isSwiping = useRef(false);

  // 자동 슬라이드 (초기 지연 후 시작 — LCP 안정화)
  const [autoplayReady, setAutoplayReady] = useState(false);

  useEffect(() => {
    const delayTimer = setTimeout(() => setAutoplayReady(true), autoplayDelayStart);
    return () => clearTimeout(delayTimer);
  }, [autoplayDelayStart]);

  useEffect(() => {
    if (!autoplayReady || isPaused || N <= 1) return;
    timerRef.current = setInterval(() => {
      advance(1);
    }, interval);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoplayReady, isPaused, N, interval]);

  const advance = (dir: 1 | -1) => {
    setDisplayIndex((prev) => {
      prevIndexRef.current = prev;
      return ((prev + dir) % N + N) % N;
    });
  };

  const handlePrev = () => advance(-1);
  const handleNext = () => advance(1);

  // 터치 핸들러
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
    isSwiping.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping.current) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const handleTouchEnd = () => {
    if (!isSwiping.current) return;
    isSwiping.current = false;
    const threshold = 50; // 최소 스와이프 거리
    if (touchDeltaX.current < -threshold) {
      advance(1); // 왼쪽 스와이프 → 다음
    } else if (touchDeltaX.current > threshold) {
      advance(-1); // 오른쪽 스와이프 → 이전
    }
  };

  // 인디케이터용: 현재 인덱스를 원본 상품 수 기준으로 환산
  const indicatorIndex = originalCount > 0 ? displayIndex % originalCount : displayIndex;

  return (
    <section className="pb-3">
      <div
        className="relative h-[340px] overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {cards.map((card, i) => {
          // 현재 active 기준 shortest distance offset 계산
          let offset = i - displayIndex;
          // 순환 보정: shortest path
          if (offset > N / 2) offset -= N;
          if (offset < -N / 2) offset += N;

          // 이전 active 기준 offset (점프 감지용)
          let prevOffset = i - prevIndexRef.current;
          if (prevOffset > N / 2) prevOffset -= N;
          if (prevOffset < -N / 2) prevOffset += N;

          // offset이 -1, 0, 1 범위 밖이면 숨김
          const isHidden = offset < -1 || offset > 1;

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
              className="absolute top-0 left-1/2 w-[62%]"
              style={{
                transform: `translateX(calc(-50% + ${translateX}%)) rotate(${rotate}deg) scale(${scale})`,
                transformOrigin: "center bottom",
                zIndex: isHidden ? 0 : zIndex,
                opacity: isHidden ? 0 : isJumping ? 0 : 1,
                transition: isJumping
                  ? "none"
                  : "transform 500ms cubic-bezier(0.4, 0, 0.2, 1), opacity 300ms ease",
                pointerEvents: offset === 0 ? "auto" : "none",
              }}
            >
              {/* 카드 본체 */}
              {/* 카드 본체 — 개별 그림자 + 글래스모피즘 */}
              <button
                type="button"
                className="w-full text-left rounded-2xl p-5 text-white backdrop-blur-3xl border border-white/20 active:brightness-90 transition-[filter]"
                style={{ backgroundColor: `${card.bg}99` }}
                onClick={() => onCardClick?.(card.productId)}
                aria-label={`${card.title} 상세 보기`}
              >
                <p className="text-sm leading-snug">{card.subtitle}</p>
                <p className="mt-1 text-lg font-bold leading-snug">{card.title}</p>

                {/* 중앙 일러스트 영역 */}
                <div className="mt-8 mb-5 h-32 flex items-center justify-center">
                  <img
                    src={PRODUCT_ICONS[(card.productId - 1) % PRODUCT_ICONS.length]}
                    alt=""
                    width={160}
                    height={160}
                    aria-hidden="true"
                    className="w-40 h-40 object-contain"
                    fetchPriority={i === 0 ? "high" : undefined}
                    loading={i === 0 ? undefined : "lazy"}
                  />
                </div>

                {/* 금리 정보 */}
                <div>
                  <p className="text-xs">{card.tag}</p>
                  <p className="text-3xl font-extrabold tracking-tight">{card.rate}</p>
                  <p className="mt-0.5 text-xs">최저금리 연 {card.minRate}% ~</p>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* 페이지 인디케이터 */}
      <div className="flex items-center justify-center gap-2 mt-3 text-sm text-text-secondary">
        <button type="button" aria-label="이전" className="p-1" onClick={handlePrev}>
          <ChevronLeft size={16} />
        </button>
        <span className="font-medium pt-0.5">
          {indicatorIndex + 1} / {originalCount}
        </span>
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
