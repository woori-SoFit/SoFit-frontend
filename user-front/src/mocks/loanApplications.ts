import type { LoanApplication } from "@/types/loan";

/** 대출 신청 목록 Mock 데이터 */
export const MOCK_LOAN_APPLICATIONS: LoanApplication[] = [
  {
    id: 1,
    productId: 1,
    productName: "우리 Oh!(5)클릭 대출",
    status: "IN_REVIEW",
    requestedAmount: 100_000_000,
    requestedTerm: 36,
    purpose: "WORKING_CAPITAL",
    repaymentMethod: "EQUAL_PAYMENT",
    appliedAt: "2026-05-08",
  },
  {
    id: 2,
    productId: 2,
    productName: "우리 사장님 대출",
    status: "APPROVED",
    requestedAmount: 70_000_000,
    requestedTerm: 60,
    purpose: "FACILITY",
    repaymentMethod: "BULLET",
    appliedAt: "2026-05-02",
  },
  {
    id: 3,
    productId: 1,
    productName: "우리 Oh!(5)클릭 대출",
    status: "REJECTED",
    requestedAmount: 50_000_000,
    requestedTerm: 24,
    purpose: "WORKING_CAPITAL",
    repaymentMethod: "EQUAL_PAYMENT",
    appliedAt: "2026-04-15",
  },
];
