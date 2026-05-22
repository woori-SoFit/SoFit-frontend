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

/** 공통 정보 API 응답 (GET /api/admin/loan-applications/{id}) */
export interface LoanSummary {
  applicationId: number;
  applicantName: string;
  businessName: string;
  productName: string;
  status: ReviewStatus;
  appliedAt: string;
  assigneeName: string;
  rejectionComment?: string;
}

export interface LoanApplication {
  /** 고유 식별자 */
  applicationId: number;
  /** 신청일 (ISO 8601 형식: "2024-05-24") */
  appliedAt: string;
  /** 신청자명 */
  applicantName: string;
  /** 사업자명 */
  businessName: string;
  /** 대출 상품명 */
  productName: string;
  /** 심사 상태 */
  status: ReviewStatus;
  /** 담당자명 */
  assigneeName: string;
}

/** 서버 페이징 응답 */
export interface PaginatedResponse<T> {
  applications: T[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
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
  /** 사업자명 */
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
  /** 약관명 */
  title: string;
  /** 필수 여부 */
  isRequired: boolean;
  /** 동의 여부 */
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
  annualIncome: number;
  existingLoanCount: number;
  monthlyRevenue: number;
  monthlyRevenueGrowthRate: number;
  cashFlow: number;
  accountBalance: number;
  businessAgeMonths: number;
  vatFilingStatus: VatFilingStatus;
  taxOverdue: boolean;
  insurancePaymentStatus: InsurancePaymentStatus;
  industrySalesRank: number;
  industryProfitRank: number;
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
  /** 강점 상세 (변수명 → SHAP 값) */
  strengthDetails: Record<string, number>;
  /** 개선 상세 (변수명 → SHAP 값) */
  improvementDetails: Record<string, number>;
  /** AI 조언 텍스트 */
  advice: string;
}

/** 대출 상품 정보 */
export interface LoanProductInfo {
  /** 상품명 */
  productName: string;
  /** 최소 대출 금액 (만원) */
  minAmount: number;
  /** 최대 대출 금액 (만원) */
  maxAmount: number;
  /** 최소 금리 (%) */
  minInterestRate: number;
  /** 최대 금리 (%) */
  maxInterestRate: number;
  /** 최소 대출 기간 (개월) */
  minTermMonths: number;
  /** 최대 대출 기간 (개월) */
  maxTermMonths: number;
  /** 가능한 상환 방식 */
  availableRepaymentMethods: RepaymentMethod[];
  /** 가능한 자금 용도 */
  availablePurposes: LoanPurpose[];
}

/** 대출 신청 상세 전체 데이터 */
export interface LoanDetailData {
  id: number;
  applicationDate: string;
  reviewStatus: ReviewStatus;
  assigneeName: string;
  productInfo: LoanProductInfo;
  customerInfo: CustomerInfo;
  businessInfo: BusinessInfo;
  applicationInfo: ApplicationInfo;
  userInputInfo: UserInputInfo;
  /** 약관 동의 목록 */
  consentHistories: ConsentHistory[];
  myBizData: MyBizData | null;
  cbScore: number | null;
  /** "S1" ~ "S10" */
  sGrade: string | null;
  scbScore: number | null;
  /** 가산점 */
  bonusPoints: number | null;
  shapResult: ShapResult | null;
  /** 거절 사유 (REJECTED 상태일 때만 존재) */
  rejectionComment?: string;
}

/** 시스템 추천값 */
export interface RecommendationData {
  /** 승인 금액 (원) */
  approvedAmount: number;
  /** 확정 금리 (%) */
  approvedRate: number;
  /** 확정 기간 (개월) */
  approvedTerm: number;
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
  /** 거절 사유 (필수) */
  comment: string;
}

/** 추가 결재 요청 페이로드 */
export interface EscalationPayload {
  /** 요청 의견 (필수) */
  comment: string;
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
  requestedAmount: number;
}
