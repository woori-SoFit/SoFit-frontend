/**
 * 대출 도메인 타입 정의
 */

export type LoanApplicationStatus =
  | "SUBMITTED"
  | "IN_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "CONTRACTED"
  | "EXECUTED";

export interface LoanProduct {
  id: number;
  name: string;
  minAmount: number;
  maxAmount: number;
  minRate: number;
  maxRate: number;
  minTerm: number;
  maxTerm: number;
  description: string;
}

export interface LoanApplication {
  id: number;
  productId: number;
  productName: string;
  status: LoanApplicationStatus;
  requestedAmount: number;
  requestedTerm: number;
  purpose: string;
  repaymentMethod: string;
  appliedAt: string;
}

export interface LoanApprovalDetail {
  applicationId: number;
  approvedAmount: number;
  proposedRate: number;
  term: number;
}

/** 대출 신청 step 흐름 */
export type LoanApplyStep =
  | "TERMS"           // 1. 약관 동의
  | "CERT_INFO"       // 2. 금융인증 정보 입력
  | "PIN"             // 3. 공동인증 PIN 입력
  | "BIZ_CONFIRM"     // 4. 사업자 정보 확인
  | "MYDATA_TERMS"    // 5. MyData 동의
  | "MYDATA_LOADING"  // 6. 데이터 로딩
  | "LOAN_CONDITIONS" // 7. 대출 조건 입력
  | "RESULT";         // 8. 신청 완료/실패

export interface LoanApplyFormData {
  agreedTermIds: number[];
  desiredAmount: number;
  desiredTerm: number;
  purpose: string;
  repaymentMethod: string;
}
