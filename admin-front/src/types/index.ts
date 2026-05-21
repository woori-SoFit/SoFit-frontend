export interface MenuItem {
  label: string;
  path: string;
}

export type AdminRole = 'ADMIN_DEV' | 'ADMIN_BANK_TELLER' | 'ADMIN_BANK_MANAGER';

export const VALID_ROLES: AdminRole[] = [
  'ADMIN_DEV',
  'ADMIN_BANK_TELLER',
  'ADMIN_BANK_MANAGER',
];

export function isValidRole(value: unknown): value is AdminRole {
  return VALID_ROLES.includes(value as AdminRole);
}

export type ReviewStatus = 'UNDER_REVIEW' | 'MANAGER_REVIEW' | 'APPROVED' | 'REJECTED';

export interface LoanApplication {
  /** 고유 식별자 */
  id: number;
  /** 신청일 (ISO 8601 형식: "2025-01-15") */
  applicationDate: string;
  /** 신청자명 */
  applicantName: string;
  /** 사업자명 */
  businessName: string;
  /** 대출 상품명 */
  productName: string;
  /** 심사 상태 */
  reviewStatus: ReviewStatus;
  /** 담당자명 */
  assigneeName: string;
}

/** 서버 페이징 응답 */
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

/** 대출 신청 목록 조회 파라미터 */
export interface LoanApplicationParams {
  page: number;
  size: number;
  status?: ReviewStatus;
  assigneeName?: string;
}

// ─── 대출 상세 관련 타입 ───────────────────────────────────────────

/** 고객 기본 정보 */
export interface CustomerInfo {
  name: string;
  /** 주민번호 원본 (마스킹 전) */
  residentNumber: string;
  /** 연락처 */
  phoneNumber: string;
  /** 가입일시 (ISO 8601) */
  registeredAt: string;
  /** 아이디 */
  loginId: string;
}

/** 사업자 정보 */
export interface BusinessInfo {
  /** 사업자명 */
  businessName: string;
  /** 사업자등록번호 (10자리) */
  businessNumber: string;
  /** 업종 */
  industry: string;
  /** 업태 */
  businessType: string;
  /** 사업장 주소 */
  address: string;
  /** 사업 개시일 (ISO 8601) */
  startDate: string;
}

/** 상환 방식 */
export type RepaymentMethod = 'EQUAL_PRINCIPAL_INTEREST' | 'EQUAL_PRINCIPAL' | 'BULLET';

/** 신청 조건 */
export interface ApplicationCondition {
  /** 희망 대출 금액 (만원) */
  desiredAmount: number;
  /** 대출 기간 (개월) */
  loanTermMonths: number;
  repaymentMethod: RepaymentMethod;
  /** 자금 용도 */
  purpose: string;
}

/** 소득 종류 */
export type IncomeType = 'SALARY' | 'BUSINESS' | 'OTHER';

/** 신청자 입력 정보 */
export interface ApplicantInput {
  /** 연 소득 (만원) */
  annualIncome: number | null;
  /** 신용점수 */
  creditScore: number | null;
  /** 소득 종류 */
  incomeType: IncomeType | null;
  /** 보유 대출액 (만원) */
  existingLoanAmount: number | null;
}

/** 부가세 신고 상태 */
export type VatFilingStatus = 'FILED' | 'PENDING' | 'OVERDUE';

/** 보험료 납부 상태 */
export type InsurancePaymentStatus = 'PAID' | 'PENDING' | 'OVERDUE';

/** 시스템 수집 정보 (마이비즈데이터) */
export interface SystemCollectedData {
  annual_income: number;
  existing_loan_count: number;
  monthly_revenue: number;
  monthly_revenue_growth_rate: number;
  cash_flow: number;
  account_balance: number;
  business_age_months: number;
  vat_filing_status: VatFilingStatus;
  tax_overdue: boolean;
  insurance_payment_status: InsurancePaymentStatus;
  industry_sales_rank: number;
  industry_profit_rank: number;
}

/** SHAP 상세 항목 */
export interface ShapDetail {
  featureName: string;
  shapValue: number;
}

/** SHAP 분석 결과 */
export interface ShapResult {
  /** 현재 등급 (예: "S3") */
  grade: string;
  /** 목표 등급 (예: "S2") */
  targetGrade: string;
  /** 강점 키워드 */
  strengthKeywords: string[];
  /** 개선 키워드 */
  improvementKeywords: string[];
  /** 강점 상세 (양수 SHAP) */
  strengthDetails: ShapDetail[];
  /** 개선 상세 (음수 SHAP) */
  improvementDetails: ShapDetail[];
  /** AI 조언 텍스트 */
  advice: string;
}

/** 대출 신청 상세 전체 데이터 */
export interface LoanDetailData {
  id: number;
  applicationDate: string;
  reviewStatus: ReviewStatus;
  assigneeName: string;
  customerInfo: CustomerInfo;
  businessInfo: BusinessInfo;
  applicationCondition: ApplicationCondition;
  applicantInput: ApplicantInput;
  systemCollectedData: SystemCollectedData | null;
  cbScore: number | null;
  /** "S1" ~ "S10" */
  sGrade: string | null;
  scbScore: number | null;
  /** 가산점 */
  bonusPoints: number | null;
  shapResult: ShapResult | null;
}

/** 시스템 추천값 */
export interface RecommendationData {
  /** 승인 금액 (만원) */
  approvedAmount: number;
  /** 확정 금리 (%) */
  interestRate: number;
  /** 확정 기간 (개월) */
  loanTermMonths: number;
  repaymentMethod: RepaymentMethod;
}

/** 승인 요청 페이로드 */
export interface ApprovalPayload {
  approvedAmount: number;
  interestRate: number;
  loanTermMonths: number;
  repaymentMethod: RepaymentMethod;
  comment?: string;
}

/** 거절 요청 페이로드 */
export interface RejectionPayload {
  reason: string;
  comment?: string;
}

/** 추가 결재 요청 페이로드 */
export interface EscalationPayload {
  comment?: string;
}

/** 지점장 결재 목록 항목 */
export interface ManagerApprovalItem {
  id: number;
  applicationDate: string;
  applicantName: string;
  businessName: string;
  /** 요청 은행원명 */
  requestedByName: string;
  /** 신청 금액 (만원) */
  desiredAmount: number;
}
