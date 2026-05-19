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
