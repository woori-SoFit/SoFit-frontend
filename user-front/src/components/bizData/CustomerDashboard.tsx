/**
 * "손님들은 다시 찾아오고 있나요?" 카테고리 상세 화면
 *
 * 표시 데이터:
 * - 재방문/충성도: 재구매율, 리뷰 답글 비율, 정보 수정 횟수
 * - 리뷰/평점: 평균 평점, 리뷰 수, 긍정 리뷰 비율, 평점 추이 차트
 * - 배달앱: 배달앱 평점, 주문 수, 매출액
 * - 부가 정보: 온라인 예약 여부, SNS 운영 여부
 */
import { Heart, MessageCircle, Edit3, Star, ThumbsUp, Truck, ShoppingBag, Globe, Share2 } from "lucide-react";
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
      {/* 재방문/충성도 */}
      <div className="bg-bg-surface rounded-xl p-5 border border-border-default">
        <h3 className="text-sm font-semibold text-text-primary mb-3">재방문/충성도</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-9 h-9 rounded-lg bg-pink-50 flex items-center justify-center">
              <Heart size={18} className="text-pink-500" />
            </div>
            <p className="text-xs text-text-secondary text-center">재구매율</p>
            <p className="text-sm font-bold text-text-primary">
              {`${onlineReorderRate}%`}
            </p>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
              <MessageCircle size={18} className="text-blue-500" />
            </div>
            <p className="text-xs text-text-secondary text-center">답글 비율</p>
            <p className="text-sm font-bold text-text-primary">
              {`${onlineReplyRate}%`}
            </p>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
              <Edit3 size={18} className="text-green-500" />
            </div>
            <p className="text-xs text-text-secondary text-center">정보 수정</p>
            <p className="text-sm font-bold text-text-primary">
              {`${onlineInfoUpdateCount}회`}
            </p>
          </div>
        </div>
      </div>

      {/* 리뷰/평점 */}
      <div className="bg-bg-surface rounded-xl p-5 border border-border-default">
        <h3 className="text-sm font-semibold text-text-primary mb-3">리뷰/평점</h3>
        <div className="flex gap-4 mb-4">
          {/* 평점 정보 */}
          <div className="flex-1">
            <div className="flex items-center gap-1 mb-1">
              <Star size={16} className="text-warning fill-warning" />
              <span className="text-2xl font-bold text-text-primary">{averageRating}</span>
              <span className="text-xs text-text-secondary">/ 5.0</span>
            </div>
            <p className="text-xs text-text-secondary">리뷰 수 {reviewCount.toLocaleString()}개</p>
            {positiveReviewRatio > 0 && (
              <div className="flex items-center gap-1 mt-2">
                <ThumbsUp size={12} className="text-success" />
                <span className="text-xs text-success font-medium">긍정 리뷰 {positiveReviewRatio}%</span>
              </div>
            )}
          </div>
          {/* 평점 추이 차트 (기존 RatingLineChart 재활용) */}
          <div className="flex-1">
            <RatingLineChart data={ratingTrend} />
          </div>
        </div>
      </div>

      {/* 배달앱 */}
      <div className="bg-bg-surface rounded-xl p-5 border border-border-default">
        <h3 className="text-sm font-semibold text-text-primary mb-3">배달앱</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center">
              <Star size={18} className="text-orange-500" />
            </div>
            <p className="text-xs text-text-secondary text-center">평점</p>
            <p className="text-sm font-bold text-text-primary">
              {deliveryRating.toFixed(1)}
            </p>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
              <Truck size={18} className="text-indigo-500" />
            </div>
            <p className="text-xs text-text-secondary text-center">주문 수</p>
            <p className="text-sm font-bold text-text-primary">
              {`${deliveryOrderCount.toLocaleString()}건`}
            </p>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
              <ShoppingBag size={18} className="text-green-500" />
            </div>
            <p className="text-xs text-text-secondary text-center">매출액</p>
            <p className="text-sm font-bold text-text-primary">
              {`${formatCurrency(deliverySalesAmount)}원`}
            </p>
          </div>
        </div>
      </div>

      {/* 부가 정보 */}
      <div className="bg-bg-surface rounded-xl p-5 border border-border-default">
        <h3 className="text-sm font-semibold text-text-primary mb-3">부가 정보</h3>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
              <Globe size={16} className="text-purple-500" />
            </div>
            <p className="text-sm text-text-primary flex-1">온라인 예약</p>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${hasOnlineReservation ? "bg-success/10 text-success" : "bg-gray-100 text-text-disabled"}`}>
              {hasOnlineReservation ? "운영 중" : "미운영"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center shrink-0">
              <Share2 size={16} className="text-pink-500" />
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
