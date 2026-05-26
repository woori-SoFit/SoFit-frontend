import axiosInstance from "./axiosInstance";
import type { BizDataStatusResponse, BusinessInfoResponse } from "@/types/bizData";

/** My Biz Data 연결 상태 조회 */
export async function fetchBizDataStatus(): Promise<BizDataStatusResponse> {
  const res = await axiosInstance.get<BizDataStatusResponse>("/biz-data/status");
  return res.data;
}

/** 사업자 정보 조회 */
export async function fetchBusinessInfo(): Promise<BusinessInfoResponse> {
  const res = await axiosInstance.get<BusinessInfoResponse>("/businesses/me");
  return res.data;
}
