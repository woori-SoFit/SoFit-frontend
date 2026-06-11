import type { MyBizData } from '@/types';

/**
 * My Biz Data 탭 mock 데이터
 * 이미지 디자인 기준으로 작성 (서아카페 / 카페 업종 가정)
 */
export const MOCK_MY_BIZ_DATA: MyBizData = {
  existingLoanCount: 1,

  // DSR
  annualIncome: 130_000_000,
  annualRepayment: 30_400_000,
  monthlyRepayment: 2_530_000,

  // 보유 대출 잔액
  totalLoanBalance: 15_000_000,

  // 운영 신뢰도
  businessAgeMonths: 18,
  vatFilingStatus: 'FILED',
  taxOverdue: false,
  insurancePaymentStatus: 'PAID',
  vatFilingDate: '2026-04-25',

  // 매출 추이 (최근 6개월)
  revenueTrend: [
    { referenceMonth: '2024-12', monthlyRevenue: 9_300_000 },
    { referenceMonth: '2025-01', monthlyRevenue: 10_200_000 },
    { referenceMonth: '2025-02', monthlyRevenue: 10_800_000 },
    { referenceMonth: '2025-03', monthlyRevenue: 12_100_000 },
    { referenceMonth: '2025-04', monthlyRevenue: 11_800_000 },
    { referenceMonth: '2025-05', monthlyRevenue: 11_500_000 },
  ],

  // 업종 평균 매출 추이 (최근 6개월)
  industryAvgRevenueTrend: [
    { referenceMonth: '2024-12', monthlyRevenue: 7_700_000 },
    { referenceMonth: '2025-01', monthlyRevenue: 8_000_000 },
    { referenceMonth: '2025-02', monthlyRevenue: 8_300_000 },
    { referenceMonth: '2025-03', monthlyRevenue: 8_600_000 },
    { referenceMonth: '2025-04', monthlyRevenue: 9_000_000 },
    { referenceMonth: '2025-05', monthlyRevenue: 9_200_000 },
  ],

  // 수익 추이 (최근 6개월)
  profitTrend: [
    { referenceMonth: '2024-12', profit: 2_300_000 },
    { referenceMonth: '2025-01', profit: 2_600_000 },
    { referenceMonth: '2025-02', profit: 2_800_000 },
    { referenceMonth: '2025-03', profit: 3_200_000 },
    { referenceMonth: '2025-04', profit: 3_100_000 },
    { referenceMonth: '2025-05', profit: 3_100_000 },
  ],

  // 업종/상권 비교
  industryComparison: {
    myRevenue: 11_500_000,
    industryAvgRevenue: 9_200_000,
    districtAvgRevenue: 9_800_000,
    myProfitRate: 27.0,
    industryAvgProfitRate: 19.8,
    districtAvgProfitRate: 21.3,
    industrySalesRank: 8.2,
    industryProfitRank: 12.5,
    industrySatisfactionRank: 15.3,
    districtSalesRank: 6.8,
    districtProfitRank: 10.2,
    districtSatisfactionRank: 11.7,
  },
};
