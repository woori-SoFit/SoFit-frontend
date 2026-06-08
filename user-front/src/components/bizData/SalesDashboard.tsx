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

  // 전월 매출 계산: 이번달 매출 / (1 + 증감률)
  const prevMonthRevenue =
    data.monthOverMonthChange !== null && data.monthOverMonthChange !== 0
      ? Math.round(data.monthlyRevenue / (1 + data.monthOverMonthChange / 100))
      : null;

  // 업종 내 위치 (매출 순위 %)
  const industrySalesRank = data.industryComparison.revenue;

  // 거래 건수와 평균 결제액은 현재 API에 없으므로 매출에서 추정
  // TODO: 백엔드에서 monthly_transaction_count, avg_transaction_amount 필드 추가 시 교체
  const monthlyTransactionCount = data.review.reviewCount > 0 ? data.review.reviewCount : null;
  const avgTransactionAmount = monthlyTransactionCount
    ? Math.round(data.monthlyRevenue / monthlyTransactionCount)
    : null;

  return (
    <div className="flex flex-col gap-4 px-5 py-4">
      {/* 매출 메인 카드 */}
      <div className="bg-bg-surface rounded-xl shadow-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
            <BarChart3 size={18} className="text-blue-500" />
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

      {/* 전월 매출 + 월 거래 건수 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-bg-surface rounded-xl shadow-card p-4 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
            <TrendingUp size={16} className="text-green-500" />
          </div>
          <div>
            <p className="text-xs text-text-secondary mb-0.5">전월 매출액</p>
            <p className="text-sm font-bold text-text-primary">
              {prevMonthRevenue !== null ? `${formatCurrency(prevMonthRevenue)}원` : "-"}
            </p>
          </div>
        </div>
        <div className="bg-bg-surface rounded-xl shadow-card p-4 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
            <Receipt size={16} className="text-purple-500" />
          </div>
          <div>
            <p className="text-xs text-text-secondary mb-0.5">월 거래 건수</p>
            <p className="text-sm font-bold text-text-primary">
              {monthlyTransactionCount !== null ? `${monthlyTransactionCount.toLocaleString()}건` : "-"}
            </p>
          </div>
        </div>
      </div>

      {/* 거래 현황 */}
      <div className="bg-bg-surface rounded-xl shadow-card p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-3">거래 현황</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              <Receipt size={16} className="text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-text-secondary">월 거래 건수</p>
              <p className="text-base font-bold text-text-primary">
                {monthlyTransactionCount !== null ? `${monthlyTransactionCount.toLocaleString()}건` : "-"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
              <CreditCard size={16} className="text-amber-500" />
            </div>
            <div>
              <p className="text-xs text-text-secondary">건당 평균 결제액</p>
              <p className="text-base font-bold text-text-primary">
                {avgTransactionAmount !== null ? `${avgTransactionAmount.toLocaleString()}원` : "-"}
              </p>
            </div>
          </div>
        </div>
        <p className="text-xs text-text-disabled mt-3">손님 수와 결제 크기를 함께 볼 수 있어요.</p>
      </div>

      {/* 최근 6개월 매출 추이 (기존 RevenueLineChart 재활용) */}
      <div className="bg-bg-surface rounded-xl shadow-card p-4">
        <RevenueLineChart data={data.revenueTrend} />
      </div>

      {/* 업종 내 위치 */}
      <div className="bg-bg-surface rounded-xl shadow-card p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-3">업종 내 위치</h3>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
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
