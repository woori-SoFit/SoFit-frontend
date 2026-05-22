import type { LoanProductOptionsResponse } from "@/types/loan";

/** 대출 상품 옵션 Mock 데이터 */
export const MOCK_LOAN_PRODUCT_OPTIONS: LoanProductOptionsResponse["result"] = {
  productId: 1,
  productName: "우리 사장님 대출",
  maxLimit: 300_000_000,
  minLimit: 30_000_000,
  loanOptions: [
    { purpose: "WORKING_CAPITAL", repaymentType: "BULLET", maxTermMonths: 12 },
    { purpose: "WORKING_CAPITAL", repaymentType: "EQUAL_PAYMENT", maxTermMonths: 60 },
    { purpose: "WORKING_CAPITAL", repaymentType: "EQUAL_PRINCIPAL", maxTermMonths: 60 },
    { purpose: "FACILITY", repaymentType: "BULLET", maxTermMonths: 36 },
    { purpose: "FACILITY", repaymentType: "EQUAL_PRINCIPAL", maxTermMonths: 240 },
  ],
};
