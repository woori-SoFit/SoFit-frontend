// import axiosInstance from '@/api/axiosInstance';
import { getMockErrorLogs } from '@/mocks/errorLogs';
import type { ErrorLogListParams, PaginatedErrorLogResponse } from '@/types/errorLog';

/**
 * 에러 로그 목록을 페이징으로 조회한다.
 *
 * TODO: 백엔드 연동 시 아래 목 데이터 반환을 제거하고 실제 API 호출로 교체
 * const { data } = await axiosInstance.get<PaginatedErrorLogResponse>('/api/admin/dev/errors', { params });
 * return data;
 */
export async function fetchErrorLogs(params: ErrorLogListParams): Promise<PaginatedErrorLogResponse> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return getMockErrorLogs(params);
}
