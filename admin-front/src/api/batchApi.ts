// import axiosInstance from '@/api/axiosInstance';
import { getMockBatchList, getMockBatchLatest } from '@/mocks/batch';
import type { BatchLatestInfo, BatchListParams, PaginatedBatchResponse } from '@/types/batch';

/**
 * S등급 배치 실행 이력을 페이징으로 조회한다.
 *
 * TODO: 백엔드 연동 시 아래 목 데이터 반환을 제거하고 실제 API 호출로 교체
 * const { data } = await axiosInstance.get<PaginatedBatchResponse>('/api/admin/dev/batch/s-grade', { params });
 * return data;
 */
export async function fetchBatchList(params: BatchListParams): Promise<PaginatedBatchResponse> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return getMockBatchList(params);
}

/**
 * 배치 주기별 최신 실행 정보를 조회한다. (카드용)
 *
 * TODO: 백엔드 연동 시 실제 API 호출로 교체
 * const { data } = await axiosInstance.get<BatchLatestInfo[]>('/api/admin/dev/batch/s-grade/latest');
 * return data;
 */
export async function fetchBatchLatest(): Promise<BatchLatestInfo[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return getMockBatchLatest();
}
