/**
 * 인증 도메인 API 함수
 */
import axiosInstance from "./axiosInstance";
import type {
  LoginRequest,
  LoginResponse,
  MeResponse,
  FinancialCertVerifyRequest,
  FinancialCertVerifyResponse,
  FinancialCertLookupRequest,
  FinancialCertLookupResponse,
} from "@/types/auth";

/** 로그인 API 호출 */
export async function postLogin(data: LoginRequest): Promise<LoginResponse> {
  const res = await axiosInstance.post<LoginResponse>("/auth/login", data);
  // 로그인 성공 시 세션 만료 감지용 플래그 설정
  if (res.data.isSuccess) {
    sessionStorage.setItem("wasLoggedIn", "true");
  }
  return res.data;
}

/** 현재 로그인 사용자 정보 조회 (항상 200 응답, code로 분기) */
export async function fetchMe(): Promise<MeResponse> {
  const res = await axiosInstance.get<MeResponse>("/users/me");
  return res.data;
}

/** 금융인증서 조회 API */
export async function lookupFinancialCert(
  params: FinancialCertLookupRequest
): Promise<FinancialCertLookupResponse> {
  const { data } = await axiosInstance.post<FinancialCertLookupResponse>(
    "/financial-cert/lookup",
    params
  );
  return data;
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
    "/auth/signup/verify-pin",
    params
  );
  return data;
}
