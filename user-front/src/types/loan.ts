/**
 * 대출 도메인 타입 정의
 */

export type LoanApplicationStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "CB_CHECKING"
  | "BASIC_REVIEW"
  | "S_CALCULATING"
  | "S_COMPLETED"
  | "SYSTEM_APPROVED"
  | "SYSTEM_REJECTED"
  | "MANAGER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "CONTRACTED"
  | "EXECUTED"
  | "CANCELLED";

/** API 응답 기준 대출 상품 목록 아이템 */
export interface LoanProductListItem {
  productId: number;
  productName: string;
  title: string;
  maxLimit: number;
  minRate: number;
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

/** 상품별 적격 필터 조건 */
export interface ProductFilterConditions {
  /** 연소득 하한 (원 단위, 이 금액 이상이어야 적격) */
  annualIncomeLimit: number;
  /** 신용점수 하한 (이 점수 이상이어야 적격) */
  creditScoreLimit: number;
  /** 기존대출금액 상한 (원 단위, 이 금액 이하여야 적격) */
  existingLoanAmtLimit: number;
  /** 소득유형 제한 (이 유형만 허용, null이면 제한 없음) */
  incomeTypeCodeLimit: string | null;
}

/** 상품 상세 설명 */
export interface LoanProductDescription {
  targetDetail: string;
  limitDescription: string;
  termDescription: string;
  rateDescription: string;
  preferentialRateDescription: string;
  repaymentDescription: string;
  collateralDescription: string;
  feeDescription: string;
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
  targetSummary: string;
  interestRate: {
    minRate: number;
    maxRate: number;
  };
  filterConditions: ProductFilterConditions;
  productDescription?: LoanProductDescription;
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
  productId?: number;
  productName: string;
  status: LoanApplicationStatus;
  requestedAmount: number;
  requestedTerm?: number;
  purpose?: string;
  repaymentMethod?: string;
  appliedAt: string;
}

/** 심사 중인 대출 목록 API 응답 아이템 */
export interface LoanApplicationInProgressItem {
  applicationId: number;
  productName: string;
  requestedAmount: number;
  status: LoanApplicationStatus;
  appliedAt: string;
}

/** 심사 중인 대출 목록 API 응답 */
export interface LoanApplicationsInProgressResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    loanApplications: LoanApplicationInProgressItem[];
  };
}

/** 심사 완료 대출 목록 API 응답 아이템 */
export interface LoanApplicationCompletedItem {
  applicationId: number;
  productName: string;
  status: LoanApplicationStatus;
  requestedAmount: number;
  appliedAt: string;
  updatedAt: string;
}

/** 심사 완료 대출 목록 API 응답 */
export interface LoanApplicationsCompletedResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    loanApplications: LoanApplicationCompletedItem[];
  };
}

/** 대출 신청 상세 조회 API 응답 아이템 */
export interface LoanApplicationDetail {
  applicationId: number;
  productName: string;
  requestedAmount: number;
  requestedTerm: number;
  repaymentMethod: string;
  status: LoanApplicationStatus;
  appliedAt: string;
}

/** 대출 신청 상세 조회 API 응답 */
export interface LoanApplicationDetailResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: LoanApplicationDetail;
}

/** 심사 완료 상세 조회 — 심사 결정 정보 */
export interface DecisionInfo {
  decision: "APPROVED" | "REJECTED";
  approvedAmount: number | null;
  approvedRate: number | null;
  approvedTerm: number | null;
  rejectionReason: string | null;
}

/** 심사 완료 상세 조회 API 응답 아이템 */
export interface LoanApplicationCompletedDetail {
  applicationId: number;
  productName: string;
  requestedAmount: number;
  repaymentMethod: string;
  decisionInfo: DecisionInfo;
}

/** 심사 완료 상세 조회 API 응답 */
export interface LoanApplicationCompletedDetailResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: LoanApplicationCompletedDetail;
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
  | "BIZ_DATA_CHECK"  // 7. 마이비즈 데이터 연동 확인
  | "BIZ_INTRO"       // 8. 마이비즈 데이터 소개
  | "LOAN_CONDITIONS" // 9. 대출 조건 입력
  | "RESULT";         // 10. 신청 완료/실패

export interface LoanApplyFormData {
  agreedTermIds: number[];
  desiredAmount: number;
  desiredTerm: number;
  purpose: string;
  repaymentMethod: string;
}

/** 대출 상품 옵션 (자금용도 + 상환방식 + 최대기간 조합) */
export interface LoanOption {
  purpose: "WORKING_CAPITAL" | "FACILITY_CAPITAL";
  repaymentMethod: "BULLET" | "EQUAL_PAYMENT" | "EQUAL_PRINCIPAL";
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

/** 대출 심사 요청 API 요청 본문 */
export interface SubmitLoanApplicationRequest {
  purpose: string;
  repaymentMethod: string;
  requestedTerm: number;
  requestedAmount: number;
}

/** 대출 심사 요청 API 응답 */
export interface SubmitLoanApplicationResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: SubmitLoanApplicationResult;
}

/** 대출 심사 요청 결과 데이터 */
export interface SubmitLoanApplicationResult {
  applicationId: number;
  productName: string;
  requestedAmount: number;
  appliedAt: string;
  repaymentMethod: string;
  purpose: string;
  requestedTerm: number;
}

/** 임시저장(draft) 존재 여부 조회 API 응답 */
export interface CheckDraftResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    hasDraft: boolean;
    applicationId?: number;
    lastCompletedStep?: string;
    resumeStep?: string;
  };
}

/** 임시저장(draft) 목록 아이템 */
export interface LoanDraftItem {
  applicationId: number;
  productId: number;
  productName: string;
  resumeStep: string;
}

/** 임시저장(draft) 목록 조회 API 응답 */
export interface LoanDraftsResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    drafts: LoanDraftItem[];
  };
}

/** 대출 약관 동의 요청 */
export interface LoanConsentsRequest {
  termType: string;
  applicationId: number;
  consents: Array<{
    termId: number;
    isConsented: boolean;
  }>;
}

/** 대출 신청 사업자 정보 조회 API 응답 */
export interface LoanBizInfoResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    businessNumber: string;
    businessName: string;
    representativeName: string;
    openDate: string;
    businessCategory: string;
    businessType: string;
    businessAddress: string;
    isMybizConnected: boolean;
  };
}

/** 대출 실행 상세 조회 API 응답 */
export interface LoanExecutionDetailResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: LoanExecutionDetail;
}

/** 대출 실행 상세 데이터 */
export interface LoanExecutionDetail {
  executionId: number;
  applicationId: number;
  productId: number;
  productName: string;
  executedAmount: number;
  approvedRate: number;
  approvedTerm: number;
  repaymentMethod: string;
}

/** 대출 관리 — 실행 완료된 대출 목록 아이템 */
export interface LoanManagementItem {
  executionId: number;
  applicationId: number;
  productId: number;
  productName: string;
  executedAmount: number;
  approvedRate: number;
  approvedTerm: number;
  repaymentMethod: string;
  executedAt: string;
}

/** 대출 관리 목록 API 응답 */
export interface LoanManagementListResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    executions: LoanManagementItem[];
  };
}

/** 1원 송금 요청 API 응답 */
export interface AccountVerificationResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    maskedAccountNumber: string;
    authCode: string;
    expiredAt: string;
  };
}

/** 인증 코드 확인 API 응답 */
export interface AccountVerificationConfirmResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    accountVerified: boolean;
  };
}
