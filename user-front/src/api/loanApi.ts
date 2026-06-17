/**
 * 대출 도메인 API 함수
 */
import axiosInstance from "./axiosInstance";
import type {
  LoanProductListItem,
  LoanProductListResponse,
  LoanProductDetail,
  LoanProductDetailResponse,
  LoanProductOptionsResponse,
  LoanApplication,
  LoanApplicationsInProgressResponse,
  LoanApplicationsCompletedResponse,
  LoanApplicationDetail,
  LoanApplicationDetailResponse,
  LoanApplicationCompletedDetail,
  LoanApplicationCompletedDetailResponse,
  SubmitLoanApplicationRequest,
  SubmitLoanApplicationResponse,
  CheckDraftResponse,
  LoanDraftItem,
  LoanDraftsResponse,
  LoanConsentsRequest,
  LoanBizInfoResponse,
  LoanExecutionDetailResponse,
  LoanExecutionDetail,
  LoanManagementItem,
  LoanManagementListResponse,
  AccountVerificationResponse,
  AccountVerificationConfirmResponse,
} from "@/types/loan";
import type {
  CreateLoanApplicationRequest,
  CreateLoanApplicationResponse,
} from "@/types/eligibility";

/** 대출 상품 목록 조회 */
export async function fetchLoanProducts(): Promise<LoanProductListItem[]> {
  const res = await axiosInstance.get<LoanProductListResponse>("/loan-products");
  return res.data?.result?.loanProducts ?? [];
}

/** 대출 상품 상세 조회 */
export async function fetchLoanProduct(productId: number): Promise<LoanProductDetail> {
  const res = await axiosInstance.get<LoanProductDetailResponse>(`/loan-products/${productId}`);
  return res.data.result;
}

/** 대출 상품 옵션 조회 (자금용도, 상환방식, 기간, 금액 범위) */
export async function fetchLoanProductOptions(
  productId: number
): Promise<LoanProductOptionsResponse["result"]> {
  const res = await axiosInstance.get<LoanProductOptionsResponse>(
    `/loan-products/${productId}/options`
  );
  return res.data.result;
}

/** 대출 신청 생성 */
export async function createLoanApplication(
  request: CreateLoanApplicationRequest
): Promise<CreateLoanApplicationResponse> {
  const { productId, ...body } = request;
  const res = await axiosInstance.post<CreateLoanApplicationResponse>(
    `/loan-products/${productId}/applications`,
    body
  );
  return res.data;
}

/** 심사 중인 대출 목록 조회 */
export async function fetchLoanApplicationsInProgress(): Promise<LoanApplication[]> {
  const res = await axiosInstance.get<LoanApplicationsInProgressResponse>(
    "/loan-applications"
  );
  // applicationId → id 매핑
  return (res.data?.result?.loanApplications ?? []).map((item) => ({
    id: item.applicationId,
    productName: item.productName,
    requestedAmount: item.requestedAmount,
    status: item.status,
    appliedAt: item.appliedAt,
  }));
}

/** 대출 신청 상세 조회 */
export async function fetchLoanApplicationDetail(
  applicationId: number
): Promise<LoanApplicationDetail> {
  const res = await axiosInstance.get<LoanApplicationDetailResponse>(
    `/loan-applications/${applicationId}`
  );
  return res.data.result;
}

/** 심사 완료 대출 목록 조회 */
export async function fetchLoanApplicationsCompleted(): Promise<LoanApplication[]> {
  const res = await axiosInstance.get<LoanApplicationsCompletedResponse>(
    "/loan-applications/completed"
  );
  return (res.data?.result?.loanApplications ?? []).map((item) => ({
    id: item.applicationId,
    productName: item.productName,
    requestedAmount: item.requestedAmount,
    status: item.status,
    appliedAt: item.appliedAt,
  }));
}

/** 심사 완료 대출 상세 조회 */
export async function fetchLoanApplicationCompletedDetail(
  applicationId: number
): Promise<LoanApplicationCompletedDetail> {
  const res = await axiosInstance.get<LoanApplicationCompletedDetailResponse>(
    `/loan-applications/completed/${applicationId}`
  );
  return res.data.result;
}

