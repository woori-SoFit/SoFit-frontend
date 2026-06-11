/**
 * 대출 도메인 관련 타입 정의
 */

import type { PaginatedResponse } from './common';

export type ReviewStatus = 
  'SUBMITTED' |
  'SYSTEM_APPROVED' |
  'SYSTEM_REJECTED' | 
  'MANAGER_REVIEW' | 
  'APPROVED' | 
  'REJECTED' |
  'EXECUTED';


// ─── 대출 신청 현황 API (GET /api/admin/loan-applications) ──────────

/** 대출 신청 목록 조회 요청 파라미터 */
export interface LoanApplicationListRequest {
  page: number;
  size: number;
  status?: ReviewStatus | ReviewStatus[];
  myOnly?: boolean;
}

/** 대출 신청 목록 조회 응답 */
export type LoanApplicationListResponse = PaginatedResponse<LoanApplicationItem>;

/** 대출 신청 목록 개별 항목 (서버 응답 원본) */
export interface LoanApplicationItem {
  applicationId: number;
  /** ISO 8601 날짜시간 문자열 (예: "2024-05-24T10:30:00") */
  appliedAt: string;
  applicantName: string;
  businessName: string;
  productName: string;
  /** 대출 신청 금액 (원) */
  requestedAmount: number;
  /** 승인 금액 (원) — 승인/실행 완료 시에만 존재 */
  approvedAmount?: number;
  status: ReviewStatus;
  assignedBankerId: number;
  assigneeName: string;
}

// ─── 공통 정보 API 응답 ─────────────────────────────────────────────

/** 공통 정보 API 응답 (GET /api/admin/loan-applications/{id}) */
export interface LoanSummary {
  applicationId: number;
  applicantName: string;
  businessName: string | null;
  productName: string;
  status: ReviewStatus;
  appliedAt: string;
  assignedBankerId: number | null;
  assigneeName: string;
  rejectionComment?: string;
  approvalComment?: string;
  /** 심사 결정 일시 (ISO 8601) */
  decidedAt?: string;
}

// ─── 대출 상세 관련 타입 ────────────────────────────────────────────

/** 고객 기본 정보 */
export interface CustomerInfo {
  name: string;
  /** 주민번호 앞 7자리 (하이픈 없음) */
  residentNumber: string;
  /** 연락처 (하이픈 없음) */
  phoneNumber: string;
  /** 가입일시 (ISO 8601) */
  joinedAt: string;
  /** 아이디 */
  loginId: string;
}

/** 사업자 정보 */
export interface BusinessInfo {
  businessName: string;
  /** 사업자등록번호 (10자리, 하이픈 없음) */
  businessNumber: string;
  /** 업종 */
  businessCategory: string;
  /** 업태 */
  businessType: string;
  /** 사업장 주소 */
  businessAddress: string;
  /** 사업 개시일 (YYYY-MM-DD) */
  openDate: string;
}

/** 상환 방식 */
export type RepaymentMethod = 'EQUAL_PAYMENT' | 'EQUAL_PRINCIPAL' | 'BULLET';

/** 자금 용도 */
export type LoanPurpose = 'WORKING_CAPITAL' | 'FACILITY_CAPITAL';

/** 약관 동의 항목 */
export interface ConsentHistory {
  title: string;
  isRequired: boolean;
  isConsented: boolean;
  /** 동의 일시 (ISO 8601). 미동의 시 null */
  consentedAt: string | null;
}

/** 신청 조건 */
export interface ApplicationInfo {
  /** 희망 대출 금액 (원) */
  requestedAmount: number;
  /** 대출 기간 (개월) */
  requestedTerm: number;
  repaymentMethod: RepaymentMethod;
  /** 자금 용도 */
  purpose: LoanPurpose;
}

/** 신청자 입력 정보 (코드값 문자열) */
export interface UserInputInfo {
  /** 연 소득 구간 코드 */
  annualIncome: string;
  /** 신용점수 구간 코드 */
  creditScore: string;
  /** 소득 종류 코드 */
  incomeType: string;
  /** 보유 대출액 구간 코드 */
  existingLoanAmount: string;
}

/** 부가세 신고 상태 */
export type VatFilingStatus = 'FILED' | 'PENDING' | 'OVERDUE';

/** 보험료 납부 상태 */
export type InsurancePaymentStatus = 'PAID' | 'PENDING' | 'OVERDUE';

/** 시스템 수집 정보 (마이비즈데이터) */
export interface MyBizData {
  existingLoanCount: number;
  /** DSR 관련 */
  annualIncome: number;
  annualRepayment: number;
  monthlyRepayment: number;
  /** 보유 대출 잔액 */
  totalLoanBalance: number;
  /** 운영 신뢰도 */
  businessAgeMonths: number;
  vatFilingStatus: VatFilingStatus;
  taxOverdue: boolean;
  insurancePaymentStatus: InsurancePaymentStatus;
  /** 부가세 최근 신고일 (ISO 8601) */
  vatFilingDate: string | null;
  /** 매출 추이 (최근 6개월) */
  revenueTrend: Array<{
    referenceMonth: string;
    monthlyRevenue: number;
  }>;
  /** 업종 평균 매출 추이 (최근 6개월) */
  industryAvgRevenueTrend: Array<{
    referenceMonth: string;
    monthlyRevenue: number;
  }>;
  /** 수익 추이 (최근 6개월) */
  profitTrend: Array<{
    referenceMonth: string;
    profit: number;
  }>;
  /** 업종/상권 비교 */
  industryComparison: {
    myRevenue: number;
    industryAvgRevenue: number;
    districtAvgRevenue: number;
    myProfitRate: number;
    industryAvgProfitRate: number;
    districtAvgProfitRate: number;
    /** 순위 (상위 %) */
    industrySalesRank: number;
    industryProfitRank: number;
    industrySatisfactionRank: number;
    districtSalesRank: number;
    districtProfitRank: number;
    districtSatisfactionRank: number;
  };
}

