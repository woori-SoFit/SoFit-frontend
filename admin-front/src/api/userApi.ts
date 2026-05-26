import type {
  UserListParams,
  PaginatedUserResponse,
  UserStatistics,
  UserDownloadParams,
} from '@/types/user';
import { getMockUsers, getMockUserStatistics } from '@/mocks/userManagement';

/**
 * 사용자 목록을 페이징으로 조회합니다.
 * 현재는 Mock 데이터를 반환하며, 향후 axiosInstance를 통한 실제 API 호출로 교체합니다.
 */
export async function fetchUsers(
  params: UserListParams,
): Promise<PaginatedUserResponse> {
  // TODO: 실제 API 연동 시 교체
  // const response = await axiosInstance.get<PaginatedUserResponse>(
  //   '/api/admin/users',
  //   { params }
  // );
  // return response.data;

  return getMockUsers(params);
}

/**
 * 사용자 통계 데이터를 조회합니다.
 */
export async function fetchUserStatistics(): Promise<UserStatistics> {
  // TODO: 실제 API 연동 시 교체
  // const response = await axiosInstance.get<UserStatistics>(
  //   '/api/admin/users/statistics'
  // );
  // return response.data;

  return getMockUserStatistics();
}

/**
 * 현재 필터 조건에 해당하는 사용자 목록을 엑셀 파일로 다운로드합니다.
 */
export async function downloadUsersExcel(
  _params: UserDownloadParams,
): Promise<Blob> {
  // TODO: 실제 API 연동 시 교체
  // const response = await axiosInstance.get('/api/admin/users/download', {
  //   params,
  //   responseType: 'blob',
  // });
  // return response.data;

  return new Blob(['mock excel data'], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}
