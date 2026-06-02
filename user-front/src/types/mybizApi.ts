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
  cashFlow: number;
  estimatedProfit: number;
  industryCompare: {
    industryName: string;
    industrySalesRank: number;
    industryProfitRank: number;
    industryStabilityRank: number;
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
  availableMonths: string[];
}

export interface LoanExecutionResult {
  executedAmount: number;
}
