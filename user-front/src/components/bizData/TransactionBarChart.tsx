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
import { formatYAxis } from "@/utils/format";

interface TransactionBarChartProps {
  data: Array<{ month: string; income: number; expense: number }>;
}

function formatTooltip(value: number): string {
  return `${value.toLocaleString("ko-KR")}원`;
}

export function TransactionBarChart({ data }: TransactionBarChartProps) {
  const sortedData = [...data];
  const monthLabel = data.length > 0 ? `최근 ${data.length}개월` : "";

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-text-primary">
          계좌 입출금{monthLabel ? ` (${monthLabel})` : ""}
        </h4>
        <span className="text-xs text-text-secondary">(단위: 원)</span>
      </div>
      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[180px] gap-1.5">
          <p className="text-sm font-medium text-text-secondary">입출금 자료를 모으는 중이에요</p>
          <p className="text-xs text-text-disabled">자료가 쌓이면 보여드릴게요</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={sortedData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barCategoryGap="30%">
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
              width={45}
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
              content={() => (
                <div className="flex items-center justify-center gap-4 text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: "var(--color-primary)" }} />
                    입금
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: "var(--color-gray-400)" }} />
                    출금
                  </span>
                </div>
              )}
            />
            <Bar dataKey="income" fill="var(--color-primary)" radius={[3, 3, 0, 0]} />
            <Bar dataKey="expense" fill="var(--color-gray-400)" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
