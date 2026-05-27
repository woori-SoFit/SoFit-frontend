/** KYC 사업자등록번호 진위 확인 요청 */
export interface KycVerifyRequest {
  businessNumber: string;
}

/** KYC 사업자등록번호 진위 확인 응답 */
export interface KycVerifyResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result?: unknown;
}

/** 아이디 중복 확인 응답 */
export interface CheckLoginIdResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: { available: boolean };
}

/** 약관 동의 항목 */
export interface ConsentItem {
  termId: number;
  isConsented: boolean;
}

/** 회원가입 요청 */
export interface SignupRequest {
  name: string;
  residentNumber: string;
  phoneNumber: string;
  loginId: string;
  password: string;
  consents: ConsentItem[];
}

/** 회원가입 응답 */
export interface SignupResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: { userId: number; loginId: string; name: string; role: string };
}
