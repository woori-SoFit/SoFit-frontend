/**
 * My Biz Data 페이지
 * Route: /biz-data
 * Layout: StepLayout
 *
 * - 미연결 시: 서비스 소개 + 수집 시작 버튼
 * - 연결 완료 시: 통합 대시보드
 */
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useLayoutStore } from "@/stores/layoutStore";
import { IntroSection } from "@/components/bizData/IntroSection";
import { DashboardSummary, formatCurrency, formatChangeRate } from "@/components/bizData/DashboardSummary";
import { DashboardDetail } from "@/components/bizData/DashboardDetail";
import type { BizDashboardData } from "@/types/bizData";
import {
  checkMyBizConnected,
  fetchMyBizDashboard,
  fetchLoanBalance,
} from "@/api/mybizApi";


export default function BizDataPage() {
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    useLayoutStore.getState().setStepTitle("마이 비즈 데이터");
    return () => {
      useLayoutStore.getState().setStepTitle("");
    };
  }, []);

  useEffect(() => {
    checkMyBizConnected()
      .then(setIsConnected)
      .catch(() => setIsConnected(false));
  }, []);

  if (isConnected === null) {
    return (
      <div className="flex items-center justify-center h-[calc(100dvh-64px)]">
        <p className="text-sm text-text-secondary">불러오는 중...</p>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div data-testid="biz-data-page" className="flex flex-col h-[calc(100dvh-64px)]">
        <IntroSection />
        <div className="px-5 pb-6 pt-3 bg-bg-base">
          <button
            type="button"
            onClick={() => navigate("/biz-data/collect")}
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
  const [data, setData] = useState<BizDashboardData | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [monthError, setMonthError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fullCardRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  // 최초 로드: 최신 월 데이터 + 대출 잔액 병렬 조회
  useEffect(() => {
    let cancelled = false;
    fetchMyBizDashboard().then((dashboard) => {
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
    });
    return () => { cancelled = true; };
  }, []);

  // 월 변경 시 해당 월 데이터 조회
  const handleMonthChange = (month: string) => {
    if (month === selectedMonth) { setOpen(false); return; }
    setOpen(false);
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
        if (status === 404) setMonthError(`${month} 데이터가 없습니다`);
        else setMonthError("데이터를 불러오지 못했습니다");
      })
      .finally(() => setIsLoading(false));
  };

  // 드롭다운 외부 클릭 닫기
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 풀 카드 상단이 뷰포트 위로 사라지면 compact 활성
  useEffect(() => {
    const scrollEl = findScrollParent(rootRef.current);
    const handleScroll = () => {
      if (!fullCardRef.current) return;
      setIsCompact(fullCardRef.current.getBoundingClientRect().top < 0);
    };
    scrollEl.addEventListener("scroll", handleScroll, { passive: true });
    return () => scrollEl.removeEventListener("scroll", handleScroll);
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-[calc(100dvh-64px)]">
        <p className="text-sm text-text-secondary">데이터를 불러오는 중...</p>
      </div>
    );
  }

  const currentMonth = availableMonths[0] ?? selectedMonth ?? "";
  const changeRate = formatChangeRate(data.monthOverMonthChange);
  const revenueLabel = selectedMonth === currentMonth ? "이번 달 매출" : `${selectedMonth} 매출`;
  const changeColor =
    changeRate.isPositive === null
      ? "text-text-secondary"
      : changeRate.isPositive
        ? "text-success"
        : "text-warning";

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

      {/* 헤더: 제목 + 월 선택 드롭다운 */}
      <div className="px-5 pt-6 pb-2 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">마이 비즈 데이터</h1>
          <p className="text-sm text-text-secondary mt-1">사업 현황을 한눈에 확인하세요</p>
        </div>

        <div className="relative shrink-0" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-1.5 text-sm font-medium text-text-primary bg-bg-surface border border-border-default rounded-lg px-3 py-2"
          >
            {selectedMonth === currentMonth ? "이번 달" : selectedMonth}
            <ChevronDown
              size={14}
              className={`text-text-secondary transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            />
          </button>

          {open && (
            <ul className="absolute top-full right-0 mt-1 z-30 bg-bg-surface border border-border-default rounded-lg shadow-card overflow-hidden min-w-[140px]">
              {availableMonths.map((month) => (
                <li key={month}>
                  <button
                    type="button"
                    onClick={() => handleMonthChange(month)}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                      month === selectedMonth
                        ? "text-primary font-semibold bg-primary/5"
                        : "text-text-primary hover:bg-gray-50"
                    }`}
                  >
                    {month} {month === currentMonth ? "(이번 달)" : ""}
                  </button>
                </li>
              ))}
            </ul>
          )}
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
