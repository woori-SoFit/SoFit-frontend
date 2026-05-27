import type { BatchLatestInfo } from '@/types/batch';
import { formatDateTime } from '@/utils/formatters';
import { getBatchStatusBadge } from '@/utils/batchUtils';

interface BatchScheduleCardProps {
  latest: BatchLatestInfo;
}

/** 주기별 고정 정보 */
const CYCLE_CONFIG: Record<string, { label: string; badge: string; schedule: string; target: string }> = {
  DAILY: {
    label: '일단위 배치',
    badge: '24시간 주기',
    schedule: '매일 02:00',
    target: '신규 사업자 + 대출 신청자',
  },
  MONTHLY: {
    label: '월단위 배치',
    badge: '30일 주기',
    schedule: '매월 7일 03:00',
    target: '전체 사업자',
  },
};

/** CYCLE_CONFIG에 없는 값이 들어올 경우 사용할 기본값 */
const DEFAULT_CYCLE_CONFIG = {
  label: '알 수 없는 배치',
  badge: '주기 미정',
  schedule: '-',
  target: '-',
};

/**
 * 자동 배치 현황 카드 — 일단위/월단위 각각 표시
 * 고정값(주기, 대상)은 상수, 동적값(마지막 실행, 상태, 처리 건수)은 API에서 가져옴
 */
export default function BatchScheduleCard({ latest }: BatchScheduleCardProps) {
  const config = CYCLE_CONFIG[latest.cycle] ?? DEFAULT_CYCLE_CONFIG;
  const statusBadge = getBatchStatusBadge(latest.lastStatus);

  return (
    <div className="bg-white border border-border-default rounded-lg p-5 flex-1">
      {/* 카드 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-text-secondary">
          {config.label}
        </h3>
        <span className="text-xs text-text-disabled bg-gray-100 px-2 py-0.5 rounded">
          {config.badge}
        </span>
      </div>

      {/* 정보 그리드 */}
      <div className="grid grid-cols-3 gap-4">
        {/* 배치 주기 */}
        <div>
          <p className="text-xs text-text-disabled mb-1">배치 주기</p>
          <p className="text-lg font-bold text-primary">{config.schedule}</p>
        </div>

        {/* 마지막 실행 */}
        <div>
          <p className="text-xs text-text-disabled mb-1">마지막 실행</p>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-text-primary">
              {formatDateTime(latest.lastExecutedAt)}
            </p>
            <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${statusBadge.className}`}>
              {statusBadge.label}
            </span>
          </div>
        </div>

        {/* 처리 건수 */}
        <div>
          <p className="text-xs text-text-disabled mb-1">처리 건수</p>
          <p className="text-lg font-bold text-text-primary">
            {latest.processedCount.toLocaleString('ko-KR')}건
          </p>
        </div>
      </div>

      {/* 하단 정보 */}
      <div className="mt-3 pt-3 border-t border-border-default">
        <p className="text-xs text-text-disabled mb-1">갱신 대상</p>
        <p className="text-sm text-text-secondary">{config.target}</p>
      </div>
    </div>
  );
}
