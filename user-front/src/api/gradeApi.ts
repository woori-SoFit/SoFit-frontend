import axiosInstance from "./axiosInstance";

/** 성장 S등급 조회 API 응답 타입 */
export interface GradeResult {
  evaluationId: number;
  userId: number;
  sGrade: string;
  comment: string;
  commentDetail: string;
  createdAt: string;
}

/** fetchGradeResult 반환 타입 */
export interface GradeResultResponse {
  result: GradeResult | null;
  message: string;
}

/** 성장 S등급 상세 리포트 API 응답 타입 */
export interface GradeDetailResult {
  sGrade: string;
  strengthKeywords: string[];
  improvementKeywords: string[];
  advice: string;
  /** GradeResult에서 병합되는 필드 (리포트 페이지에서 사용) */
  comment?: string;
  commentDetail?: string;
}

interface GradeApiResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: GradeResult;
}

interface GradeDetailApiResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: GradeDetailResult;
}

/**
 * 성장 S등급 결과 조회
 * GET /api/report/grade
 */
export async function fetchGradeResult(): Promise<GradeResultResponse> {
  const res = await axiosInstance.get<GradeApiResponse>("/report/grade");
  return {
    result: res.data.result ?? null,
    message: res.data.message,
  };
}

/**
 * 성장 S등급 상세 리포트 조회
 * GET /api/report/detail
 */
export async function fetchGradeDetail(): Promise<GradeDetailResult> {
  const res = await axiosInstance.get<GradeDetailApiResponse>("/report/detail");
  return res.data.result;
}
