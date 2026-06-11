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
  availableMonths: string[];
  monthlyRevenue: number;
  posSalesAmount: number;
  deliverySalesAmount: number;
  monthlyRevenueGrowthRate: number | null;
  monthlyPaymentCount: number;
  avgPaymentAmount: number;
  revenueTrend: Array<{ referenceMonth: string; monthlyRevenue: number }>;
  avgRevenueMon: number;
  avgRevenueTue: number;
  avgRevenueWed: number;
  avgRevenueThu: number;
  avgRevenueFri: number;
  avgRevenueSat: number;
  avgRevenueSun: number;
  estimatedProfit: number;
  monthlyOutflow: number;
  paymentFlowTrend: Array<{
    referenceMonth: string;
    monthlyRevenue: number;
    monthlyOutflow: number;
    estimatedProfit: number;
  }>;
  monthlyProfitGrowthRate: number | null;
  reviewRating: number;
  reviewCount: number;
  positiveReviewRatio: number;
  negativeReviewRatio: number;
  deliveryRating: number;
  hasOnlineReservation: boolean;
  hasSns: boolean;
  onlineReplyRate: number;
  industryName: string;
  industrySalesRank: number;
  industryProfitRank: number;
  industrySatisfactionRank: number;
  districtSalesRank: number;
  districtProfitRank: number;
  districtSatisfactionRank: number;
  monthlyProfitRate: number;
  industryAvgRevenue: number;
  industryAvgProfitRate: number;
  industryAvgReviewRating: number;
  districtAvgRevenue: number;
  districtAvgProfitRate: number;
  districtAvgReviewRating: number;
}

export interface LoanExecutionResult {
  executedAmount: number;
}
