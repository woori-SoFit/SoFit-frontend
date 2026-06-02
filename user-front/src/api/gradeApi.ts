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

interface GradeApiResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: GradeResult;
}

/**
 * 성장 S등급 결과 조회
 * GET /api/report/grade
 */
export async function fetchGradeResult(): Promise<GradeResult> {
  const res = await axiosInstance.get<GradeApiResponse>("/report/grade");
  return res.data.result;
}
