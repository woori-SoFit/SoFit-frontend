/** 배치 실행 상태 */
export type BatchStatus = 'COMPLETED' | 'FAILED' | 'RUNNING' | 'SUCCESS' | 'FAIL';

/** 배치 종류 */
export type BatchType = 'S_GRADE' | 'SYSTEM_REVIEW';

/** S등급 배치 실행 이력 항목 */
export interface BatchItem {
  id: number;
  /** 배치 실행 상태 */
  status: BatchStatus;
  /** 처리된 건수 */
  processedCount: number;
  /** 소요 시간 (초) */
  elapsedSeconds: number;
  /** 에러 메시지 (실패 시) */
  errorMessage: string | null;
  /** 시작 일시 (ISO 8601) */
  startedAt: string;
  /** 종료 일시 (ISO 8601) */
  finishedAt: string;
}

/** S등급 배치 목록 페이징 API 응답 (result 언래핑 후) */
export interface PaginatedBatchApiResponse {
  contents: BatchItem[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  size: number;
}

/** S등급 배치 목록 페이징 응답 (UI용) */
export interface PaginatedBatchResponse {
  batches: BatchItem[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  size: number;
}

/** S등급 배치 목록 조회 파라미터 */
export interface BatchListParams {
  page: number;
  size: number;
  batchType?: BatchType;
}
