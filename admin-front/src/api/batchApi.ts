import axiosInstance from '@/api/axiosInstance';
import type { BatchListParams, BatchType, PaginatedBatchApiResponse, PaginatedBatchResponse } from '@/types/batch';

/**
 * S등급 배치 실행 이력을 페이징으로 조회한다.
 * GET /api/admin/dev/batch/s-grade
 *
 * axiosInstance 인터셉터가 공통 래퍼의 result를 자동 언래핑한다.
 */
export async function fetchBatchList(params: BatchListParams): Promise<PaginatedBatchResponse> {
  const { data } = await axiosInstance.get<PaginatedBatchApiResponse>('/api/admin/dev/batch/s-grade', {
    params: { page: params.page - 1, size: params.size },
  });

  return {
    batches: data.contents,
    totalCount: data.totalCount,
    totalPages: data.totalPages,
    currentPage: data.currentPage + 1,
    size: data.size,
  };
}

/**
 * 시스템 심사 배치 실행 이력을 페이징으로 조회한다.
 * GET /api/admin/dev/batch/loan-decision
 */
export async function fetchLoanDecisionBatchList(params: BatchListParams): Promise<PaginatedBatchResponse> {
  const { data } = await axiosInstance.get<PaginatedBatchApiResponse>('/api/admin/dev/batch/loan-decision', {
    params: { page: params.page - 1, size: params.size },
  });

  return {
    batches: data.contents,
    totalCount: data.totalCount,
    totalPages: data.totalPages,
    currentPage: data.currentPage + 1,
    size: data.size,
  };
}

/**
 * 수동 배치를 실행한다.
 *
 * - S등급 산출: POST /api/admin/dev/batch/s-grade/trigger
 * - 시스템 심사: POST /api/admin/dev/batch/loan-decision
 */
export async function triggerManualBatch(batchType: BatchType): Promise<{ message: string }> {
  const endpoint = batchType === 'S_GRADE'
    ? '/api/admin/dev/batch/s-grade/trigger'
    : '/api/admin/dev/batch/loan-decision/trigger';

  const { data } = await axiosInstance.post(endpoint);
  return data;
}

