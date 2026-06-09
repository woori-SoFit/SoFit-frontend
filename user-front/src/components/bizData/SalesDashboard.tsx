/**
 * "이번 달 장사는 어땠나요?" 카테고리 상세 화면
 *
 * 표시 데이터:
 * - 거래 현황: 월 거래 건수, 건당 평균 결제액
 * - 매출: 이번 달 매출, 전월 매출액, 전월 대비 증감률
 * - 최근 6개월 매출 추이 차트 (기존 RevenueLineChart 재활용)
 * - 업종 내 위치: 매출 상위 %, 전월 대비 순위 변동
 */
import { BarChart3, ArrowUpRight, ArrowDownRight, Receipt, CreditCard, TrendingUp } from "lucide-react";
import { RevenueLineChart } from "./RevenueLineChart";
import { formatCurrency, formatChangeRate } from "@/utils/format";
import type { BizDashboardData } from "@/types/bizData";

interface SalesDashboardProps {
  data: BizDashboardData;
}

export function SalesDashboard({ data }: SalesDashboardProps) {
  const changeRate = formatChangeRate(data.monthOverMonthChange);
  const changeColor =
    changeRate.isPositive === null
      ? "text-text-secondary"
      : changeRate.isPositive
        ? "text-info"
        : "text-error";

  // 업종 내 위치 (매출 순위 %)
  const industrySalesRank = data.industryComparison.revenue;

  // 거래 건수와 평균 결제액
  const monthlyTransactionCount = data.monthlyTransactionCount;
  const avgTransactionAmount = data.avgTransactionAmount;

  return (
    <div className="flex flex-col gap-4 px-5 py-4">
      {/* 매출 메인 카드 */}
      <div className="bg-bg-surface rounded-xl p-5 border border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
            <BarChart3 size={18} className="text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-text-secondary">이번 달 매출</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-text-secondary">전월 대비</p>
          </div>
        </div>
        <div className="flex items-end justify-between">
          <p className="text-2xl font-bold text-text-primary">
            {formatCurrency(data.monthlyRevenue)}원
          </p>
          <div className="flex items-center gap-1">
            <p className={`text-lg font-bold ${changeColor}`}>{changeRate.text}</p>
            {changeRate.isPositive !== null && (
              changeRate.isPositive
                ? <ArrowUpRight size={16} className="text-info" />
                : <ArrowDownRight size={16} className="text-error" />
            )}
          </div>
        </div>
      </div>

      {/* 거래 현황 */}
      <div className="bg-bg-surface rounded-xl p-5 border border-gray-200">
        <h3 className="text-sm font-semibold text-text-primary mb-3">거래 현황</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              <Receipt size={16} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-text-secondary">월 거래 건수</p>
              <p className="text-base font-bold text-text-primary">
                {`${monthlyTransactionCount.toLocaleString()}건`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              <CreditCard size={16} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-text-secondary">건당 평균 결제액</p>
              <p className="text-base font-bold text-text-primary">
                {`${Math.round(avgTransactionAmount).toLocaleString()}원`}
              </p>
            </div>
          </div>
        </div>
        <p className="text-xs text-text-disabled mt-3">이번 달 결제 패턴을 한눈에 확인하세요.</p>
      </div>

      {/* 최근 6개월 매출 추이 (기존 RevenueLineChart 재활용) */}
      <div className="bg-bg-surface rounded-xl p-4 border border-gray-200">
        <RevenueLineChart data={data.revenueTrend} />
      </div>

      {/* 업종 내 위치 */}
      <div className="bg-bg-surface rounded-xl p-5 border border-gray-200">
        <h3 className="text-sm font-semibold text-text-primary mb-3">업종 내 위치</h3>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
            <TrendingUp size={20} className="text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-base font-bold text-text-primary">
              업종 내 매출 상위 {industrySalesRank}%
            </p>
            <p className="text-xs text-text-secondary mt-0.5">
              같은 업종 안에서 경쟁력이 좋은 편이에요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
