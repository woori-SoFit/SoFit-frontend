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
import { BottomButton } from "@/components/common/BottomButton";
import { MOCK_IS_CONNECTED, MOCK_BIZ_DASHBOARDS, MOCK_CURRENT_MONTH } from "@/mocks/bizData";

export default function BizDataPage() {
  const navigate = useNavigate();

  useEffect(() => {
    useLayoutStore.getState().setStepTitle("마이 비즈 데이터");
    return () => {
      useLayoutStore.getState().setStepTitle("");
    };
  }, []);

  const isConnected = MOCK_IS_CONNECTED;

  if (!isConnected) {
    return (
      <div data-testid="biz-data-page">
        <IntroSection />
        <div className="sticky bottom-0 px-5 py-5 bg-bg-base">
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
  const [selectedMonth, setSelectedMonth] = useState(MOCK_CURRENT_MONTH);
  const [open, setOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const availableMonths = Object.keys(MOCK_BIZ_DASHBOARDS).sort().reverse();
  const data = MOCK_BIZ_DASHBOARDS[selectedMonth] ?? MOCK_BIZ_DASHBOARDS[MOCK_CURRENT_MONTH];
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fullCardRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const changeRate = formatChangeRate(data.monthOverMonthChange);
  const revenueLabel = selectedMonth === MOCK_CURRENT_MONTH ? "이번 달 매출" : `${selectedMonth} 매출`;
  const changeColor =
    changeRate.isPositive === null
      ? "text-text-secondary"
      : changeRate.isPositive
        ? "text-success"
        : "text-warning";

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

  return (
    <div ref={rootRef} data-testid="biz-data-page">
      {/* 컴팩트 sticky 바 — DashboardDetail보다 DOM 앞에 있어야 z-index 보장 */}
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
            {selectedMonth === MOCK_CURRENT_MONTH ? "이번 달" : selectedMonth}
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
                    onClick={() => { setSelectedMonth(month); setOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                      month === selectedMonth
                        ? "text-primary font-semibold bg-primary/5"
                        : "text-text-primary hover:bg-gray-50"
                    }`}
                  >
                    {month} {month === MOCK_CURRENT_MONTH ? "(이번 달)" : ""}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <DashboardSummary
        data={data}
        selectedMonth={selectedMonth}
        currentMonth={MOCK_CURRENT_MONTH}
        fullCardRef={fullCardRef}
      />
      <DashboardDetail data={data} />
    </div>
  );
}
