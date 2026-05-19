/** 로그인 요청 */
export interface LoginRequest {
  loginId: string;
  password: string;
}

/** 로그인 사용자 정보 */
export interface LoginUser {
  userId: number;
  loginId: string;
  name: string;
  role: string;
}

/** 로그인 응답 */
export interface LoginResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: LoginUser;
}

/** 금융인증서 PIN 인증 요청 파라미터 */
export interface FinancialCertVerifyRequest {
  phoneNumber: string;
  pin: string;
}

/** 금융인증서 PIN 인증 결과 */
export interface FinancialCertVerifyResult {
  certId: number;
  certNumber: string;
  holderName: string;
  phoneNumber: string;
  status: string;
  verifiedAt: string;
}

/** 금융인증서 PIN 인증 응답 */
export interface FinancialCertVerifyResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: FinancialCertVerifyResult;
}