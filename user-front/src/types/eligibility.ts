/**
 * 대출 신청 가능 확인 관련 타입 정의
 */

/** 연소득 구간 */
export type AnnualIncome =
  | "AMT_0_30M"
  | "AMT_30_50M"
  | "AMT_50_100M"
  | "AMT_100M_OVER";

/** 신용점수 구간 */
export type CreditScore =
  | "CS_0_850"
  | "CS_850_OVER"
  | "CS_UNKNOWN";

/** 소득유형 (SALARY: 급여, BUSINESS: 사업, OTHER: 기타) */
export type IncomeType = "SALARY" | "BUSINESS" | "OTHER";

/** 기존대출금액 구간 */
export type ExistingLoanAmount =
  | "LOAN_100M_OVER"
  | "LOAN_0_100M"
  | "LOAN_NONE";

/** 상품별 적격 필터 조건 */
export interface LoanEligibilityFilter {
  allowedAnnualIncomes: AnnualIncome[];
  allowedCreditScores: CreditScore[];
  allowedIncomeTypes: IncomeType[];
  allowedExistingLoanAmounts: ExistingLoanAmount[];
}

/** 사용자 입력값 */
export interface LoanEligibilityInput {
  annualIncome: AnnualIncome;
  creditScore: CreditScore;
  incomeType: IncomeType;
  existingLoanAmount: ExistingLoanAmount;
}

/** 적격 검증 실패 항목 */
export type EligibilityFailedField =
  | "annualIncome"
  | "creditScore"
  | "incomeType"
  | "existingLoanAmount";

/** 적격 검증 결과 */
export type EligibilityCheckResult =
  | { eligible: true }
  | { eligible: false; failedFields: EligibilityFailedField[] };

/** 대출 신청 생성 API 요청 본문 */
export interface CreateLoanApplicationRequest {
  productId: number;
  annualIncome: AnnualIncome;
  creditScore: CreditScore;
  incomeType: IncomeType;
  existingLoanAmt: ExistingLoanAmount;
}

/** 대출 신청 생성 API 응답 */
export interface CreateLoanApplicationResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    applicationId: number;
  };
}
