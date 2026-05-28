/**
 * 약관 도메인 타입 정의
 */

/** 약관 목록 조회 API 응답 */
export interface TermsApiResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    terms: Array<{
      termId: number;
      termType: string;
      version: string;
      title: string;
      fileUrl: string;
      isRequired: boolean;
      effectiveAt: string;
    }>;
  };
}

/** 약관 동의 요청 바디 */
export interface TermsConsentsRequest {
  termType: string;
  applicationId?: number;
  consents: Array<{
    termId: number;
    isConsented: boolean;
  }>;
}
