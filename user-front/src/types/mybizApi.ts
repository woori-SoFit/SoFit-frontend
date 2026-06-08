/**
 * 마이비즈 API 백엔드 응답 타입 정의
 */

export interface MyBizApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export interface MyBizDashboardResult {
  referenceMonth: string;
  monthlyRevenue: number;
  monthlyRevenueGrowthRate: number | null;
  prevMonthRevenue: number | null;
  monthlyTransactionCount: number;
  avgTransactionAmount: number;
  cashFlow: number;
  estimatedProfit: number;
  industryCompare: {
    industryName: string;
    industrySalesRank: number;
    industryProfitRank: number;
    industryStabilityRank: number;
    industrySalesRankChange: number | null;
    industryProfitRankChange: number | null;
    industryStabilityRankChange: number | null;
  };
  revenueTrend: Array<{ referenceMonth: string; monthlyRevenue: number }>;
  cashFlowTrend: Array<{
    referenceMonth: string;
    monthlyInflow: number;
    monthlyOutflow: number;
  }>;
  ratingTrend: Array<{ referenceMonth: string; reviewRating: number }>;
  reviewRating: number;
  reviewCount: number;
  onlineReorderRate: number;
  onlineReplyRate: number;
  onlineInfoUpdateCount: number;
  positiveReviewRatio: number;
  deliveryRating: number;
  deliveryOrderCount: number;
  deliverySalesAmount: number;
  hasOnlineReservation: boolean;
  hasSns: boolean;
  availableMonths: string[];
}

export interface LoanExecutionResult {
  executedAmount: number;
}
