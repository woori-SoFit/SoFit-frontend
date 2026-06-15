/**
 * 카테고리별 상세 대시보드 페이지
 * Route: /biz-data/dashboard?category={category}
 *
 * - MenuHub에서 선택한 카테고리에 따라 상세 데이터 표시
 * - selectedMonth는 Zustand store에서 읽기
 * - 뒤로가기 → /biz-data (MenuHub)
 */
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLayoutStore } from "@/stores/layoutStore";
import { useMenuHubStore } from "@/stores/menuHubStore";
import { DashboardSummary, formatCurrency, formatChangeRate } from "@/components/bizData/DashboardSummary";
import { DashboardDetail } from "@/components/bizData/DashboardDetail";
import { SalesDashboard } from "@/components/bizData/SalesDashboard";
import { ProfitDashboard } from "@/components/bizData/ProfitDashboard";
import { CustomerDashboard } from "@/components/bizData/CustomerDashboard";
import { IndustryDashboard } from "@/components/bizData/IndustryDashboard";
import { EmptyError } from "@/components/common/EmptyError";
import { CharacterLoadingSpinner } from "@/components/common/CharacterLoadingSpinner";
import { formatYearMonth, toMonthLabel } from "@/utils/format";
import { fetchMyBizDashboard } from "@/api/mybizApi";
import { BIZ_DATA_KEYS } from "@/constants/queryKeys";
import type { MenuCategory } from "@/types/menuHub";

/** 카테고리별 페이지 타이틀 */
function getCategoryTitle(category: MenuCategory, monthLabel: string): string {
  const titles: Record<MenuCategory, string> = {
    sales: `${monthLabel} 장사는 어땠나요?`,
    profit: `${monthLabel} 수익 흐름은 어떤가요?`,
    customer: "온라인 평판을 분석했어요",
    industry: "우리 가게는 상위 몇 %일까요?",
  };
  return titles[category];
}

/** 카테고리별 상단 라벨 */
function getCategoryLabel(category: MenuCategory): string {
  const labels: Record<MenuCategory, string> = {
    sales: "매출 분석",
    profit: "손익 현황",
    customer: "고객/온라인 활동",
    industry: "업종/상권 비교",
  };
  return labels[category];
}

function findScrollParent(el: HTMLElement | null): HTMLElement {
  let curr = el?.parentElement ?? null;
  while (curr && curr !== document.body) {
    const { overflowY } = getComputedStyle(curr);
    if (overflowY === "auto" || overflowY === "scroll") return curr;
    curr = curr.parentElement;
  }
  return document.documentElement;
}

