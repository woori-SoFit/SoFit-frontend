/**
 * 약관 도메인 API 함수
 */
import axiosInstance from "./axiosInstance";
import type { TermsItem, TermType } from "@/types/common";

/** 약관 목록 조회 API 응답 */
interface TermsApiResponse {
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

/** 약관 목록 조회 */
export async function fetchTerms(termType: TermType): Promise<TermsItem[]> {
  const res = await axiosInstance.get<TermsApiResponse>("/terms", {
    params: { termType },
  });

  return (res.data.result?.terms ?? []).map((term) => ({
    id: term.termId,
    title: term.title,
    content: "",
    required: term.isRequired,
    fileUrl: term.fileUrl,
  }));
}
