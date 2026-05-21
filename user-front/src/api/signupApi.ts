/**
 * 회원가입 도메인 API 함수
 * TODO: API 연동 시 활성화
 */
import axiosInstance from "./axiosInstance";
import type {
  KycVerifyRequest,
  KycVerifyResponse,
  CheckLoginIdResponse,
  SignupRequest,
  SignupResponse,
} from "@/types/signup";

export type { KycVerifyRequest, KycVerifyResponse, CheckLoginIdResponse, SignupRequest, SignupResponse };

/** KYC 사업자등록번호 진위 확인 API */
export async function verifyKyc(
  businessNumber: string
): Promise<KycVerifyResponse> {
  const { data } = await axiosInstance.post<KycVerifyResponse>(
    "/auth/signup/business-verification",
    { businessNumber } satisfies KycVerifyRequest
  );
  return data;
}

/** 아이디 중복 확인 API */
export async function checkLoginId(
  loginId: string
): Promise<CheckLoginIdResponse> {
  const { data } = await axiosInstance.get<CheckLoginIdResponse>(
    "/auth/signup/check-login-id",
    { params: { loginId } }
  );
  return data;
}

/** 회원가입 API */
export async function submitSignup(
  requestData: SignupRequest
): Promise<SignupResponse> {
  const { data } = await axiosInstance.post<SignupResponse>(
    "/auth/signup/complete",
    requestData
  );
  return data;
}
