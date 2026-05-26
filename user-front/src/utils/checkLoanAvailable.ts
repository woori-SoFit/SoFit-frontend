import type { ProductFilterConditions } from "@/types/loan";
import type {
  LoanEligibilityInput,
  EligibilityCheckResult,
  EligibilityFailedField,
} from "@/types/eligibility";
import {
  ANNUAL_INCOME_VALUES,
  CREDIT_SCORE_VALUES,
  EXISTING_LOAN_VALUES,
} from "@/types/eligibility";

/**
 * 대출 신청 가능 여부를 검증하는 순수 함수
 *
 * 백엔드에서 내려준 한도값(filterConditions)과 사용자 입력값을 비교합니다.
 * - 연소득: 사용자 연소득 >= annualIncomeLimit 이면 통과
 * - 신용점수: 사용자 신용점수 >= creditScoreLimit 이면 통과
 * - 기존대출금액: 사용자 기존대출 <= existingLoanAmtLimit 이면 통과
 * - 소득유형: incomeTypeCodeLimit이 null이면 통과, 아니면 일치해야 통과
 */
export function checkLoanAvailable(
  input: LoanEligibilityInput,
  filter: ProductFilterConditions
): EligibilityCheckResult {
  const failedFields: EligibilityFailedField[] = [];

  // 연소득 검증: 사용자 연소득 >= 한도
  const userIncome = ANNUAL_INCOME_VALUES[input.annualIncome];
  if (userIncome < filter.annualIncomeLimit) {
    failedFields.push("annualIncome");
  }

  // 신용점수 검증: 사용자 신용점수 >= 한도
  const userCreditScore = CREDIT_SCORE_VALUES[input.creditScore];
  if (userCreditScore < filter.creditScoreLimit) {
    failedFields.push("creditScore");
  }

  // 소득유형 검증: null이면 제한 없음, 아니면 일치해야 함
  if (
    filter.incomeTypeCodeLimit !== null &&
    input.incomeType !== filter.incomeTypeCodeLimit
  ) {
    failedFields.push("incomeType");
  }

  // 기존대출금액 검증: 사용자 기존대출 <= 한도
  const userExistingLoan = EXISTING_LOAN_VALUES[input.existingLoanAmount];
  if (userExistingLoan > filter.existingLoanAmtLimit) {
    failedFields.push("existingLoanAmount");
  }

  if (failedFields.length === 0) {
    return { eligible: true };
  }

  return { eligible: false, failedFields };
}
