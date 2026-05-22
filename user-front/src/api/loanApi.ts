/**
 * 대출 도메인 API 함수
 */
import axiosInstance from "./axiosInstance";
import type {
  LoanProductListItem,
  LoanProductListResponse,
  LoanProductDetail,
  LoanProductDetailResponse,
  LoanProductOptionsResponse
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
