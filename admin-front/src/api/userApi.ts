import axiosInstance from './axiosInstance';
import type {
  UserListParams,
  PaginatedUserResponse,
  UserListItemRaw,
  UserStatistics,
} from '@/types/user';
import type { PaginatedResponse } from '@/types/common';

/**
 * 사용자 목록을 페이징으로 조회합니다.
 * GET /api/admin/users
 */
export async function fetchUsers(
  params: UserListParams,
): Promise<PaginatedUserResponse> {
  const { data } = await axiosInstance.get<PaginatedResponse<UserListItemRaw>>(
    '/api/admin/users',
    { params }
  );

  return {
    users: data.contents.map((item) => ({
      id: item.id,
      loginId: item.loginId,
      name: item.name,
      role: item.role,
      status: item.status,
      phone: item.phoneNumber,
      createdAt: item.createdAt,
    })),
    totalCount: data.totalCount,
    totalPages: data.totalPages,
    currentPage: data.currentPage,
    size: data.size,
  };
}

/**
 * 사용자 통계 데이터를 조회합니다.
 * GET /api/admin/users/statistics
 */
export async function fetchUserStatistics(): Promise<UserStatistics> {
  const { data } = await axiosInstance.get<UserStatistics>(
    '/api/admin/users/statistics'
  );
  return data;
}
