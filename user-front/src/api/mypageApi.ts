/**
 * 마이페이지 도메인 API 함수
 */
import axiosInstance from "./axiosInstance";
import type {
  BusinessInfoResponse,
  UserProfileResponse,
} from "@/types/mypage";

/** 사용자 프로필 상세 조회 */
export async function fetchUserProfile(): Promise<UserProfileResponse> {
  const res = await axiosInstance.get<UserProfileResponse>("/users/me");
  return res.data;
}

/** 사업자 정보 조회 */
export async function fetchBusinessInfo(): Promise<BusinessInfoResponse> {
  const res = await axiosInstance.get<BusinessInfoResponse>("/businesses/me");
  return res.data;
}

/** 로그아웃 */
export async function postLogout(): Promise<void> {
  await axiosInstance.post("/auth/logout");
}

/** 회원 탈퇴 */
export async function deleteAccount(): Promise<void> {
  await axiosInstance.delete("/users/me");
}
