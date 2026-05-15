/**
 * 대출 도메인 API 함수
 */
import axiosInstance from "./axiosInstance";
import type {
  LoanProductListItem,
  LoanProductListResponse,
  LoanProductDetail,
  LoanProductDetailResponse,
} from "@/types/loan";

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
