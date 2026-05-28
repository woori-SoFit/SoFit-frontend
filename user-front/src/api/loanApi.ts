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
