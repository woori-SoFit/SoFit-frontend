/**
 * My Biz Data 페이지
 * Route: /biz-data
 * Layout: StepLayout
 *
 * - 미연결 시: 서비스 소개 + 수집 시작 버튼
 * - 연결 완료 시: 통합 대시보드
 */
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLayoutStore } from "@/stores/layoutStore";
import { useMe } from "@/hooks/useMe";
import { IntroSection } from "@/components/bizData/IntroSection";
import { DashboardSummary, formatCurrency, formatChangeRate } from "@/components/bizData/DashboardSummary";
import { DashboardDetail } from "@/components/bizData/DashboardDetail";
import { formatYearMonth } from "@/utils/format";
import type { BizDashboardData } from "@/types/bizData";
import { EmptyError } from "@/components/common/EmptyError";
import { CharacterLoadingSpinner } from "@/components/common/CharacterLoadingSpinner";
import {
  checkMyBizConnected,
  fetchMyBizDashboard,
  fetchLoanBalance,
} from "@/api/mybizApi";


export default function BizDataPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  // grade-report에서 진입한 경우 returnTo를 전달받음
  const returnTo = (location.state as { returnTo?: string } | null)?.returnTo;

  useEffect(() => {
    useLayoutStore.getState().setStepTitle("마이 비즈 데이터");
    return () => {
      useLayoutStore.getState().setStepTitle("");
    };
  }, []);

  useEffect(() => {
    checkMyBizConnected()
      .then(setIsConnected)
      .catch(() => {
        // 비로그인
        setIsConnected(false);
      });
  }, []);

  if (isConnected === null) {
    return <CharacterLoadingSpinner text="불러오는 중..." />;
  }

  if (!isConnected) {
    return (
      <div data-testid="biz-data-page" className="flex flex-col h-[calc(100dvh-64px)]">
        <IntroSection />
        <div className="px-5 pb-6 pt-3 bg-bg-base">
          <button
            type="button"
            onClick={() => navigate("/biz-data/collect", {
              state: returnTo ? { returnTo } : undefined,
            })}
            className="w-full h-12 rounded-lg text-base font-semibold bg-primary text-white hover:bg-primary-dark active:bg-primary-dark transition-colors"
          >
            데이터 연결 시작하기
          </button>
        </div>
      </div>
    );
  }

  return <BizDashboard />;
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

function BizDashboard() {
  const { me } = useMe();
  const userName = me?.name ?? "";
  const [data, setData] = useState<BizDashboardData | null>(null);
  const [fetchError, setFetchError] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [monthError, setMonthError] = useState<string | null>(null);
  const [isCompact, setIsCompact] = useState(false);
  const fullCardRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  // 최초 로드: 최신 월 데이터 + 대출 잔액 병렬 조회
  useEffect(() => {
    let cancelled = false;
    fetchMyBizDashboard()
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
  }, []);

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
  // data 로드 후 DOM이 실제로 렌더된 시점에 scroll parent를 찾아야 함
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
    return <EmptyError />;
  }

  if (!data) {
    return <CharacterLoadingSpinner text="자료를 불러오는 중..." />;
  }

  const currentMonth = availableMonths[0] ?? selectedMonth ?? "";
  // availableMonths가 비어있어도 현재 선택된 달은 최소 1개 보여줌
  const displayMonths = availableMonths.length > 0 ? availableMonths : (selectedMonth ? [selectedMonth] : []);
  const changeRate = formatChangeRate(data.monthOverMonthChange);
  const revenueLabel =
    selectedMonth === currentMonth ? "이번 달 매출" : `${formatYearMonth(selectedMonth)} 매출`;
  // 양수 info(파랑) / 음수 error(빨강) — DashboardSummary와 색 통일
  const changeColor =
    changeRate.isPositive === null
      ? "text-text-secondary"
      : changeRate.isPositive
        ? "text-info"
        : "text-error";

  return (
    <div ref={rootRef} data-testid="biz-data-page" className={isLoading ? "opacity-60 pointer-events-none" : ""}>
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

      {/* 헤더: 사용자 인사 + 월 선택 드롭다운 */}
      <div className="px-5 py-2 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="text-base font-semibold text-text-primary truncate">
            {userName ? `${userName} 사장님,` : "사장님,"}
          </p>
          <p className="text-xs text-text-secondary mt-0.5">
            사업 현황을 한눈에 확인해 보세요
          </p>
        </div>

        <div className="flex items-center gap- shrink-0">
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
