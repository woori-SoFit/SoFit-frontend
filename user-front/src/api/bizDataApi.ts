import axiosInstance from "./axiosInstance";
import type { BizDataStatusResponse } from "@/types/bizData";

/** My Biz Data 연결 상태 조회 */
export async function fetchBizDataStatus(): Promise<BizDataStatusResponse> {
  const res = await axiosInstance.get<BizDataStatusResponse>("/biz-data/status");
  return res.data;
}
