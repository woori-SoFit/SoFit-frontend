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
  title: string;
  minAmount: number;
  maxAmount: number;
  minRate: number;
  maxRate: number;
  minTerm: number;
  maxTerm: number;
  description: string;
}

/** API 응답 기준 대출 상품 목록 아이템 */
export interface LoanProductListItem {
  productId: number;
  productName: string;
  title: string;
  maxLimit: number;
}

/** 대출 상품 목록 API 응답 구조 */
export interface LoanProductListResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    loanProducts: LoanProductListItem[];
  };
}

/** API 응답 기준 대출 상품 상세 */
export interface LoanProductDetail {
  productId: number;
  productName: string;
  title: string;
  subtitle: string;
  minLimit: number;
  maxLimit: number;
  maxTerm: number;
  targetDescription: string;
  interest_rate: {
    minRate: number;
    maxRate: number;
  };
  /** 대출 신청 가능 조건 필터 (사전 입력 페이지에서 사용) */
  filterConditions?: {
    allowedAnnualIncomes: string[];
    allowedCreditScores: string[];
    allowedIncomeTypes: string[];
    allowedExistingLoanAmounts: string[];
  };
}

/** 대출 상품 상세 API 응답 구조 */
export interface LoanProductDetailResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: LoanProductDetail;
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

/** 대출 상품 옵션 (자금용도 + 상환방식 + 최대기간 조합) */
export interface LoanOption {
  purpose: "WORKING_CAPITAL" | "FACILITY";
  repaymentType: "BULLET" | "EQUAL_PAYMENT" | "EQUAL_PRINCIPAL";
  maxTermMonths: number;
}

/** 대출 상품 옵션 조회 API 응답 */
export interface LoanProductOptionsResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    productId: number;
    productName: string;
    maxLimit: number;
    minLimit: number;
    loanOptions: LoanOption[];
  };
}
