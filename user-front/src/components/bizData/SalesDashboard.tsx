/**
 * "이번 달 장사는 어땠나요?" 카테고리 상세 화면
 *
 * 표시 데이터:
 * - 이번 달 매출 + 전월 대비 증감률
 * - 포스/배달 매출 분리
 * - 월 결제 현황 (건수 + 평균 결제액)
 * - 요일별 평균 매출 바 차트
 * - 최근 6개월 매출 추이 라인 차트
 */
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { RevenueLineChart } from "./RevenueLineChart";
import { formatCurrency, formatChangeRate, formatYAxis, toMonthLabel } from "@/utils/format";
import type { BizDashboardData } from "@/types/bizData";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

interface SalesDashboardProps {
  data: BizDashboardData;
}

export function SalesDashboard({ data }: SalesDashboardProps) {
  const changeRate = formatChangeRate(data.monthlyRevenueGrowthRate);
  const changeColor =
    changeRate.isPositive === null
      ? "text-text-secondary"
      : changeRate.isPositive
        ? "text-info"
        : "text-error";

  // RevenueLineChart용 데이터 변환
  const revenueTrendChart = data.revenueTrend.map((t) => ({
    month: toMonthLabel(t.referenceMonth),
    amount: t.monthlyRevenue,
  }));

  // 요일별 평균 매출
  const dailyAvg = [
    { day: "월", value: data.avgRevenueMon },
    { day: "화", value: data.avgRevenueTue },
    { day: "수", value: data.avgRevenueWed },
    { day: "목", value: data.avgRevenueThu },
    { day: "금", value: data.avgRevenueFri },
    { day: "토", value: data.avgRevenueSat },
    { day: "일", value: data.avgRevenueSun },
  ];
  const maxDayValue = Math.max(...dailyAvg.map((d) => d.value));
  const hasDailyData = dailyAvg.some((d) => d.value > 0);

  // 포스/배달 비율
  const posRatio = data.monthlyRevenue > 0
    ? Math.round((data.posSalesAmount / data.monthlyRevenue) * 100)
    : 0;
  const deliveryRatio = data.monthlyRevenue > 0
    ? Math.round((data.deliverySalesAmount / data.monthlyRevenue) * 100)
    : 0;

  return (
    <div className="flex flex-col gap-4 px-5 py-4">
      {/* 이번 달 매출 메인 카드 */}
      <div className="bg-bg-surface rounded-xl p-5 border border-border-default">
        <p className="text-sm font-semibold text-text-primary mb-1">이번 달 매출</p>

        {/* 매출액 + 증감 배지 */}
        <div className="flex items-end justify-between mb-4">
          <p className="text-3xl font-bold text-text-primary">
            {formatCurrency(data.monthlyRevenue)}원
          </p>
          <div className="flex flex-col items-end">
            <span className="text-xs text-text-secondary">전월 대비</span>
            <div className="flex items-center gap-0.5">
              {changeRate.isPositive !== null && (
                changeRate.isPositive
                  ? <ArrowUpRight size={15} className="text-info" />
                  : <ArrowDownRight size={15} className="text-error" />
              )}
              <span className={`text-lg font-bold ${changeColor}`}>{changeRate.text}</span>
            </div>
          </div>
        </div>

        {/* 포스 / 배달 분리 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-text-secondary">포스 매출</p>
              <span className="text-xs font-semibold text-primary">{posRatio}%</span>
            </div>
            <p className="text-base font-bold text-text-primary">
              {formatCurrency(data.posSalesAmount)}원
            </p>
          </div>
          <div className="bg-orange-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-text-secondary">배달 매출</p>
              <span className="text-xs font-semibold text-orange-500">{deliveryRatio}%</span>
            </div>
            <p className="text-base font-bold text-text-primary">
              {formatCurrency(data.deliverySalesAmount)}원
            </p>
          </div>
        </div>
      </div>

      {/* 월 결제 현황 */}
      <div className="bg-bg-surface rounded-xl p-5 border border-border-default">
        <h3 className="text-sm font-semibold text-text-primary mb-3">월 결제 현황</h3>
        <div className="grid grid-cols-2 divide-x divide-border-default">
          <div className="pr-4">
            <p className="text-xs text-text-secondary mb-1">월 결제 건수</p>
            <p className="text-xl font-bold text-text-primary">
              {data.monthlyPaymentCount.toLocaleString()}
              <span className="text-sm font-medium text-text-secondary ml-1">건</span>
            </p>
          </div>
          <div className="pl-4">
            <p className="text-xs text-text-secondary mb-1">건당 평균</p>
            <p className="text-xl font-bold text-text-primary">
              {Math.round(data.avgPaymentAmount).toLocaleString()}
              <span className="text-sm font-medium text-text-secondary ml-1">원</span>
            </p>
          </div>
        </div>
      </div>

      {/* 요일별 평균 매출 */}
      {hasDailyData && (
        <div className="bg-bg-surface rounded-xl p-5 border border-border-default">
          <h3 className="text-sm font-semibold text-text-primary mb-4">요일별 평균 매출</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={dailyAvg} margin={{ top: 4, right: 4, left: 0, bottom: 0 }} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="4 2" stroke="var(--color-border-default)" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 12, fill: "var(--color-gray-500)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={formatYAxis}
                tick={{ fontSize: 10, fill: "var(--color-gray-500)" }}
                axisLine={false}
                tickLine={false}
                width={36}
              />
              <Tooltip
                formatter={(value: number) => [`${formatCurrency(value)}원`, "평균 매출"]}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid var(--color-border-default)",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {dailyAvg.map((entry) => {
                  const minValue = Math.min(...dailyAvg.map((d) => d.value));
                  const ratio = maxDayValue === minValue
                    ? 1
                    : (entry.value - minValue) / (maxDayValue - minValue);
                  // 낮은 값: #93c5fd(blue-300), 높은 값: #3b82f6(blue-500) 사이를 선형 보간
                  const r = Math.round(147 - ratio * (147 - 59));
                  const g = Math.round(197 - ratio * (197 - 130));
                  const b = Math.round(253 - ratio * (253 - 246));
                  return (
                    <Cell
                      key={entry.day}
                      fill={`rgb(${r},${g},${b})`}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-text-secondary text-center mt-1">
            가장 매출이 높은 요일은 <span className="font-semibold text-primary">
              {dailyAvg.find((d) => d.value === maxDayValue)?.day}요일
            </span>이에요
          </p>
        </div>
      )}

      {/* 최근 6개월 매출 추이 */}
      <div className="bg-bg-surface rounded-xl p-5 border border-border-default">
        <RevenueLineChart data={revenueTrendChart} />
      </div>
    </div>
  );
}
