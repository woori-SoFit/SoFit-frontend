/**
 * 인증 도메인 API 함수
 */
import axiosInstance from "./axiosInstance";
import type { LoginRequest, LoginResponse, MeResponse, FinancialCertVerifyRequest, FinancialCertVerifyResponse } from "@/types/auth";

/** 로그인 API 호출 */
export async function postLogin(data: LoginRequest): Promise<LoginResponse> {
  const res = await axiosInstance.post<LoginResponse>("/auth/login", data);
  return res.data;
}

/** 현재 로그인 사용자 정보 조회 (항상 200 응답, code로 분기) */
export async function fetchMe(): Promise<MeResponse> {
  const res = await axiosInstance.get<MeResponse>("/users/me");
  return res.data;
}

/** 금융인증서 PIN 인증 API */
export async function verifyFinancialCertificate(
  params: FinancialCertVerifyRequest
): Promise<FinancialCertVerifyResponse> {
  const { data } = await axiosInstance.post<FinancialCertVerifyResponse>(
    "/financial-cert/verify-pin",
    params
  );
  return data;
}

/** 회원가입용 금융인증서 PIN 인증 API */
export async function verifyPinForSignup(
  params: FinancialCertVerifyRequest
): Promise<FinancialCertVerifyResponse> {
  const { data } = await axiosInstance.post<FinancialCertVerifyResponse>(
    "/auth/verify-pin",
    params
  );
  return data;
}
