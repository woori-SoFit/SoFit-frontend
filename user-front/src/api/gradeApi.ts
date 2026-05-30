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

/** 성장 S등급 상세 리포트 API 응답 타입 */
export interface GradeDetailResult {
  sGrade: string;
  strengthKeywords: string[];
  improvementKeywords: string[];
  advice: string;
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
export async function fetchGradeResult(): Promise<GradeResult> {
  const res = await axiosInstance.get<GradeApiResponse>("/report/grade");
  return res.data.result;
}

/**
 * 성장 S등급 상세 리포트 조회
 * GET /api/report/detail
 */
export async function fetchGradeDetail(): Promise<GradeDetailResult> {
  const res = await axiosInstance.get<GradeDetailApiResponse>("/report/detail");
  return res.data.result;
}
