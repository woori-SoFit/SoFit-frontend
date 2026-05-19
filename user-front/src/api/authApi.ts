import axiosInstance from "./axiosInstance";
import type {
  FinancialCertVerifyRequest,
  FinancialCertVerifyResponse,
} from "@/types/auth";

/**
 * 금융인증서 PIN 인증 API
 * POST /api/auth/financial-certificate/verify
 */
export async function verifyFinancialCertificate(
  params: FinancialCertVerifyRequest
): Promise<FinancialCertVerifyResponse> {
  const { data } = await axiosInstance.post<FinancialCertVerifyResponse>(
    "/auth/financial-certificate/verify",
    params
  );
  return data;
}
