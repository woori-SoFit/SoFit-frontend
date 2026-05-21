import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface RevenueLineChartProps {
  data: Array<{ month: string; amount: number }>;
}

function formatYAxis(value: number): string {
  const man = Math.round(value / 10000);
  return man === 0 ? "0" : `${man.toLocaleString()}만`;
}

function formatTooltip(value: number): string {
  return `${value.toLocaleString("ko-KR")}원`;
}

export function RevenueLineChart({ data }: RevenueLineChartProps) {
  if (data.length === 0) return null;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-text-primary">월별 매출 추이</h4>
        <span className="text-xs text-text-secondary">(단위: 원)</span>
      </div>
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
            width={40}
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
    </div>
  );
}
