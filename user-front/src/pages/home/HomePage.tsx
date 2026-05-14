/**
 * 홈 페이지
 * Layout: MainLayout
 *
 * 구성:
 *   1. 히어로 섹션 (타이틀 + 서브타이틀) — 중앙 정렬
 *   2. 상품 카드 가로 슬라이더 (자동 스크롤)
 *   3. 대출진행관리 배너
 *   4. 2×2 메뉴 그리드
 */
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

import iconLoanHistory from "@/assets/icons/menu-loan-history.svg";
import iconLoanList from "@/assets/icons/menu-loan-list.svg";
import iconBizData from "@/assets/icons/menu-mybiz-data.svg";
import iconSReport from "@/assets/icons/menu-s-report.svg";
import iconCalculator from "@/assets/icons/menu-calculator.svg";
import iconMenuCard from "@/assets/icons/menu-card1.svg";

// ── 상품 카드 슬라이더 ──────────────────────────────────────────
const PRODUCT_CARDS = [
  {
    id: 1,
    bg: "#294f71",
    tag: "최고 연",
    rate: "6.00%",
    desc: "기본 2.00%, 12개월 기준",
    title: "소상공인 성장 대출",
    subtitle: "매출이 늘면, 금리도 낮아진다!",
  },
  {
    id: 2,
    bg: "#27476e",
    tag: "최저 연",
    rate: "4.50%",
    desc: "우대금리 적용 시",
    title: "사업자 운전자금 대출",
    subtitle: "빠른 심사, 당일 실행",
  },
  {
    id: 3,
    bg: "#376996",
    tag: "한도",
    rate: "5천만원",
    desc: "S등급 우대 적용",
    title: "성장S등급 특별 대출",
    subtitle: "성장 가능성을 인정받으세요",
  },
];

// ── 메뉴 그리드 아이템 ──────────────────────────────────────────
const MENU_ITEMS = [
  {
    id: "loan-list",
    label: "대출 목록",
    to: "/loan",
    icon: iconLoanList,
  },
  {
    id: "biz-data",
    label: "마이 비즈 데이터",
    to: "/biz-data",
    icon: iconBizData,
  },
  {
    id: "grade-report",
    label: "S 분석 리포트",
    to: "/grade-report",
    icon: iconSReport,
  },
  {
    id: "calculator",
    label: "사전 계산기",
    to: "/calculate",
    icon: iconCalculator,
  },
];

// 자동 슬라이드 간격 (ms)
const AUTO_SLIDE_INTERVAL = 3000;

// 무한 루프용: [원본, 원본, 원본] — 중간 세트(인덱스 N~2N-1)를 기준으로 동작
const LOOP_CARDS = [...PRODUCT_CARDS, ...PRODUCT_CARDS, ...PRODUCT_CARDS];
const N = PRODUCT_CARDS.length; // 3

export default function HomePage() {
  // 실제 표시 인덱스 (0-based, PRODUCT_CARDS 기준)
  const [displayIndex, setDisplayIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // 현재 LOOP_CARDS 상의 위치 (중간 세트에서 시작)
  const loopIndexRef = useRef(N);

  // LOOP_CARDS 상의 특정 인덱스로 스크롤 (animate 여부 선택)
  const scrollToLoopIndex = (loopIdx: number, animate: boolean) => {
    const container = scrollRef.current;
    if (!container) return;
    const card = container.children[loopIdx] as HTMLElement;
    if (!card) return;
    container.scrollTo({
      left: card.offsetLeft - container.offsetLeft,
      behavior: animate ? "smooth" : "instant",
    });
  };

  // 마운트 시 중간 세트 첫 번째 카드로 이동 (애니메이션 없이)
  useEffect(() => {
    scrollToLoopIndex(N, false);
  }, []);

  // 자동 슬라이드
  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(() => {
      advance(1);
    }, AUTO_SLIDE_INTERVAL);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]);

  const advance = (dir: 1 | -1) => {
    const nextLoop = loopIndexRef.current + dir;
    loopIndexRef.current = nextLoop;
    scrollToLoopIndex(nextLoop, true);

    const nextDisplay = ((nextLoop % N) + N) % N;
    setDisplayIndex(nextDisplay);

    // 끝 세트에 도달하면 중간 세트로 순간이동
    setTimeout(() => {
      if (loopIndexRef.current >= N * 2) {
        loopIndexRef.current = N;
        scrollToLoopIndex(N, false);
      } else if (loopIndexRef.current < N) {
        loopIndexRef.current = N * 2 - 1;
        scrollToLoopIndex(N * 2 - 1, false);
      }
    }, 400); // smooth 애니메이션 완료 후
  };

  const handlePrev = () => advance(-1);
  const handleNext = () => advance(1);

  return (
    <div className="pb-8">
      {/* ── 히어로 섹션 ── */}
      <section className="px-5 pt-6 pb-4 text-center">
        <h1 className="text-[22px] font-bold text-[--color-text-primary] leading-snug">
          사장님에게 도움이 되는 모든 것!
        </h1>
        <p className="mt-1 text-sm text-[--color-text-secondary]">
          개인사업자를 위한 특별한 상품을 만나보세요
        </p>
      </section>

      {/* ── 상품 카드 슬라이더 ── */}
      <section className="pb-3">
        {/* 가로 스크롤 — 양쪽 카드가 살짝 보이는 peek 효과 */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto px-5 snap-x snap-mandatory scrollbar-none"
        >
          {LOOP_CARDS.map((card, i) => (
            <div
              key={i}
              className="flex-none w-[74%] snap-center rounded-2xl p-5 text-white"
              style={{ backgroundColor: card.bg }}
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
          ))}
        </div>

        {/* 페이지 인디케이터 */}
        <div className="flex items-center justify-center gap-2 mt-3 text-sm text-[--color-text-secondary]">
          <button type="button" aria-label="이전" className="p-1" onClick={handlePrev}>
            <ChevronLeft size={16} />
          </button>
          <span className="font-medium pt-0.5">{displayIndex + 1} / {PRODUCT_CARDS.length}</span>
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

      {/* ── 대출진행관리 배너 ── */}
      <section className="px-5 mt-2">
        <Link
          to="/loan-applications"
          className="flex items-center justify-between w-full bg-white rounded-2xl px-5 py-4 shadow-[--shadow-card] border border-border-default active:scale-[0.98] transition-transform"
        >
          <div>
            <p className="text-base font-bold text-[--color-text-primary]">
              대출진행관리
            </p>
            <p className="mt-0.5 text-sm text-[--color-text-secondary]">
              신청중인 대출 바로 확인하기
            </p>
          </div>
          {/* 대출진행관리 아이콘 */}
          <img src={iconLoanHistory} alt="" aria-hidden="true" className="w-14 h-14 object-contain" />
        </Link>
      </section>

      {/* ── 2×2 메뉴 그리드 ── */}
      <section className="px-5 mt-4">
        <div className="grid grid-cols-2 gap-3">
          {MENU_ITEMS.map((item) => (
            <Link
              key={item.id}
              to={item.to}
              className="flex items-center justify-between bg-white rounded-2xl px-2 py-4 shadow-[--shadow-card] border border-border-default active:scale-[0.97] transition-transform"
            >
              <div className="flex items-center gap-1">
                <img src={item.icon} alt="" aria-hidden="true" className="w-9 h-9 object-contain" />
                <span className="text-sm font-medium text-text-primary">
                  {item.label}
                </span>
              </div>
              <ChevronRight size={16} className="text-gray-400 flex-none" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
