/**
 * 약관 도메인 API 함수
 */
import axiosInstance from "./axiosInstance";
import type { TermsItem, TermType } from "@/types/common";
import type { TermsApiResponse, TermsConsentsRequest } from "@/types/terms";

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

/** 공통 약관 동의 제출 (대출/마이데이터 약관 제외) */
export async function submitTermsConsents(request: TermsConsentsRequest): Promise<void> {
  await axiosInstance.post("/terms/consents", request);
}
