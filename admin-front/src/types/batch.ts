/** 배치 실행 상태 */
export type BatchStatus = 'SUCCESS' | 'FAILED' | 'RUNNING';

/** 배치 주기 타입 */
export type BatchCycle = 'DAILY' | 'MONTHLY';

/** S등급 배치 실행 이력 항목 */
export interface BatchItem {
  id: number;
  /** 배치 실행 상태 */
  status: BatchStatus;
  /** 배치 주기 */
  cycle: BatchCycle;
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

/** S등급 배치 목록 페이징 응답 */
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
}

/** 배치 주기별 최신 실행 정보 (카드용) */
export interface BatchLatestInfo {
  cycle: BatchCycle;
  /** 마지막 실행 일시 (ISO 8601) */
  lastExecutedAt: string;
  /** 마지막 실행 상태 */
  lastStatus: BatchStatus;
  /** 처리된 건수 */
  processedCount: number;
}
