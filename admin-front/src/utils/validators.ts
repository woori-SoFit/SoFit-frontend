/**
 * 대출 승인 처리 시 사용되는 유효성 검증 유틸리티 함수 모음
 */

/**
 * 승인 금액 유효성 검증 (원 단위)
 * 100만원(1,000,000) 이상 10억원(1,000,000,000) 이하의 정수만 유효
 */
export function validateApprovalAmount(value: number): boolean {
  if (!Number.isInteger(value)) {
    return false;
  }
  return value >= 1_000_000 && value <= 1_000_000_000;
}

/**
 * 확정 금리 유효성 검증
 * 0.01% 이상 20.00% 이하만 유효
 */
export function validateInterestRate(value: number): boolean {
  return value >= 0.01 && value <= 20.0;
}

/**
 * 대출 기간 유효성 검증
 * 1개월 이상 360개월 이하의 정수만 유효
 */
export function validateLoanTerm(value: number): boolean {
  if (!Number.isInteger(value)) {
    return false;
  }
  return value >= 1 && value <= 360;
}

/**
 * 공백 문자열 여부 검증
 * 빈 문자열이거나 공백 문자(space, tab, newline 등)로만 구성되면 true
 */
export function isWhitespaceOnly(value: string): boolean {
  return value.trim().length === 0;
}
