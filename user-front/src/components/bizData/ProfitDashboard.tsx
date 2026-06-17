/**
 * "실제로 얼마나 남았나요?" 카테고리 상세 화면
 *
 * 사용 데이터 (BizDashboardData):
 * - estimatedProfit: 추정 순이익
 * - monthlyRevenue: 매출 (paymentFlowTrend 마지막 항목)
 * - monthlyOutflow: 비용
 * - paymentFlowTrend: 최근 N개월 매출/비용/순이익 흐름
 * - monthlyProfitGrowthRate: 순이익 전월 대비 증감률
 *
 * UI 구성:
 * 1. 이번 달 순이익 (큰 숫자) + 매출/비용 하위 행
 * 2. 최근 N개월 손익 흐름 차트 (매출 Bar + 비용 Bar + 순이익 Line)
 * 3. 순이익 증감 배너 (전월 대비)
 */
import { Store, Coins, TrendingUp, TrendingDown } from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { formatCurrency, formatChangeRate, formatYAxis } from "@/utils/format";
import type { BizDashboardData } from "@/types/bizData";

interface ProfitDashboardProps {
  data: BizDashboardData;
}

export function ProfitDashboard({ data }: ProfitDashboardProps) {
  const { estimatedProfit, monthlyProfitGrowthRate, paymentFlowTrend } = data;

  // 순이익 증감률
  const profitChange = formatChangeRate(monthlyProfitGrowthRate);
  const isPositive = profitChange.isPositive;

  // 차트 데이터 변환
  const chartData = paymentFlowTrend.map((item) => {
    const monthNum = parseInt(item.referenceMonth.split("-")[1], 10);
    return {
      month: `${monthNum}월`,
      매출: item.monthlyRevenue,
      비용: item.monthlyOutflow,
      순이익: item.estimatedProfit,
    };
  });

  // 최근(마지막) 항목에서 매출/비용 표시
  const latest = paymentFlowTrend.length > 0
    ? paymentFlowTrend[paymentFlowTrend.length - 1]
    : null;

  // 전월 순이익 (증감 배너 부연설명용)
  const prevProfit = paymentFlowTrend.length >= 2
    ? paymentFlowTrend[paymentFlowTrend.length - 2].estimatedProfit
    : null;
  const profitDiff = prevProfit !== null
    ? estimatedProfit - prevProfit
    : null;

  return (
    <div className="flex flex-col gap-4 px-5 py-4">
      {/* 이번 달 순이익 메인 카드 */}
      <div className="bg-bg-surface rounded-xl p-5 border border-border-default">
        <p className="text-sm text-text-secondary text-center mb-1">이번 달 순이익</p>
        <p className="text-3xl font-bold text-text-primary text-center mb-1">
          {formatCurrency(estimatedProfit)}원
        </p>
        {profitChange.isPositive !== null && (
          <p className={`text-sm font-medium text-center mb-4 ${profitChange.isPositive ? "text-success" : "text-orange-500"}`}>
            전월 대비 {profitChange.text}
          </p>
        )}
        {profitChange.isPositive === null && <div className="mb-4" />}

        {/* 매출 / 비용 하위 행 */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-bg-base">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Store size={16} className="text-primary" />
              </div>
              <span className="text-sm font-medium text-text-primary">매출</span>
            </div>
            <span className="text-sm font-bold text-text-primary">
              {latest ? `${formatCurrency(latest.monthlyRevenue)}원` : "-"}
            </span>
          </div>

          <div className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-bg-base">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Coins size={16} className="text-primary" />
              </div>
              <div>
                <span className="text-sm font-medium text-text-primary">비용</span>
                <p className="text-xs text-text-disabled">고정비 포함</p>
              </div>
            </div>
            <span className="text-sm font-bold text-text-primary">
              {latest ? `${formatCurrency(latest.monthlyOutflow)}원` : "-"}
            </span>
          </div>
        </div>
      </div>

      {/* 최근 N개월 손익 흐름 차트 */}
      {chartData.length > 0 && (
        <div className="bg-bg-surface rounded-xl px-4 py-5 border border-border-default">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-text-primary">
              최근 {chartData.length}개월 손익 흐름
            </h4>
            <span className="text-xs text-text-secondary">금액(원)</span>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <ComposedChart data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }} barCategoryGap="25%">
              <CartesianGrid strokeDasharray="4 2" stroke="var(--color-border-default)" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "var(--color-gray-500)" }}
                axisLine={false}
                tickLine={false}
              />
              {/* 왼쪽 Y축: 매출/비용 */}
              <YAxis
                yAxisId="left"
                tickFormatter={formatYAxis}
                tick={{ fontSize: 10, fill: "var(--color-gray-700, #374151)" }}
                axisLine={false}
                tickLine={false}
                width={50}
              />
              {/* 오른쪽 Y축: 순이익 */}
              <YAxis
                yAxisId="right"
                orientation="right"
                tickFormatter={formatYAxis}
                tick={{ fontSize: 10, fill: "#374151" }}
                axisLine={false}
                tickLine={false}
                width={50}
              />
              <Tooltip
                formatter={(value: number, name: string) => [
                  <span style={{ color: "#111", fontWeight: 600 }}>{formatCurrency(value)}원</span>,
                  name,
                ]}
                labelStyle={{ fontWeight: 700, color: "#111" }}
                itemStyle={{ fontWeight: 600, color: "#111" }}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid var(--color-border-default)",
                  fontSize: "12px",
                }}
              />
              <Legend
                content={() => (
                  <div className="flex items-center justify-center gap-4 mt-2 text-xs">
                    <span className="flex items-center gap-1.5">
                      <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: "var(--color-primary)" }} />
                      매출
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: "var(--color-gray-300)" }} />
                      비용
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="inline-block w-2 h-0.5 rounded" style={{ background: "var(--color-secondary)" }} />
                      순이익
                    </span>
                  </div>
                )}
              />
              <Bar yAxisId="left" dataKey="매출" fill="var(--color-primary)" radius={[3, 3, 0, 0]} />
              <Bar yAxisId="left" dataKey="비용" fill="var(--color-gray-300)" radius={[3, 3, 0, 0]} />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="순이익"
                stroke="var(--color-secondary)"
                strokeWidth={2}
                dot={{ r: 4, fill: "var(--color-bg-surface)", stroke: "var(--color-secondary)", strokeWidth: 2 }}
                activeDot={{ r: 5, fill: "var(--color-secondary)" }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* 순이익 증감 배너 */}
      {isPositive !== null && (
        <div className={`rounded-xl p-4 flex items-start gap-3 ${isPositive ? "bg-primary/5" : "bg-error/5"}`}>
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${isPositive ? "bg-primary/10" : "bg-error/10"}`}>
            {isPositive
              ? <TrendingUp size={18} className="text-primary" />
              : <TrendingDown size={18} className="text-error" />
            }
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-text-primary">
              {profitDiff !== null
                ? <>순이익이 지난달보다 {isPositive ? "증가" : "감소"}했어요</>
                : <>이번 달 순이익이 발생했어요</>
              }
            </p>
            <p className="text-xs text-text-secondary mt-0.5">
              {latest && (
                <>
                  {parseInt(latest.referenceMonth.split("-")[1], 10)}월 순이익은 <span className="font-bold">{formatCurrency(estimatedProfit)}원</span>
                  {profitDiff !== null ? (
                    <>으로,<br />지난달보다 <span className="font-bold">{formatCurrency(Math.abs(profitDiff))}원</span> {isPositive ? "증가" : "감소"}했어요.</>
                  ) : (
                    <>이에요. 좋은 출발이에요!</>
                  )}
                </>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
