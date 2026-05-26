/**
 * 대출 도메인 한글 라벨 매핑 상수
 */

/** 상환방식 한글 매핑 */
export const REPAYMENT_LABELS: Record<string, string> = {
  BULLET: "만기일시",
  EQUAL_PAYMENT: "원리금균등",
  EQUAL_PRINCIPAL: "원금균등",
};

/** 자금용도 한글 매핑 */
export const PURPOSE_LABELS: Record<string, string> = {
  WORKING_CAPITAL: "운전자금",
  FACILITY_CAPITAL: "시설자금",
};
