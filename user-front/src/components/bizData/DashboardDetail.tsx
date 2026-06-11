import type { BizDashboardData } from "@/types/bizData";
import { toMonthLabel } from "@/utils/format";
import { RevenueLineChart } from "./RevenueLineChart";
import { TransactionBarChart } from "./TransactionBarChart";

interface DashboardDetailProps {
  data: BizDashboardData;
}

function StarRating({ rating }: { rating: number }) {
  const clamped = Math.max(0, Math.min(5, rating));

  return (
    <div className="flex items-center gap-0.5" aria-label={`평점 ${clamped} / 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        // i번째 별의 채움 비율 (0~1) — 4.3이면 [1, 1, 1, 1, 0.3]
        const fill = Math.max(0, Math.min(1, clamped - i));
        return <SingleStar key={i} fillRatio={fill} />;
      })}
    </div>
  );
}

function StarShape({ filled }: { filled: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-warning shrink-0 block"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function SingleStar({ fillRatio }: { fillRatio: number }) {
  return (
    <div className="relative" style={{ width: 16, height: 16 }}>
      {/* 빈 별 (배경) */}
      <StarShape filled={false} />
      {/* 채워진 별 — 비율만큼 좌측 클립 */}
      {fillRatio > 0 && (
        <div
          className="absolute top-0 left-0 h-full overflow-hidden pointer-events-none"
          style={{ width: `${fillRatio * 100}%` }}
        >
          <StarShape filled />
        </div>
      )}
    </div>
  );
}

export function DashboardDetail({ data }: DashboardDetailProps) {
  const revenueTrendChart = data.revenueTrend.map((t) => ({
    month: toMonthLabel(t.referenceMonth),
    amount: t.monthlyRevenue,
  }));
  const transactionFlowChart = data.paymentFlowTrend.map((t) => ({
    month: toMonthLabel(t.referenceMonth),
    income: t.monthlyRevenue,
    expense: t.monthlyOutflow,
  }));

  return (
    <section className="px-5 pb-8 flex flex-col gap-5">
      {/* 월별 매출 — 자료가 없으면 박스 자체 숨김 */}
      {revenueTrendChart.length > 0 && (
        <div className="bg-bg-surface rounded-xl shadow-card p-4">
          <RevenueLineChart data={revenueTrendChart} />
        </div>
      )}

      {/* 계좌 입출금 — 자료가 없으면 박스 자체 숨김 */}
      {transactionFlowChart.length > 0 && (
        <div className="bg-bg-surface rounded-xl shadow-card p-4">
          <TransactionBarChart data={transactionFlowChart} />
        </div>
      )}

      {/* 리뷰/평점 현황 */}
      <div className="bg-bg-surface rounded-xl shadow-card p-4">
        <h3 className="text-sm font-semibold text-text-primary mb-2">리뷰/평점 현황</h3>
        <p className="text-xs text-text-secondary mb-1">평균 평점</p>
        <div className="flex items-baseline gap-1 mb-1">
          <span className="text-2xl font-bold text-text-primary">{data.reviewRating.toFixed(1)}</span>
          <span className="text-xs text-text-secondary">/ 5.0</span>
        </div>
        <StarRating rating={data.reviewRating} />
        <p className="text-xs text-text-secondary mt-2">
          리뷰 수 {data.reviewCount.toLocaleString()}개
        </p>
      </div>
    </section>
  );
}
