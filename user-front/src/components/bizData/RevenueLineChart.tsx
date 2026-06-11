import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { formatYAxis } from "@/utils/format";

interface RevenueLineChartProps {
  data: Array<{ month: string; amount: number }>;
}

function formatTooltip(value: number): string {
  return `${value.toLocaleString("ko-KR")}원`;
}

function ChartEmpty({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-[180px] gap-1.5">
      <p className="text-sm font-medium text-text-secondary">{label}</p>
      <p className="text-xs text-text-disabled">자료가 2개월 이상 쌓이면 보여드릴게요</p>
    </div>
  );
}

export function RevenueLineChart({ data }: RevenueLineChartProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-text-primary">월별 매출</h4>
        <span className="text-xs text-text-secondary">(단위: 원)</span>
      </div>
      {data.length < 2 ? (
        <ChartEmpty label="매출 자료를 모으는 중이에요" />
      ) : (
      <ResponsiveContainer width="100%" height={180}>
          <LineChart data={data} margin={{ top: 16, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="4 2" stroke="var(--color-border-default)" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: "var(--color-gray-500)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={formatYAxis}
              tick={{ fontSize: 10, fill: "var(--color-gray-500)" }}
              axisLine={false}
              tickLine={false}
              width={42}
            />
            <Tooltip
              formatter={(value: number) => [formatTooltip(value), "매출"]}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid var(--color-border-default)",
                fontSize: "12px",
              }}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="var(--color-primary)"
              strokeWidth={2.5}
              dot={{ r: 3.5, fill: "var(--color-bg-surface)", stroke: "var(--color-primary)", strokeWidth: 2 }}
              activeDot={{ r: 5, fill: "var(--color-primary)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
