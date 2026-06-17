import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface RatingLineChartProps {
  data: Array<{ month: string; rating: number }>;
}

export function RatingLineChart({ data }: RatingLineChartProps) {
  if (data.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center h-[80px] gap-1">
        <p className="text-xs text-text-secondary text-center">평점을 모으는 중이에요</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={80}>
        <LineChart data={data} margin={{ top: 8, right: 4, left: -24, bottom: 0 }}>
          <XAxis
            dataKey="month"
            tick={{ fontSize: 8, fill: "var(--color-gray-500)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis domain={[3, 5]} hide />
          <Tooltip
            formatter={(value: number) => [`${value}점`, "평점"]}
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid var(--color-border-default)",
              fontSize: "11px",
            }}
          />
          <Line
            type="monotone"
            dataKey="rating"
            stroke="var(--color-secondary)"
            strokeWidth={2}
            dot={{ r: 2.5, fill: "var(--color-bg-surface)", stroke: "var(--color-secondary)", strokeWidth: 1.5 }}
            activeDot={{ r: 4, fill: "var(--color-secondary)" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
