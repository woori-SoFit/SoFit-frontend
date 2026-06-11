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

/** 사업자 정보 응답 */
export interface BusinessInfoResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: BusinessInfo | null;
}

/** 사업자 정보 */
export interface BusinessInfo {
  businessNumber: string;
  businessName: string;
  representativeName: string;
  residentNumber: string;
  openDate: string;
  businessCategory: string;
  businessType: string;
  businessAddress: string;
  isMybizConnected: boolean;
}

/** 대시보드 데이터 */
export interface BizDashboardData {
  referenceMonth: string;
  availableMonths: string[];
  /** 매출 관련 */
  monthlyRevenue: number;
  posSalesAmount: number;
  deliverySalesAmount: number;
  monthlyRevenueGrowthRate: number;
  monthlyPaymentCount: number;
  avgPaymentAmount: number;
  revenueTrend: Array<{
    referenceMonth: string;
    monthlyRevenue: number;
  }>;
  /** 요일별 평균 매출 */
  avgRevenueMon: number;
  avgRevenueTue: number;
  avgRevenueWed: number;
  avgRevenueThu: number;
  avgRevenueFri: number;
  avgRevenueSat: number;
  avgRevenueSun: number;
  /** 수익/지출 */
  estimatedProfit: number;
  monthlyOutflow: number;
  paymentFlowTrend: Array<{
    referenceMonth: string;
    monthlyRevenue: number;
    monthlyOutflow: number;
    estimatedProfit: number;
  }>;
  monthlyProfitGrowthRate: number;
  /** 리뷰/평점 */
  reviewRating: number;
  reviewCount: number;
  positiveReviewRatio: number;
  negativeReviewRatio: number;
  deliveryRating: number;
  hasOnlineReservation: boolean;
  hasSns: boolean;
  onlineReplyRate: number;
  /** 업종 비교 */
  industryName: string;
  industrySalesRank: number;
  industryProfitRank: number;
  industrySatisfactionRank: number;
  /** 상권 비교 */
  districtSalesRank: number;
  districtProfitRank: number;
  districtSatisfactionRank: number;
  /** 수익률/업종평균/상권평균 */
  monthlyProfitRate: number;
  industryAvgRevenue: number;
  industryAvgProfitRate: number;
  industryAvgReviewRating: number;
  districtAvgRevenue: number;
  districtAvgProfitRate: number;
  districtAvgReviewRating: number;
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
