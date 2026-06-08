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
import { useLayoutStore } from "@/stores/layoutStore";
import { useMenuHubStore } from "@/stores/menuHubStore";
import { useMe } from "@/hooks/useMe";
import { DashboardSummary, formatCurrency, formatChangeRate } from "@/components/bizData/DashboardSummary";
import { DashboardDetail } from "@/components/bizData/DashboardDetail";
import { EmptyError } from "@/components/common/EmptyError";
import { CharacterLoadingSpinner } from "@/components/common/CharacterLoadingSpinner";
import { formatYearMonth } from "@/utils/format";
import { fetchMyBizDashboard, fetchLoanBalance } from "@/api/mybizApi";
import type { BizDashboardData } from "@/types/bizData";
import type { MenuCategory } from "@/types/menuHub";

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

  const { me } = useMe();
  const userName = me?.name ?? "";

  const [data, setData] = useState<BizDashboardData | null>(null);
  const [fetchError, setFetchError] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>(storeMonth);
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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

  // 최초 로드: store의 월 또는 최신 월 데이터 + 대출 잔액 병렬 조회
  useEffect(() => {
    let cancelled = false;
    const month = storeMonth || undefined;
    fetchMyBizDashboard(month)
      .then((dashboard) => {
        if (cancelled) return;
        setData(dashboard);
        setSelectedMonth(dashboard.currentMonth);
        setAvailableMonths(dashboard.availableMonths);

        fetchLoanBalance().then((loan) => {
          if (cancelled) return;
          setData((prev) =>
            prev ? { ...prev, loanBalance: loan.loanBalance, loanRepaymentDate: loan.loanRepaymentDate } : prev
          );
        });
      })
      .catch(() => {
        if (!cancelled) setFetchError(true);
      });
    return () => { cancelled = true; };
  }, [storeMonth]);

  // 월 변경 시 해당 월 데이터 조회
  const handleMonthChange = (month: string) => {
    if (month === selectedMonth) return;
    setSelectedMonth(month);
    setIsLoading(true);
    setMonthError(null);
    fetchMyBizDashboard(month)
      .then((dashboard) => {
        setData((prev) =>
          prev
            ? { ...dashboard, loanBalance: prev.loanBalance, loanRepaymentDate: prev.loanRepaymentDate }
            : dashboard
        );
      })
      .catch((err: unknown) => {
        const status = (err as { response?: { status?: number } })?.response?.status;
        if (status === 404) setMonthError(`${formatYearMonth(month)} 자료가 없어요`);
        else setMonthError("자료를 불러오지 못했어요");
      })
      .finally(() => setIsLoading(false));
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

  if (fetchError || (!data && !isLoading)) {
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

  if (!data) {
    return <CharacterLoadingSpinner text="자료를 불러오는 중..." />;
  }

  const currentMonth = availableMonths[0] ?? selectedMonth ?? "";
  const displayMonths = availableMonths.length > 0 ? availableMonths : (selectedMonth ? [selectedMonth] : []);
  const changeRate = formatChangeRate(data.monthOverMonthChange);
  const revenueLabel =
    selectedMonth === currentMonth ? "이번 달 매출" : `${formatYearMonth(selectedMonth)} 매출`;
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

      {/* 헤더: 사용자 인사 + 월 선택 */}
      <div className="px-5 py-2 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="text-base font-semibold text-text-primary truncate">
            {userName ? `${userName} 사장님,` : "사장님,"}
          </p>
          <p className="text-xs text-text-secondary mt-0.5">
            사업 현황을 한눈에 확인해 보세요
          </p>
        </div>

        <div className="flex items-center gap-0 shrink-0">
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
          <span className="text-sm font-medium text-text-primary min-w-[80px] text-center">
            {selectedMonth === currentMonth ? "이번 달" : formatYearMonth(selectedMonth)}
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

      <DashboardSummary
        data={data}
        selectedMonth={selectedMonth}
        currentMonth={currentMonth}
        fullCardRef={fullCardRef}
      />
      <DashboardDetail data={data} />
    </div>
  );
}
