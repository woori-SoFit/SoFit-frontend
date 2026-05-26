import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface TransactionBarChartProps {
  data: Array<{ month: string; income: number; expense: number }>;
}

function formatYAxis(value: number): string {
  const man = Math.round(value / 10000);
  return man === 0 ? "0" : `${man.toLocaleString()}만`;
}

function formatTooltip(value: number): string {
  return `${value.toLocaleString("ko-KR")}원`;
}

export function TransactionBarChart({ data }: TransactionBarChartProps) {
  const monthLabel = data.length > 0 ? `최근 ${data.length}개월` : "";

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-text-primary">
          계좌 입출금 흐름{monthLabel ? ` (${monthLabel})` : ""}
        </h4>
        <span className="text-xs text-text-secondary">(단위: 원)</span>
      </div>
      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[180px] gap-1.5">
          <p className="text-sm font-medium text-text-secondary">입출금 데이터를 수집하는 중이에요</p>
          <p className="text-xs text-text-disabled">데이터가 쌓이면 표시돼요</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barCategoryGap="30%">
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
              formatter={(value: number, name: string) => [
                formatTooltip(value),
                name === "income" ? "입금" : "출금",
              ]}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid var(--color-border-default)",
                fontSize: "12px",
              }}
            />
            <Legend
              formatter={(value) => (value === "income" ? "입금" : "출금")}
              iconType="square"
              iconSize={10}
              wrapperStyle={{ fontSize: "12px" }}
            />
            <Bar dataKey="income" fill="var(--color-primary)" radius={[3, 3, 0, 0]} />
            <Bar dataKey="expense" fill="var(--color-gray-400)" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
