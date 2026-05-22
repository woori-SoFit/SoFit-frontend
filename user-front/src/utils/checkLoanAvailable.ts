import type {
  LoanEligibilityFilter,
  LoanEligibilityInput,
  EligibilityCheckResult,
  EligibilityFailedField,
} from "@/types/eligibility";

/**
 * 대출 신청 가능 여부를 검증하는 순수 함수
 *
 * 각 사용자 입력값이 상품 필터 조건의 허용 목록에 포함되는지 확인합니다.
 * 필터 조건의 특정 필드가 빈 배열이면 해당 필드의 검증을 건너뜁니다.
 */
export function checkLoanAvailable(
  input: LoanEligibilityInput,
  filter: LoanEligibilityFilter
): EligibilityCheckResult {
  const failedFields: EligibilityFailedField[] = [];

  // 연소득 검증 (빈 배열이면 통과)
  if (
    filter.allowedAnnualIncomes.length > 0 &&
    !filter.allowedAnnualIncomes.includes(input.annualIncome)
  ) {
    failedFields.push("annualIncome");
  }

  // 신용점수 검증 (빈 배열이면 통과)
  if (
    filter.allowedCreditScores.length > 0 &&
    !filter.allowedCreditScores.includes(input.creditScore)
  ) {
    failedFields.push("creditScore");
  }

  // 소득유형 검증 (빈 배열이면 통과)
  if (
    filter.allowedIncomeTypes.length > 0 &&
    !filter.allowedIncomeTypes.includes(input.incomeType)
  ) {
    failedFields.push("incomeType");
  }

  // 기존대출금액 검증 (빈 배열이면 통과)
  if (
    filter.allowedExistingLoanAmounts.length > 0 &&
    !filter.allowedExistingLoanAmounts.includes(input.existingLoanAmount)
  ) {
    failedFields.push("existingLoanAmount");
  }

  if (failedFields.length === 0) {
    return { eligible: true };
  }

  return { eligible: false, failedFields };
}