/** 대출 심사 요청 (조건 입력 후 제출) */
export async function submitLoanApplication(
  applicationId: number,
  body: SubmitLoanApplicationRequest
): Promise<SubmitLoanApplicationResponse> {
  const res = await axiosInstance.post<SubmitLoanApplicationResponse>(
    `/loan-applications/${applicationId}/submit`,
    body
  );
  return res.data;
}

/** 대출 신청 임시저장(draft) 목록 조회 */
export async function fetchLoanDrafts(): Promise<LoanDraftItem[]> {
  const res = await axiosInstance.get<LoanDraftsResponse>("/loan-applications/drafts");
  return res.data?.result?.drafts ?? [];
}

/** 대출 신청 임시저장(draft) 삭제 */
export async function deleteLoanApplication(applicationId: number): Promise<void> {
  await axiosInstance.delete(`/loan-applications/${applicationId}`);
}

/** 대출 신청 임시저장(draft) 존재 여부 조회 */
export async function checkLoanDraft(
  productId: number
): Promise<{ hasDraft: boolean; applicationId?: number; resumeStep?: string }> {
  const res = await axiosInstance.get<CheckDraftResponse>(
    "/loan-applications/draft",
    { params: { productId } }
  );
  return res.data.result;
}

/** 대출 약관 동의 제출 (resumeStep 업데이트) */
export async function submitLoanConsents(
  applicationId: number,
  request: LoanConsentsRequest
): Promise<void> {
  await axiosInstance.post(
    `/loan-applications/${applicationId}/consents`,
    request
  );
}

/** 대출 신청 사업자 정보 조회 (resumeStep 업데이트) */
export async function fetchLoanBizInfo(
  applicationId: number
): Promise<LoanBizInfoResponse["result"]> {
  const res = await axiosInstance.post<LoanBizInfoResponse>(
    `/loan-applications/${applicationId}/biz-info`
  );
  return res.data.result;
}

/** 대출 신청 마이데이터 동의 제출 (resumeStep 업데이트) */
export async function submitLoanMydata(
  applicationId: number,
  request: LoanConsentsRequest
): Promise<void> {
  await axiosInstance.post(
    `/loan-applications/${applicationId}/mydata`,
    request
  );
}

/** 대출 신청 마이비즈데이터 연동 완료 처리 (resumeStep 업데이트) */
export async function completeLoanMybizData(applicationId: number): Promise<void> {
  await axiosInstance.post(`/loan-applications/${applicationId}/mybiz-data`);
}

/** 대출 실행 상세 조회 */
export async function fetchLoanExecutionDetail(
  applicationId: number
): Promise<LoanExecutionDetail> {
  const res = await axiosInstance.get<LoanExecutionDetailResponse>(
    `/loan-applications/${applicationId}/execution`
  );
  return res.data.result;
}

/** 1원 송금 요청 */
export async function requestAccountVerification(
  applicationId: number,
  accountNumber: string
): Promise<AccountVerificationResponse["result"]> {
  const res = await axiosInstance.post<AccountVerificationResponse>(
    `/loan-applications/${applicationId}/account-verification`,
    { accountNumber }
  );
  return res.data.result;
}

/** 인증 코드 확인 */
export async function confirmAccountVerification(
  applicationId: number,
  verificationCode: string
): Promise<boolean> {
  const res = await axiosInstance.post<AccountVerificationConfirmResponse>(
    `/loan-applications/${applicationId}/account-verification/confirm`,
    { verificationCode }
  );
  return res.data.result.accountVerified;
}

/** 대출 관리 — 실행 완료된 대출 목록 조회 */
export async function fetchLoanManagementList(): Promise<LoanManagementItem[]> {
  const res = await axiosInstance.get<LoanManagementListResponse>(
    "/loan-executions"
  );
  return res.data?.result?.executions ?? [];
}
