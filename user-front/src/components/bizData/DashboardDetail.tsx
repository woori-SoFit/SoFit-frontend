import type { BizDashboardData } from "@/types/bizData";
import { formatCurrency } from "./DashboardSummary";
import { RevenueLineChart } from "./RevenueLineChart";
import { TransactionBarChart } from "./TransactionBarChart";
import { RatingLineChart } from "./RatingLineChart";

interface DashboardDetailProps {
  data: BizDashboardData;
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < full || (i === full && half);
        return (
          <svg key={i} width="16" height="16" viewBox="0 0 24 24"
            fill={filled ? "currentColor" : "none"}
            stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
            className="text-warning"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        );
      })}
    </div>
  );
}

export function DashboardDetail({ data }: DashboardDetailProps) {
  return (
    <section className="px-5 pb-8 flex flex-col gap-5">
      {/* 월별 매출 추이 */}
      <div className="bg-bg-surface rounded-xl shadow-card p-4">
        <RevenueLineChart data={data.revenueTrend} />
      </div>

      {/* 계좌 입출금 흐름 */}
      <div className="bg-bg-surface rounded-xl shadow-card p-4">
        <TransactionBarChart data={data.transactionFlow} />
      </div>

      {/* 대출 현황 — 2열 */}
      <div className="bg-bg-surface rounded-xl shadow-card p-4">
        <h3 className="text-sm font-semibold text-text-primary mb-3">대출 현황</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-text-secondary mb-1">대출 잔액</p>
            <p className="text-sm font-bold text-text-primary">{formatCurrency(data.loanBalance)}원</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary mb-1">다음 상환일</p>
            <p className="text-sm font-bold text-text-primary">{data.loanRepaymentDate}</p>
          </div>
        </div>
      </div>

      {/* 리뷰/평점 현황 + 리뷰 추이 — 나란히 */}
      <div className="bg-bg-surface rounded-xl shadow-card p-4">
        <div className="flex gap-4">
          {/* 왼쪽: 평점 정보 */}
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-text-primary mb-2">리뷰/평점 현황</h3>
            <p className="text-xs text-text-secondary mb-1">평균 평점</p>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-2xl font-bold text-text-primary">{data.review.averageRating}</span>
              <span className="text-xs text-text-secondary">/ 5.0</span>
            </div>
            <StarRating rating={data.review.averageRating} />
            <p className="text-xs text-text-secondary mt-2">
              리뷰 수 {formatCurrency(data.review.reviewCount)}개
            </p>
          </div>

          {/* 오른쪽: 평점 추이 차트 */}
          <div className="flex-1 flex flex-col">
            <h3 className="text-sm font-semibold text-text-primary mb-2">리뷰 추이</h3>
            <div className="flex-1">
              <RatingLineChart data={data.review.ratingTrend} />
            </div>
          </div>
        </div>
      </div>

      {/* 재구매율 + 주문 건수 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-bg-surface rounded-xl shadow-card p-4">
          <p className="text-xs text-text-secondary mb-1">재구매율(추정)</p>
          <p className="text-lg font-bold text-text-primary">{data.customerRatio.repurchaseRate}%</p>
        </div>
        <div className="bg-bg-surface rounded-xl shadow-card p-4">
          <p className="text-xs text-text-secondary mb-1">추천 건수(추정)</p>
          <p className="text-lg font-bold text-text-primary">
            {formatCurrency(data.customerRatio.recommendCount)}건
          </p>
        </div>
      </div>
    </section>
  );
}
