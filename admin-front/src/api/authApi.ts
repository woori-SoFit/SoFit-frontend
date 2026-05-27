import axiosInstance from "./axiosInstance";
import type { LoginRequest, LoginResponse, AuthMeResponse } from "@/types";

/**
 * 관리자 로그인 API
 * POST /api/admin/auth/login
 */
export async function loginAdmin(payload: LoginRequest): Promise<LoginResponse> {
  const response = await axiosInstance.post<LoginResponse>(
    "/api/admin/auth/login",
    payload
  );
  return response.data;
}

/**
 * 현재 로그인 사용자 정보 조회 API
 * GET /api/admin/auth/me
 */
export async function fetchAuthMe(): Promise<AuthMeResponse> {
  const response = await axiosInstance.get<AuthMeResponse>("/api/admin/auth/me");
  return response.data;
}


