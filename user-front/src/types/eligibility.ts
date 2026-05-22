/**
 * 대출 신청 가능 확인 관련 타입 정의
 */

/** 연소득 구간 (API 전송값) */
export type AnnualIncome =
  | "AMT_0_30M"
  | "AMT_30_50M"
  | "AMT_50_100M"
  | "AMT_100M_OVER";

/** 신용점수 구간 (API 전송값) */
export type CreditScore =
  | "CS_0_850"
  | "CS_850_OVER"
  | "CS_UNKNOWN";

/** 소득유형 (API 전송값) */
export type IncomeType = "SALARY" | "BUSINESS" | "OTHER";

/** 기존대출금액 구간 (API 전송값) */
export type ExistingLoanAmount =
  | "LOAN_100M_OVER"
  | "LOAN_0_100M"
  | "LOAN_NONE";

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

/**
 * 연소득 구간 → 대표 숫자값 매핑 (원 단위)
 * 검증 시 사용자 선택값을 숫자로 변환하여 한도와 비교
 */
export const ANNUAL_INCOME_VALUES: Record<AnnualIncome, number> = {
  AMT_0_30M: 15_000_000,       // 3천만원 이하 → 대표값 1500만
  AMT_30_50M: 40_000_000,      // 3천~5천만 → 대표값 4000만
  AMT_50_100M: 75_000_000,     // 5천~1억 → 대표값 7500만
  AMT_100M_OVER: 150_000_000,  // 1억 초과 → 대표값 1.5억
};

/**
 * 신용점수 구간 → 대표 숫자값 매핑
 */
export const CREDIT_SCORE_VALUES: Record<CreditScore, number> = {
  CS_0_850: 700,       // 850점 이하 → 대표값 700
  CS_850_OVER: 900,    // 850점 초과 → 대표값 900
  CS_UNKNOWN: 0,       // 모름 → 0 (검증 시 항상 실패 가능)
};

/**
 * 기존대출금액 구간 → 대표 숫자값 매핑 (원 단위)
 */
export const EXISTING_LOAN_VALUES: Record<ExistingLoanAmount, number> = {
  LOAN_NONE: 0,                // 없음
  LOAN_0_100M: 50_000_000,    // 1억 이하 → 대표값 5000만
  LOAN_100M_OVER: 200_000_000, // 1억 초과 → 대표값 2억
};
