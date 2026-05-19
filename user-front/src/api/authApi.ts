/**
 * 인증 도메인 API 함수
 */
import axiosInstance from "./axiosInstance";
import type { LoginRequest, LoginResponse } from "@/types/auth";

/** 로그인 API 호출 */
export async function postLogin(data: LoginRequest): Promise<LoginResponse> {
  const res = await axiosInstance.post<LoginResponse>("/auth/login", data);
  return res.data;
}
