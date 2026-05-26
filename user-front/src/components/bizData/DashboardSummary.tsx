import type { RefObject } from "react";
import type { BizDashboardData } from "@/types/bizData";
import { GaugeBar } from "./GaugeBar";

interface DashboardSummaryProps {
  data: BizDashboardData;
  selectedMonth: string;
  currentMonth: string;
  fullCardRef: RefObject<HTMLDivElement>;
}

export function formatCurrency(amount: number): string {
  return amount.toLocaleString("ko-KR");
}

export function formatChangeRate(rate: number | null): { text: string; isPositive: boolean | null } {
  if (rate === null || rate === undefined) {
    return { text: "—", isPositive: null };
  }
  const isPositive = rate >= 0;
  return { text: `${isPositive ? "+" : ""}${rate.toFixed(1)}%`, isPositive };
}

export function DashboardSummary({ data, selectedMonth, currentMonth, fullCardRef }: DashboardSummaryProps) {
  const changeRate = formatChangeRate(data.monthOverMonthChange);
  const revenueLabel = selectedMonth === currentMonth ? "이번 달 매출" : `${selectedMonth} 매출`;
  const changeColor =
    changeRate.isPositive === null
      ? "text-text-secondary"
      : changeRate.isPositive
        ? "text-success"
        : "text-warning";

  return (
    <section className="px-5 pt-4 pb-4">
      {/* 풀 카드 — fullCardRef로 scroll 감지 */}
      <div ref={fullCardRef} className="bg-bg-surface rounded-xl shadow-card p-5 mb-3">
        <div className="flex items-start justify-between mb-2">
          <p className="text-sm text-text-secondary">{revenueLabel}</p>
          <p className="text-sm text-text-secondary">
            {changeRate.isPositive === null ? "전월 데이터 없음" : "전월 대비"}
          </p>
        </div>
        <div className="flex items-end justify-between">
          <p className="text-2xl font-bold text-text-primary">
            {formatCurrency(data.monthlyRevenue)}원
          </p>
          <p className={`text-xl font-bold ${changeColor}`}>{changeRate.text}</p>
        </div>
      </div>

      {/* 현금 흐름 + 순이익 */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-bg-surface rounded-xl shadow-card p-4">
          <p className="text-xs text-text-secondary mb-1">현금 흐름</p>
          <p className="text-base font-bold text-text-primary">{formatCurrency(data.cashFlow)}원</p>
        </div>
        <div className="bg-bg-surface rounded-xl shadow-card p-4">
          <p className="text-xs text-text-secondary mb-1">순이익(추정)</p>
          <p className="text-base font-bold text-text-primary">{formatCurrency(data.netProfit)}원</p>
        </div>
      </div>

      {/* 업종 비교 */}
      <div className="bg-bg-surface rounded-xl shadow-card p-5">
        <h3 className="text-base font-semibold text-text-primary mb-1">업종 평균과 비교</h3>
        <p className="text-xs text-text-secondary mb-4">{data.industryComparison.industryName} 기준</p>
        <div className="flex flex-col gap-4">
          <GaugeBar label="매출"   percent={data.industryComparison.revenue}      color="bg-success"   />
          <GaugeBar label="수익성" percent={data.industryComparison.profitability} color="bg-primary"   />
          <GaugeBar label="안정성" percent={data.industryComparison.stability}     color="bg-secondary" />
        </div>
      </div>
    </section>
  );
}
