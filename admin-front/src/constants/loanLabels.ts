import type { RepaymentMethod, LoanPurpose } from '@/types';

/** 상환 방식 ENUM → 한글 라벨 매핑 */
export const REPAYMENT_METHOD_LABELS: Record<RepaymentMethod, string> = {
  EQUAL_PAYMENT: '원리금균등상환',
  EQUAL_PRINCIPAL: '원금균등상환',
  BULLET: '만기일시상환',
};

/** 자금 용도 ENUM → 한글 라벨 매핑 */
export const PURPOSE_LABELS: Record<LoanPurpose, string> = {
  WORKING_CAPITAL: '운전 자금',
  FACILITY_CAPITAL: '시설 자금',
};
