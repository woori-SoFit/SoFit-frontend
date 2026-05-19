/**
 * 인증 도메인 API 함수
 */
import axiosInstance from "./axiosInstance";
import type { LoginRequest, LoginResponse, FinancialCertVerifyRequest, FinancialCertVerifyResponse } from "@/types/auth";

/** 로그인 API 호출 */
export async function postLogin(data: LoginRequest): Promise<LoginResponse> {
  const res = await axiosInstance.post<LoginResponse>("/auth/login", data);
  return res.data;
}

/** 금융인증서 PIN 인증 API */
export async function verifyFinancialCertificate(
  params: FinancialCertVerifyRequest
): Promise<FinancialCertVerifyResponse> {
  const { data } = await axiosInstance.post<FinancialCertVerifyResponse>(
    "/auth/financial-certificate/verify",
    params
  );
  return data;
}