export default function BizDashboardPage() {
  const [searchParams] = useSearchParams();
  const category = (searchParams.get("category") ?? "sales") as MenuCategory;
  const { selectedMonth: storeMonth } = useMenuHubStore();

  const [selectedMonth, setSelectedMonth] = useState<string>(storeMonth);
  const [monthError, setMonthError] = useState<string | null>(null);
  const [isCompact, setIsCompact] = useState(false);
  const fullCardRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    useLayoutStore.getState().setStepTitle("마이 비즈 데이터");
    return () => {
      useLayoutStore.getState().setStepTitle("");
    };
  }, []);

  // React Query로 대시보드 데이터 캐싱 (월별 queryKey로 자동 캐싱)
  const { data, isLoading, isError } = useQuery({
    queryKey: BIZ_DATA_KEYS.dashboard(selectedMonth || undefined),
    queryFn: () => fetchMyBizDashboard(selectedMonth || undefined),
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
  });

  // 최초 데이터 로드 시 selectedMonth 동기화
  useEffect(() => {
    if (data && !selectedMonth) {
      setSelectedMonth(data.referenceMonth);
    }
  }, [data, selectedMonth]);

  // 월 변경 핸들러 (queryKey가 바뀌면 React Query가 자동 fetch/캐시 체크)
  const handleMonthChange = (month: string) => {
    if (month === selectedMonth) return;
    setSelectedMonth(month);
    setMonthError(null);
  };

  // 풀 카드 상단이 뷰포트 위로 사라지면 compact 활성
  useEffect(() => {
    if (!data) return;
    const scrollEl = findScrollParent(rootRef.current);
    const handleScroll = () => {
      if (!fullCardRef.current) return;
      setIsCompact(fullCardRef.current.getBoundingClientRect().top < 0);
    };
    scrollEl.addEventListener("scroll", handleScroll, { passive: true });
    return () => scrollEl.removeEventListener("scroll", handleScroll);
  }, [data]);

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <EmptyError />
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (!data || isLoading) {
    return <CharacterLoadingSpinner text="자료를 불러오는 중..." />;
  }

  const availableMonths = data.availableMonths ?? [];
  const currentMonth = availableMonths[0] ?? selectedMonth ?? "";
  const displayMonths = availableMonths.length > 0 ? availableMonths : (selectedMonth ? [selectedMonth] : []);
  const changeRate = formatChangeRate(data.monthlyRevenueGrowthRate);
  const revenueLabel = `${formatYearMonth(selectedMonth)} 매출`;
  const changeColor =
    changeRate.isPositive === null
      ? "text-text-secondary"
      : changeRate.isPositive
        ? "text-info"
        : "text-error";

  return (
    <div ref={rootRef} data-testid={`biz-dashboard-page-${category}`} className={isLoading ? "opacity-60 pointer-events-none" : ""}>
      {/* 컴팩트 sticky 바 */}
      <div className="sticky top-0 z-20">
        <div
          className={`bg-bg-surface overflow-hidden transition-all duration-200 ease-out ${
            isCompact ? "max-h-24 py-3 shadow-md" : "max-h-0 py-0"
          }`}
        >
          <div className="px-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-text-secondary">{revenueLabel}</p>
              <p className="text-lg font-bold text-text-primary">
                {formatCurrency(data.monthlyRevenue)}원
              </p>
            </div>
            <p className={`text-base font-bold ${changeColor}`}>{changeRate.text}</p>
          </div>
        </div>
      </div>

      {/* 헤더: 카테고리 제목 + 월 선택 */}
      <div className="px-5 pt-2 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-text-secondary mb-0.5">{getCategoryLabel(category)}</p>
          <h2 className="text-lg font-bold text-text-primary whitespace-pre-line">
            {getCategoryTitle(category, toMonthLabel(selectedMonth))}
          </h2>
        </div>

        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={() => {
              const idx = displayMonths.indexOf(selectedMonth);
              if (idx < displayMonths.length - 1) handleMonthChange(displayMonths[idx + 1]);
            }}
            disabled={displayMonths.indexOf(selectedMonth) >= displayMonths.length - 1}
            aria-label="이전 달"
            className="w-5 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors disabled:opacity-30"
          >
            <ChevronLeft size={18} className="text-text-primary" />
          </button>
          <span className="text-sm font-medium text-text-primary min-w-[70px] text-center">
            {formatYearMonth(selectedMonth)}
          </span>
          <button
            type="button"
            onClick={() => {
              const idx = displayMonths.indexOf(selectedMonth);
              if (idx > 0) handleMonthChange(displayMonths[idx - 1]);
            }}
            disabled={displayMonths.indexOf(selectedMonth) <= 0}
            aria-label="다음 달"
            className="w-5 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors disabled:opacity-30"
          >
            <ChevronRight size={18} className="text-text-primary" />
          </button>
        </div>
      </div>

      {monthError && (
        <div className="mx-5 mb-2 p-3 bg-warning/10 border border-warning/30 rounded-lg">
          <p className="text-xs text-warning">{monthError}</p>
        </div>
      )}

      {/* 카테고리별 콘텐츠 */}
      {category === "sales" ? (
        <SalesDashboard data={data} />
      ) : category === "profit" ? (
        <ProfitDashboard data={data} />
      ) : category === "customer" ? (
        <CustomerDashboard data={data} />
      ) : category === "industry" ? (
        <IndustryDashboard data={data} />
      ) : (
        <>
          <DashboardSummary
            data={data}
            selectedMonth={selectedMonth}
            currentMonth={currentMonth}
            fullCardRef={fullCardRef}
          />
          <DashboardDetail data={data} />
        </>
      )}
    </div>
  );
}
