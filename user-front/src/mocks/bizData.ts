/**
 * 마이 비즈 데이터 Mock 데이터
 *
 * TODO: API 연동 완료 후 이 파일 삭제
 */
import type { TermsItem } from "@/types/common";
import type { BizDashboardData, CollectStep } from "@/types/bizData";
import { Home, CreditCard, Landmark, MapPin, Star, FileText } from "lucide-react";

/** 마이 비즈 데이터 연결 상태 플래그 — TODO: API 연동 시 useQuery로 대체 */
export const MOCK_IS_CONNECTED: boolean = false;

/** 마이 비즈니스 데이터 약관 (필수 3개 + 선택 1개) */
export const MOCK_BIZ_DATA_TERMS: TermsItem[] = [
  {
    id: 301,
    title: "마이 비즈니스 데이터 수집 및 이용 동의",
    required: true,
    content:
      "1. 수집 항목\n사업자등록번호, 월별 매출액, 매입액, 부가세 신고 내역, 카드 매출 정보, 현금영수증 발행 내역\n\n2. 수집 목적\n소상공인 사업 현황 분석 및 성장S등급 산출을 위한 기초 데이터 수집\n\n3. 보유 기간\n서비스 이용 종료일로부터 5년간 보유 후 파기\n\n4. 제공받는 자\n우리은행 여신심사부, AI 분석 시스템\n\n5. 동의 거부 권리\n귀하는 본 동의를 거부할 권리가 있습니다. 다만, 동의를 거부하실 경우 마이 비즈니스 데이터 서비스 이용이 불가합니다.",
  },
  {
    id: 302,
    title: "개인정보 제3자 제공 동의",
    required: true,
    content:
      "1. 수집 항목\n성명, 사업자등록번호, 사업장 주소, 업종 정보, 매출 데이터, 신용 정보\n\n2. 수집 목적\n신용평가 및 대출 심사를 위한 제3자 정보 제공\n\n3. 보유 기간\n제공 목적 달성 시까지 또는 동의 철회 시까지\n\n4. 제공받는 자\n한국신용정보원, 나이스평가정보, 코리아크레딧뷰로\n\n5. 동의 거부 권리\n귀하는 본 동의를 거부할 권리가 있습니다. 다만, 동의를 거부하실 경우 성장S등급 산출 및 대출 서비스 이용이 제한될 수 있습니다.",
  },
  {
    id: 303,
    title: "개인정보 처리 위탁 동의",
    required: true,
    content:
      "1. 수집 항목\n사업자 매출 정보, 거래 내역, 업종 분류 데이터, 리뷰 및 평점 정보\n\n2. 수집 목적\n데이터 분석 처리 및 AI 기반 성장S등급 산출 업무 위탁\n\n3. 보유 기간\n위탁 계약 종료 시까지 또는 위탁 목적 달성 시까지\n\n4. 제공받는 자\n(주)소핏데이터랩 (데이터 분석), (주)클라우드시스템즈 (시스템 운영)\n\n5. 동의 거부 권리\n귀하는 본 동의를 거부할 권리가 있습니다. 다만, 동의를 거부하실 경우 마이 비즈니스 데이터 분석 서비스 이용이 불가합니다.",
  },
  {
    id: 304,
    title: "맞춤형 서비스 제공을 위한 정보 수신 동의",
    required: false,
    content:
      "1. 수집 항목\n사업 분석 결과, 업종 트렌드 정보, 매출 변동 알림 데이터\n\n2. 수집 목적\n맞춤형 금융 상품 안내, 사업 성장 팁 제공, 업종 동향 알림 발송\n\n3. 보유 기간\n동의 철회 시까지 또는 서비스 탈퇴 시까지\n\n4. 제공받는 자\n우리은행 마케팅부\n\n5. 동의 거부 권리\n귀하는 본 동의를 거부할 권리가 있으며, 거부하더라도 마이 비즈니스 데이터 서비스 이용에는 영향이 없습니다.",
  },
];

/**
 * 데이터 수집 단계 (6개)
 * 와이어프레임 ⑤번 캡처 상태: 앞 2개 done, 3번째 loading, 나머지 pending
 */
