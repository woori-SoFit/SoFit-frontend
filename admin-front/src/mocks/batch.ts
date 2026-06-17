import type { BatchItem, BatchListParams, PaginatedBatchResponse } from '@/types/batch';

const MOCK_BATCHES: BatchItem[] = [
  {
    id: 1,
    status: 'COMPLETED',
    processedCount: 142,
    elapsedSeconds: 204,
    errorMessage: null,
    startedAt: '2026-05-26T02:00:00',
    finishedAt: '2026-05-26T02:03:24',
  },
  {
    id: 2,
    status: 'COMPLETED',
    processedCount: 98,
    elapsedSeconds: 156,
    errorMessage: null,
    startedAt: '2026-05-25T02:00:00',
    finishedAt: '2026-05-25T02:02:36',
  },
  {
    id: 3,
    status: 'FAILED',
    processedCount: 37,
    elapsedSeconds: 89,
    errorMessage: 'AI 서버 연결 타임아웃 (30s 초과) - FastAPI 서버 응답 없음, 재시도 3회 실패 후 배치 중단됨',
    startedAt: '2026-05-24T02:00:00',
    finishedAt: '2026-05-24T02:01:29',
  },
  {
    id: 4,
    status: 'COMPLETED',
    processedCount: 215,
    elapsedSeconds: 312,
    errorMessage: null,
    startedAt: '2026-05-23T02:00:00',
    finishedAt: '2026-05-23T02:05:12',
  },
  {
    id: 5,
    status: 'COMPLETED',
    processedCount: 176,
    elapsedSeconds: 267,
    errorMessage: null,
    startedAt: '2026-05-22T02:00:00',
    finishedAt: '2026-05-22T02:04:27',
  },
  {
    id: 6,
    status: 'FAILED',
    processedCount: 0,
    elapsedSeconds: 3,
    errorMessage: 'ML 모델 파일 로드 실패: models/lgbm_v2.pkl not found - 서버 디스크 마운트 해제로 인한 파일 시스템 접근 불가',
    startedAt: '2026-05-21T02:00:00',
    finishedAt: '2026-05-21T02:00:03',
  },
  {
    id: 7,
    status: 'COMPLETED',
    processedCount: 130,
    elapsedSeconds: 198,
    errorMessage: null,
    startedAt: '2026-05-20T02:00:00',
    finishedAt: '2026-05-20T02:03:18',
  },
  {
    id: 8,
    status: 'COMPLETED',
    processedCount: 88,
    elapsedSeconds: 134,
    errorMessage: null,
    startedAt: '2026-05-19T02:00:00',
    finishedAt: '2026-05-19T02:02:14',
  },
  {
    id: 9,
    status: 'COMPLETED',
    processedCount: 201,
    elapsedSeconds: 290,
    errorMessage: null,
    startedAt: '2026-05-18T02:00:00',
    finishedAt: '2026-05-18T02:04:50',
  },
  {
    id: 10,
    status: 'COMPLETED',
    processedCount: 165,
    elapsedSeconds: 245,
    errorMessage: null,
    startedAt: '2026-05-17T02:00:00',
    finishedAt: '2026-05-17T02:04:05',
  },
];

/**
 * Mock 배치 이력을 페이징하여 반환한다.
 */
export function getMockBatchList(params: BatchListParams): PaginatedBatchResponse {
  const sorted = [...MOCK_BATCHES].sort(
    (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
  );

  const totalCount = sorted.length;
  const totalPages = Math.ceil(totalCount / params.size) || 1;
  const start = (params.page - 1) * params.size;
  const batches = sorted.slice(start, start + params.size);

  return { batches, totalCount, totalPages, currentPage: params.page, size: params.size };
}
