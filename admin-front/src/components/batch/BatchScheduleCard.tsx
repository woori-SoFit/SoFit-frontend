import type { BatchItem } from '@/types/batch';
import { formatDateTime } from '@/utils/formatters';
import { getBatchStatusBadge } from '@/utils/batchUtils';

interface BatchScheduleCardProps {
  /** 가장 최근 실행된 배치 항목 (이력 배열의 0번, 없으면 null) */
  latestBatch: BatchItem | null;
}

/**
 * 자동 배치 현황 카드 — 월단위 배치 정보 표시
 * 마지막 실행 일시, 상태, 처리 건수는 실행 이력의 최신 항목에서 가져온다.
 */
export default function BatchScheduleCard({ latestBatch }: BatchScheduleCardProps) {
  const statusBadge = latestBatch ? getBatchStatusBadge(latestBatch.status) : null;

  return (
    <div className="bg-white border border-border-default rounded-lg p-5 flex-1">
      {/* 카드 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-text-secondary">
          월단위 배치
        </h3>
        <span className="text-xs text-text-disabled bg-gray-100 px-2 py-0.5 rounded">
          30일 주기
        </span>
      </div>

      {/* 정보 그리드 */}
      <div className="grid grid-cols-3 gap-4">
        {/* 배치 주기 */}
        <div>
          <p className="text-xs text-text-disabled mb-1">배치 주기</p>
          <p className="text-lg font-bold text-primary">매월 7일 03:00</p>
        </div>

        {/* 마지막 실행 */}
        <div>
          <p className="text-xs text-text-disabled mb-1">마지막 실행</p>
          {latestBatch && statusBadge ? (
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-text-primary">
                {formatDateTime(latestBatch.startedAt)}
              </p>
              <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${statusBadge.className}`}>
                {statusBadge.label}
              </span>
            </div>
          ) : (
            <p className="text-sm text-text-disabled">실행 이력 없음</p>
          )}
        </div>

        {/* 처리 건수 */}
        <div>
          <p className="text-xs text-text-disabled mb-1">처리 건수</p>
          <p className="text-lg font-bold text-text-primary">
            {latestBatch ? `${latestBatch.processedCount.toLocaleString('ko-KR')}건` : '-'}
          </p>
        </div>
      </div>

      {/* 하단 정보 */}
      <div className="mt-3 pt-3 border-t border-border-default">
        <p className="text-xs text-text-disabled mb-1">갱신 대상</p>
        <p className="text-sm text-text-secondary">전체 사업자</p>
      </div>
    </div>
  );
}
