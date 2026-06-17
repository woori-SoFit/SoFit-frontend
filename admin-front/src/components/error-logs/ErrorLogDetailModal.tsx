import type { ErrorLogItem } from '@/types/errorLog';
import { formatDateTime } from '@/utils/formatters';

interface ErrorLogDetailModalProps {
  log: ErrorLogItem;
  onClose: () => void;
}

/**
 * 에러 로그 상세 모달
 */
export default function ErrorLogDetailModal({ log, onClose }: ErrorLogDetailModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="error-log-detail-title"
    >
      <div
        className="bg-white rounded-lg w-full max-w-4xl max-h-[80vh] overflow-y-auto mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-default">
          <h2 id="error-log-detail-title" className="text-lg font-semibold text-text-primary">
            에러 상세
          </h2>
          <button
            onClick={onClose}
            className="text-text-disabled hover:text-text-primary transition-colors"
            aria-label="닫기"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 본문 */}
        <div className="px-6 py-4 space-y-4">
          {/* 기본 정보 그리드 */}
          <div className="grid grid-cols-2 gap-4">
            <InfoField label="레벨" value={log.level} />
            <InfoField label="서버" value={log.serverName} />
            <InfoField label="에러코드" value={log.errorCode} />
            <InfoField label="에러 클래스" value={log.errorClass} />
            <InfoField label="HTTP 상태" value={`${log.httpMethod} ${log.statusCode}`} />
            <InfoField label="엔드포인트" value={`${log.httpMethod} ${log.endpoint}`} />
            <InfoField label="발생 시각" value={formatDateTime(log.occurredAt)} />
            {log.loanApplicationId && (
              <InfoField label="대출 신청 ID" value={log.loanApplicationId} />
            )}
          </div>

          {/* 메시지 */}
          <div>
            <p className="text-xs font-medium text-text-secondary mb-1">메시지</p>
            <p className="text-sm text-text-primary bg-gray-50 px-3 py-2 rounded-md">
              {log.message}
            </p>
          </div>

          {/* 스택 트레이스 */}
          <div>
            <p className="text-xs font-medium text-text-secondary mb-1">스택 트레이스</p>
            <pre className="text-xs text-white bg-black px-4 py-3 rounded-md overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
              {log.stackTrace}
            </pre>
          </div>
        </div>

        {/* 푸터 */}
        <div className="px-6 py-3 border-t border-border-default flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-text-secondary bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-text-secondary">{label}</p>
      <p className="text-sm text-text-primary mt-0.5 font-mono">{value}</p>
    </div>
  );
}
