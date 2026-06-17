import type { BatchItem } from '@/types/batch';
import { formatDateTime } from '@/utils/formatters';
import { getBatchStatusBadge } from '@/utils/batchUtils';

interface BatchTableProps {
  data: BatchItem[];
}

/** 소요 시간을 읽기 쉬운 형식으로 변환 */
function formatElapsed(seconds: number): string {
  if (seconds < 60) return `${seconds}초`;
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return sec > 0 ? `${min}분 ${sec}초` : `${min}분`;
}

/**
 * S등급 배치 실행 이력 테이블
 */
export default function BatchTable({ data }: BatchTableProps) {
  return (
    <div className="overflow-visible rounded-lg border border-border-default bg-bg-surface shadow-card">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border-default bg-gray-50">
            <th className="px-4 py-3 text-xs font-semibold text-text-secondary text-center w-14">ID</th>
            <th className="px-4 py-3 text-xs font-semibold text-text-secondary text-center w-20">상태</th>
            <th className="px-4 py-3 text-xs font-semibold text-text-secondary text-center w-28">처리 건수</th>
            <th className="px-4 py-3 text-xs font-semibold text-text-secondary text-center w-24">소요 시간</th>
            <th className="px-4 py-3 text-xs font-semibold text-text-secondary text-center w-36">시작 일시</th>
            <th className="px-4 py-3 text-xs font-semibold text-text-secondary text-center w-36">종료 일시</th>
            <th className="px-4 py-3 text-xs font-semibold text-text-secondary text-left">에러 메시지</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-12 text-center text-sm text-text-disabled">
                배치 실행 이력이 없습니다.
              </td>
            </tr>
          ) : (
            data.map((row) => {
              const statusBadge = getBatchStatusBadge(row.status);
              return (
                <tr
                  key={row.id}
                  className="border-b border-border-default last:border-b-0 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 text-center font-mono text-xs">{row.id}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${statusBadge.className}`}>
                      {statusBadge.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">{row.processedCount.toLocaleString('ko-KR')}건</td>
                  <td className="px-4 py-3 text-center">{formatElapsed(row.elapsedSeconds)}</td>
                  <td className="px-4 py-3 text-center text-xs">{formatDateTime(row.startedAt)}</td>
                  <td className="px-4 py-3 text-center text-xs">{formatDateTime(row.finishedAt)}</td>
                  <td className="px-4 py-3 text-xs text-red-600 relative group">
                    <span className="block truncate max-w-xs cursor-default">
                      {row.errorMessage ?? '-'}
                    </span>
                    {row.errorMessage && (
                      <div className="absolute left-4 bottom-full mb-2 z-50 hidden group-hover:block max-w-sm px-3 py-2 text-xs text-red-700 bg-white border border-border-default rounded-lg whitespace-pre-wrap">
                        {row.errorMessage}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