export const MOCK_BIZ_DATA_COLLECT_STEPS: CollectStep[] = [
  { label: "홈택스 연결 완료",       status: "done",    icon: Home,      activeBg: "bg-red-50",    activeColor: "text-red-500"   },
  { label: "카드 매출 수집 완료",     status: "done",    icon: CreditCard, activeBg: "bg-green-50",  activeColor: "text-green-600" },
  { label: "계좌 정보 분석 중",       status: "loading", icon: Landmark,  activeBg: "bg-blue-50",   activeColor: "text-blue-500"  },
  { label: "상권 정보 수집 중",       status: "pending", icon: MapPin,    activeBg: "bg-primary/10", activeColor: "text-primary"   },
  { label: "리뷰/평점 분석 중",       status: "pending", icon: Star,      activeBg: "bg-amber-50",  activeColor: "text-amber-500" },
  { label: "최종 분석 리포트 생성 중", status: "pending", icon: FileText,  activeBg: "bg-slate-100", activeColor: "text-slate-500" },
];

const MOCK_BIZ_DASHBOARD_MAY: BizDashboardData = {
  currentMonth: "2024.05",
  availableMonths: [],
  monthlyRevenue: 4820000,
  monthOverMonthChange: 12.4,
  cashFlow: 1250000,
  netProfit: 820000,
  industryComparison: {
    industryName: "카페/커피 전문점",
    revenue: 40,
    profitability: 30,
    stability: 35,
  },
  revenueTrend: [
    { month: "1월", amount: 3200000 },
    { month: "2월", amount: 3500000 },
    { month: "3월", amount: 4100000 },
    { month: "4월", amount: 4300000 },
    { month: "5월", amount: 4820000 },
  ],
  transactionFlow: [
    { month: "3월", income: 4100000, expense: 3200000 },
    { month: "4월", income: 4300000, expense: 3400000 },
    { month: "5월", income: 4820000, expense: 3570000 },
  ],
  loanBalance: 12000000,
  loanRepaymentDate: "2024.06.15",
  review: {
    averageRating: 4.6,
    reviewCount: 1248,
    ratingTrend: [
      { month: "1월", rating: 4.3 },
      { month: "2월", rating: 4.4 },
      { month: "3월", rating: 4.5 },
      { month: "4월", rating: 4.5 },
      { month: "5월", rating: 4.6 },
    ],
  },
  customerRatio: {
    repurchaseRate: 28,
    recommendCount: 1240,
  },
};

const MOCK_BIZ_DASHBOARD_APRIL: BizDashboardData = {
  currentMonth: "2024.04",
  availableMonths: [],
  monthlyRevenue: 4300000,
  monthOverMonthChange: -8.3,
  cashFlow: 980000,
  netProfit: 640000,
  industryComparison: {
    industryName: "카페/커피 전문점",
    revenue: 45,
    profitability: 35,
    stability: 40,
  },
  revenueTrend: [
    { month: "12월", amount: 2900000 },
    { month: "1월", amount: 3200000 },
    { month: "2월", amount: 3500000 },
    { month: "3월", amount: 4100000 },
    { month: "4월", amount: 4300000 },
  ],
  transactionFlow: [
    { month: "2월", income: 3500000, expense: 2800000 },
    { month: "3월", income: 4100000, expense: 3200000 },
    { month: "4월", income: 4300000, expense: 3400000 },
  ],
  loanBalance: 12000000,
  loanRepaymentDate: "2024.06.15",
  review: {
    averageRating: 4.5,
    reviewCount: 1201,
    ratingTrend: [
      { month: "12월", rating: 4.2 },
      { month: "1월", rating: 4.3 },
      { month: "2월", rating: 4.4 },
      { month: "3월", rating: 4.5 },
      { month: "4월", rating: 4.5 },
    ],
  },
  customerRatio: {
    repurchaseRate: 24,
    recommendCount: 1120,
  },
};

/** 월별 대시보드 Mock 데이터 맵 — key: "YYYY.MM" */
export const MOCK_BIZ_DASHBOARDS: Record<string, BizDashboardData> = {
  "2024.05": MOCK_BIZ_DASHBOARD_MAY,
  "2024.04": MOCK_BIZ_DASHBOARD_APRIL,
};

/** 현재 달 (가장 최신) */
export const MOCK_CURRENT_MONTH = "2024.05";
