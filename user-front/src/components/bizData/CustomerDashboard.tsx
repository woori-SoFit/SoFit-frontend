/**
 * "손님들은 다시 찾아오고 있나요?" 카테고리 상세 화면
 *
 * 사용 데이터:
 * - reviewRating: 평균 평점
 * - reviewCount: 리뷰 수
 * - positiveReviewRatio: 긍정 리뷰 비율
 * - negativeReviewRatio: 부정 리뷰 비율
 * - deliveryRating: 배달앱 평점
 * - hasOnlineReservation: 온라인 예약 여부
 * - hasSns: SNS 운영 여부
 * - onlineReplyRate: 리뷰 답글 비율
 */
import { Star, ThumbsUp, MessageCircle, ThumbsDown, Globe, Share2 } from "lucide-react";
import { formatCount, formatPercent } from "@/utils/format";
import type { BizDashboardData } from "@/types/bizData";

interface CustomerDashboardProps {
  data: BizDashboardData;
}

export function CustomerDashboard({ data }: CustomerDashboardProps) {
  const {
    reviewRating,
    reviewCount,
    positiveReviewRatio,
    negativeReviewRatio,
    deliveryRating,
    onlineReplyRate,
    hasOnlineReservation,
    hasSns,
  } = data;

  return (
    <div className="flex flex-col gap-4 px-5 py-4">
      {/* 평균 평점 카드 */}
      <div className="bg-bg-surface rounded-xl p-5 border border-border-default">
        <p className="text-sm font-medium text-text-secondary mb-3">평균 평점</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star size={28} className="text-warning fill-warning" />
            <span className="text-4xl font-bold text-text-primary">{reviewRating.toFixed(1)}</span>
            <span className="text-sm text-text-secondary self-end mb-1">/ 5.0</span>
          </div>
          <div className="flex items-center gap-0.5 pr-2">
            {Array.from({ length: 5 }).map((_, i) => {
              // 소수점 반영: 4.7이면 i=0~3은 full, i=4는 70% 채움
              const fill = Math.min(1, Math.max(0, reviewRating - i));
              return (
                <div key={i} className="relative w-5 h-5">
                  {/* 빈 별 (배경) */}
                  <Star size={20} className="absolute inset-0 text-gray-200" />
                  {/* 채워진 별 (clip으로 비율 조절) */}
                  {fill > 0 && (
                    <div className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                      <Star size={20} className="text-warning fill-warning" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        {deliveryRating > 0 && (
          <p className="text-sm text-text-disabled mt-3">배달앱 {deliveryRating.toFixed(1)}</p>
        )}
      </div>

      {/* 3열 지표: 리뷰 수, 긍정 리뷰, 부정 리뷰 */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-bg-surface rounded-xl p-3 border border-border-default flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <MessageCircle size={16} className="text-primary" />
          </div>
          <p className="text-xs text-text-secondary font-medium mb-1">리뷰 수</p>
          <p className="text-base font-bold text-text-primary">{formatCount(reviewCount, "건")}</p>
        </div>
        <div className="bg-bg-surface rounded-xl p-3 border border-border-default flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <ThumbsUp size={16} className="text-primary" />
          </div>
          <p className="text-xs text-text-secondary font-medium mb-1">긍정 리뷰</p>
          <p className="text-base font-bold text-text-primary">{formatPercent(positiveReviewRatio)}</p>
        </div>
        <div className="bg-bg-surface rounded-xl p-3 border border-border-default flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <ThumbsDown size={16} className="text-primary" />
          </div>
          <p className="text-xs text-text-secondary font-medium mb-1">부정 리뷰</p>
          <p className="text-base font-bold text-text-primary">{formatPercent(negativeReviewRatio)}</p>
        </div>
      </div>

      {/* 온라인 활동 카드 */}
      <div className="bg-bg-surface rounded-xl p-5 border border-border-default">
        <h3 className="font-semibold text-text-primary mb-4">온라인 활동</h3>
        <div className="flex flex-col gap-4">
          {/* 답글 비율 */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <MessageCircle size={18} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-text-primary">답글 비율</p>
              <p className="text-xs text-text-disabled">손님 문의에 대한 답변 비율</p>
            </div>
            <span className="text-base font-bold text-text-primary">{formatPercent(onlineReplyRate)}</span>
          </div>

          {/* 온라인 예약 */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Globe size={18} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-text-primary">온라인 예약</p>
              <p className="text-xs text-text-disabled">온라인 예약 운영 여부</p>
            </div>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${hasOnlineReservation ? "bg-success/10 text-success" : "bg-gray-100 text-text-disabled"}`}>
              {hasOnlineReservation ? "운영 중" : "미운영"}
            </span>
          </div>

          {/* SNS 운영 */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Share2 size={18} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-text-primary">SNS 운영</p>
              <p className="text-xs text-text-disabled">SNS 운영 여부</p>
            </div>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${hasSns ? "bg-success/10 text-success" : "bg-gray-100 text-text-disabled"}`}>
              {hasSns ? "운영 중" : "미운영"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
