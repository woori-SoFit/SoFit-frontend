import type { RefObject } from "react";
import type { BizDashboardData } from "@/types/bizData";
import { GaugeBar } from "./GaugeBar";
import { InfoTooltip } from "@/components/common/InfoTooltip";
import { formatYearMonth, formatCurrency, formatChangeRate } from "@/utils/format";

// 하위 호환을 위한 re-export (BizDataPage, DashboardDetail에서 이 경로로 import 중)
export { formatCurrency, formatChangeRate } from "@/utils/format";

interface DashboardSummaryProps {
  data: BizDashboardData;
  selectedMonth: string;
  currentMonth: string;
  fullCardRef: RefObject<HTMLDivElement>;
}

export function DashboardSummary({ data, selectedMonth, currentMonth, fullCardRef }: DashboardSummaryProps) {
  const changeRate = formatChangeRate(data.monthlyRevenueGrowthRate);
  const revenueLabel =
    selectedMonth === currentMonth ? "이번 달 매출" : `${formatYearMonth(selectedMonth)} 매출`;
  // 양수: info(파란색) / 음수: error(빨강) — 브랜드 primary 및 success(매출 게이지)와 분리
  const changeColor =
    changeRate.isPositive === null
      ? "text-text-secondary"
      : changeRate.isPositive
        ? "text-info"
        : "text-error";

  return (
    <section className="px-5 pt-4 pb-4">
      {/* 풀 카드 — fullCardRef로 scroll 감지 */}
      <div ref={fullCardRef} className="bg-bg-surface rounded-xl shadow-card p-5 mb-3">
        <div className="flex items-start justify-between mb-2">
          <p className="text-sm text-text-secondary">{revenueLabel}</p>
          <p className="text-sm text-text-secondary">
            {changeRate.isPositive === null ? "지난달 자료 없음" : "지난달보다"}
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
          <p className="text-base font-bold text-text-primary">{formatCurrency(data.monthlyRevenue - data.monthlyOutflow)}원</p>
        </div>
        <div className="bg-bg-surface rounded-xl shadow-card p-4">
          <div className="flex items-center gap-1 mb-1">
            <p className="text-xs text-text-secondary">순이익</p>
            <InfoTooltip
              ariaLabel="순이익 설명"
              message="매출에서 추정 비용을 뺀 예상 순이익이에요. 실제 회계 결산값과는 차이가 있을 수 있어요."
            />
          </div>
          <p className="text-base font-bold text-text-primary">{formatCurrency(data.estimatedProfit)}원</p>
        </div>
      </div>

      {/* 업종 비교 */}
      <div className="bg-bg-surface rounded-xl shadow-card p-5">
        <h3 className="text-base font-semibold text-text-primary mb-1">업종 평균과 비교</h3>
        <p className="text-xs text-text-secondary mb-4">
          사장님 업종({data.industryName}) 평균과 비교했어요
        </p>
        <div className="flex flex-col gap-4">
          <GaugeBar label="매출" percent={data.industrySalesRank} color="bg-success" />
          <GaugeBar
            label="수익성"
            percent={data.industryProfitRank}
            color="bg-primary"
            tooltip="매출 대비 이익이 얼마나 남는지를 업종 평균과 비교해 보여줘요."
          />
          <GaugeBar
            label="고객만족도"
            percent={data.industrySatisfactionRank}
            color="bg-secondary"
            tooltip="리뷰 평점을 업종 평균과 비교해 보여줘요."
          />
        </div>
      </div>
    </section>
  );
}
