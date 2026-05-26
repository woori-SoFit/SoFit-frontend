/**
 * My Biz Data 관련 타입 정의
 */
import type { LucideIcon } from "lucide-react";

/** My Biz Data 연결 상태 응답 */
export interface BizDataStatusResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: BizDataStatus | null;
}

/** My Biz Data 연결 상태 */
export interface BizDataStatus {
  /** My Biz Data 수집 완료 여부 */
  isConnected: boolean;
  /** 수집 완료 일시 (ISO 8601) */
  connectedAt: string | null;
}

/** 마이 비즈 데이터 수집 step */
export type BizDataCollectStep = "CERT_INFO" | "TERMS" | "LOADING";

/** 대시보드 데이터 */
export interface BizDashboardData {
  currentMonth: string;
  monthlyRevenue: number;
  monthOverMonthChange: number | null;
  cashFlow: number;
  netProfit: number;
  industryComparison: {
    industryName: string;
    revenue: number;
    profitability: number;
    stability: number;
  };
  revenueTrend: Array<{
    month: string;
    amount: number;
  }>;
  transactionFlow: Array<{
    month: string;
    income: number;
    expense: number;
  }>;
  loanBalance: number;
  loanRepaymentDate: string;
  review: {
    averageRating: number;
    reviewCount: number;
    ratingTrend: Array<{
      month: string;
      rating: number;
    }>;
  };
  customerRatio: {
    repurchaseRate: number;
    recommendCount: number;
  };
}

/** 데이터 수집 단계 아이템 */
export interface CollectStep {
  label: string;
  status: "pending" | "loading" | "done";
  icon: LucideIcon;
  /** 활성 상태(loading/done)일 때 아이콘 배경 Tailwind class */
  activeBg: string;
  /** 활성 상태(loading/done)일 때 아이콘 색상 Tailwind class */
  activeColor: string;
}