/** SHAP 분석 결과 */
export interface ShapResult {
  /** 현재 등급 (예: "S3") */
  grade: string;
  /** 목표 등급 (예: "S2") */
  targetGrade: string;
  strengthKeywords: string[];
  improvementKeywords: string[];
  /** 강점 상세 (변수명 → SHAP 값) */
  strengthDetails: Record<string, number>;
  /** 개선 상세 (변수명 → SHAP 값) */
  improvementDetails: Record<string, number>;
  /** AI 조언 텍스트 */
  advice: string;
}

/** 대출 상품 정보 */
export interface LoanProductInfo {
  productName: string;
  /** 최소 대출 금액 (원) */
  minAmount: number;
  /** 최대 대출 금액 (원) */
  maxAmount: number;
  /** 최소 금리 (%) */
  minInterestRate: number;
  /** 최대 금리 (%) */
  maxInterestRate: number;
  /** 최소 대출 기간 (개월) */
  minTermMonths: number;
  /** 최대 대출 기간 (개월) */
  maxTermMonths: number;
  availableRepaymentMethods: RepaymentMethod[];
  availablePurposes: LoanPurpose[];
}

/** 시스템 추천값 */
export interface RecommendationData {
  /** 승인 금액 (원) */
  approvedAmount: number;
  /** 확정 금리 (%) */
  approvedRate: number;
  /** 확정 기간 (개월) */
  approvedTerm: number;
  repaymentMethod: RepaymentMethod | null;
}

/** 심사 결정 상태 (decisions 배열에서 사용) */
export type DecisionStatus =
  | 'SYSTEM_APPROVED'
  | 'SYSTEM_REJECTED'
  | 'TELLER_APPROVED'
  | 'TELLER_REJECTED'
  | 'MANAGER_APPROVED'
  | 'MANAGER_REJECTED';

/** 심사 결정 정보 */
export interface ReviewDecision {
  status: DecisionStatus;
  comment: string | null;
  reviewerName: string;
  reviewerRole: 'SYSTEM' | 'ADMIN_BANK_TELLER' | 'ADMIN_BANK_MANAGER';
  /** 심사 일시 (ISO 8601) */
  decidedAt: string;
}

/** 심사 결과 탭 전용 API 응답 */
export interface ReviewTabData {
  productInfo: LoanProductInfo;
  applicationInfo: ApplicationInfo;
  recommendation: RecommendationData;
  /** 심사 이력 (은행원 → 지점장 순서, 비어있으면 미결정) */
  decisions: ReviewDecision[];
}

/** 승인 요청 페이로드 */
export interface ApprovalPayload {
  approvedAmount: number;
  approvedRate: number;
  approvedTerm: number;
  repaymentMethod: RepaymentMethod;
  comment: string;
}

/** 거절 요청 페이로드 */
export interface RejectionPayload {
  comment: string;
}

/** 심사 결정 API 응답 */
export interface ReviewDecisionResponse {
  decisionId: number;
  applicationId: number;
  decision: 'APPROVED' | 'REJECTED';
}

/** 지점장 결재 목록 항목 */
export interface ManagerApprovalItem {
  id: number;
  applicationDate: string;
  applicantName: string;
  businessName: string;
  productName: string;
  requestedByName: string;
  /** 신청 금액 (원) */
  requestedAmount: number;
}

/** 대출 신청 상태별 건수 */
export interface LoanStatusCounts {
  pending: number;
  managerReview: number;
  approved: number;
  rejected: number;
}

/** 정보 탭 API 응답 (GET /api/admin/loan-applications/{id}/info) */
export interface LoanInfoTabResponse {
  applicantInfo: CustomerInfo;
  businessInfo: BusinessInfo;
  applicationInfo: ApplicationInfo;
  userInputInfo: UserInputInfo;
  consentHistories: ConsentHistory[];
}

/** CB 점수 정보 (S등급 분석 탭 API 응답 내부) */
export interface CBScoreInfo {
  score: number;
  maxScore: number;
}

/** SCB 점수 정보 (S등급 분석 탭 API 응답 내부) */
export interface SCBInfo {
  score: number;
  maxScore: number;
  bonusPoints: number;
}

/** S등급 분석 탭 API 응답 (GET /api/admin/loan-applications/{id}/grade) */
export interface SGradeTabResponse {
  cbScore: CBScoreInfo;
  sGrade: string;
  scbInfo: SCBInfo;
  shapResult: ShapResult;
}
