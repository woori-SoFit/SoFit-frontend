/**
 * "손님들은 다시 찾아오고 있나요?" 카테고리 상세 화면
 *
 * 기존 데이터 활용하여 풍성한 UI 구성:
 * - 상단 2열: 재구매율(도넛 시각화) + 평점(별점)
 * - 3열 지표 카드: 리뷰 수, 배달 주문 수, 배달 매출
 * - 3열 지표 카드: 답글 비율, 정보 수정, 긍정 리뷰
 * - 평점 추이 차트 (기존 RatingLineChart 재활용)
 * - 부가 정보: 온라인 예약, SNS
 */
import { Star, MessageCircle, Truck, ShoppingBag, ThumbsUp, Edit3, Globe, Share2 } from "lucide-react";
import { RatingLineChart } from "./RatingLineChart";
import { formatCurrency } from "@/utils/format";
import type { BizDashboardData } from "@/types/bizData";

interface CustomerDashboardProps {
  data: BizDashboardData;
}

export function CustomerDashboard({ data }: CustomerDashboardProps) {
  const { averageRating, reviewCount, ratingTrend } = data.review;
  const {
    onlineReorderRate,
    onlineReplyRate,
    onlineInfoUpdateCount,
    positiveReviewRatio,
    deliveryRating,
    deliveryOrderCount,
    deliverySalesAmount,
    hasOnlineReservation,
    hasSns,
  } = data.customer;

  return (
    <div className="flex flex-col gap-4 px-5 py-4">
      {/* 상단 2열: 재방문율 + 평점 */}
      <div className="grid grid-cols-2 gap-3">
        {/* 재구매율 — 도넛 시각화 */}
        <div className="bg-bg-surface rounded-xl p-4 border border-border-default flex flex-col items-center">
          <p className="text-xs text-text-secondary mb-2 self-start font-medium">재방문율</p>
          <div className="relative w-20 h-20 mb-2">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle cx="18" cy="18" r="14" fill="none" stroke="var(--color-gray-200)" strokeWidth="4" />
              <circle
                cx="18" cy="18" r="14" fill="none"
                stroke="var(--color-primary)"
                strokeWidth="4"
                strokeDasharray={`${onlineReorderRate * 0.88} 88`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-text-primary">{onlineReorderRate}%</span>
            </div>
          </div>
        </div>

        {/* 평점 */}
        <div className="bg-bg-surface rounded-xl p-4 border border-border-default flex flex-col items-center">
          <p className="text-xs text-text-secondary mb-2 self-start font-medium">평균 평점</p>
          <div className="flex items-center gap-1 mb-1">
            <Star size={20} className="text-warning fill-warning" />
            <span className="text-2xl font-bold text-text-primary">{averageRating}</span>
            <span className="text-xs text-text-secondary">/ 5.0</span>
          </div>
          <div className="flex items-center gap-0.5 mb-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={12}
                className={i < Math.round(averageRating) ? "text-warning fill-warning" : "text-gray-200"}
              />
            ))}
          </div>
          {deliveryRating > 0 && (
            <p className="text-xs text-text-disabled mt-1">배달앱 {deliveryRating.toFixed(1)}</p>
          )}
        </div>
      </div>

      {/* 3열 지표: 리뷰 수, 배달 주문, 배달 매출 */}
      <div className="grid grid-cols-3 gap-2">
        <StatCard icon={MessageCircle} iconBg="bg-blue-50" iconColor="text-primary" label="리뷰 수" value={`${reviewCount.toLocaleString()}건`} />
        <StatCard icon={Truck} iconBg="bg-blue-50" iconColor="text-primary" label="배달 주문" value={`${deliveryOrderCount.toLocaleString()}건`} />
        <StatCard icon={ShoppingBag} iconBg="bg-blue-50" iconColor="text-primary" label="배달 매출" value={`${formatCurrency(deliverySalesAmount)}원`} />
      </div>

      {/* 3열 지표: 답글 비율, 정보 수정, 긍정 리뷰 */}
      <div className="grid grid-cols-3 gap-2">
        <StatCard icon={MessageCircle} iconBg="bg-blue-50" iconColor="text-primary" label="답글 비율" value={`${onlineReplyRate}%`} />
        <StatCard icon={Edit3} iconBg="bg-blue-50" iconColor="text-primary" label="정보 수정" value={`${onlineInfoUpdateCount}회`} />
        <StatCard icon={ThumbsUp} iconBg="bg-blue-50" iconColor="text-primary" label="긍정 리뷰" value={`${positiveReviewRatio}%`} />
      </div>

      {/* 평점 추이 차트 */}
      <div className="bg-bg-surface rounded-xl p-4 border border-border-default">
        <h3 className="text-sm font-semibold text-text-primary mb-2">평점 추이</h3>
        <RatingLineChart data={ratingTrend} />
      </div>

      {/* 부가 정보 */}
      <div className="bg-bg-surface rounded-xl p-4 border border-border-default">
        <h3 className="text-sm font-semibold text-text-primary mb-3">온라인 활동</h3>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              <Globe size={16} className="text-primary" />
            </div>
            <p className="text-sm text-text-primary flex-1">온라인 예약</p>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${hasOnlineReservation ? "bg-success/10 text-success" : "bg-gray-100 text-text-disabled"}`}>
              {hasOnlineReservation ? "운영 중" : "미운영"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              <Share2 size={16} className="text-primary" />
            </div>
            <p className="text-sm text-text-primary flex-1">SNS 운영</p>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${hasSns ? "bg-success/10 text-success" : "bg-gray-100 text-text-disabled"}`}>
              {hasSns ? "운영 중" : "미운영"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** 작은 지표 카드 컴포넌트 — 아이콘 좌상단, 라벨 옆, 값 아래 */
function StatCard({ icon: Icon, iconBg, iconColor, label, value }: {
  icon: typeof Star;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-bg-surface rounded-xl px-3 py-4 border border-border-default">
      <div className="flex items-center gap-1.5 mb-2">
        <div className={`w-6 h-6 rounded-md ${iconBg} flex items-center justify-center shrink-0`}>
          <Icon size={12} className={iconColor} />
        </div>
        <p className="text-xs text-text-secondary whitespace-nowrap">{label}</p>
      </div>
      <p className="text-sm font-bold text-text-primary whitespace-nowrap">{value}</p>
    </div>
  );
}
