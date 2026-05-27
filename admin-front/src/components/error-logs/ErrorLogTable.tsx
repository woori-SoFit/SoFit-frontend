import { useState } from 'react';
import type { ErrorLogItem } from '@/types/errorLog';
import { formatDateTime } from '@/utils/formatters';
import ErrorLogDetailModal from './ErrorLogDetailModal';

interface ErrorLogTableProps {
  data: ErrorLogItem[];
}

/** 레벨별 배지 스타일 */
function getLevelBadge(level: string) {
  if (level === 'ERROR') {
    return 'bg-red-100 text-red-700';
  }
  return 'bg-yellow-100 text-yellow-700';
}

/** HTTP 상태 코드별 색상 */
function getStatusCodeColor(code: number) {
  if (code >= 500) return 'text-red-600 font-semibold';
  if (code >= 400) return 'text-yellow-600 font-semibold';
  return 'text-text-secondary';
}

/**
 * 에러 로그 테이블 컴포넌트
 * - 행 클릭 시 모달로 상세 정보(스택 트레이스 포함) 표시
 */
export default function ErrorLogTable({ data }: ErrorLogTableProps) {
  const [selectedLog, setSelectedLog] = useState<ErrorLogItem | null>(null);

  return (
    <>
      <div className="bg-white border border-border-default rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-border-default">
              <th className="px-4 py-3 text-left font-medium text-text-secondary w-20">레벨</th>
              <th className="px-4 py-3 text-left font-medium text-text-secondary w-28">서버</th>
              <th className="px-4 py-3 text-left font-medium text-text-secondary w-28">에러코드</th>
              <th className="px-4 py-3 text-left font-medium text-text-secondary">메시지</th>
              <th className="px-4 py-3 text-left font-medium text-text-secondary w-64">엔드포인트</th>
              <th className="px-4 py-3 text-center font-medium text-text-secondary w-16">상태</th>
              <th className="px-4 py-3 text-left font-medium text-text-secondary w-36">발생 시각</th>
            </tr>
          </thead>
          <tbody>
            {data.map((log) => (
              <tr
                key={log.id}
                onClick={() => setSelectedLog(log)}
                className="border-b border-border-default last:border-b-0 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getLevelBadge(log.level)}`}>
                    {log.level}
                  </span>
                </td>
                <td className="px-4 py-3 text-text-secondary font-mono text-xs">
                  {log.serverName}
                </td>
                <td className="px-4 py-3 text-text-primary font-mono text-xs font-semibold">
                  {log.errorCode}
                </td>
                <td className="px-4 py-3 text-text-primary truncate max-w-xs">
                  {log.message}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-text-secondary truncate max-w-56">
                  <span className="text-text-disabled mr-1">{log.httpMethod}</span>
                  {log.endpoint}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={getStatusCodeColor(log.statusCode)}>
                    {log.statusCode}
                  </span>
                </td>
                <td className="px-4 py-3 text-text-secondary text-xs">
                  {formatDateTime(log.occurredAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 상세 모달 */}
      {selectedLog && (
        <ErrorLogDetailModal
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
        />
      )}
    </>
  );
}
