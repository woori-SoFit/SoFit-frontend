import type { HealthStatus } from '@/types/serverHealth';
import { getStatusColor, formatRelativeTime } from '@/types/serverHealth';

interface ServerStatusRowProps {
  /** 서버/서비스 이름 */
  name: string;
  /** 서버 상태 */
  status: HealthStatus;
  /** 응답 시간 (ms) */
  responseMs: number;
  /** 마지막 체크 시각 (ISO 8601) */
  lastCheckedAt: string;
}

/** 상태별 표시 텍스트 */
const STATUS_LABEL: Record<HealthStatus, string> = {
  UP: '정상',
  SLOW: '지연',
  DOWN: '장애',
};

/** Tailwind 색상 클래스 매핑 */
const COLOR_CLASSES = {
  green: {
    dot: 'bg-green-500',
    badge: 'bg-green-100 text-green-700',
    text: 'text-green-600',
  },
  orange: {
    dot: 'bg-amber-500',
    badge: 'bg-amber-100 text-amber-700',
    text: 'text-amber-600',
  },
  red: {
    dot: 'bg-red-500',
    badge: 'bg-red-100 text-red-700',
    text: 'text-red-600',
  },
} as const;

/**
 * 개별 서버 상태 행 컴포넌트.
 * 서버 이름, 상태 뱃지, 응답시간, 상대 시간을 표시한다.
 */
export default function ServerStatusRow({
  name,
  status,
  responseMs,
  lastCheckedAt,
}: ServerStatusRowProps) {
  const color = getStatusColor(status);
  const classes = COLOR_CLASSES[color];

  return (
    <div className="flex items-center gap-4 py-3">
      {/* 왼쪽: 상태 인디케이터 + 서버 이름 */}
      <div className="flex items-center gap-2 min-w-[120px]">
        <span className={`h-2.5 w-2.5 rounded-full ${classes.dot}`} />
        <span className="text-sm font-medium text-gray-900">{name}</span>
      </div>

      {/* 중간: 상태 뱃지 */}
      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${classes.badge}`}>
        {STATUS_LABEL[status]}
      </span>

      {/* 오른쪽: 응답시간 + 상대 시간 */}
      <div className="ml-auto flex items-center gap-3">
        {status === 'DOWN' ? (
          <span className={`text-sm font-medium ${classes.text}`}>—</span>
        ) : (
          <span className={`text-sm font-medium ${classes.text}`}>{responseMs}ms</span>
        )}
        <span className="text-xs text-gray-400">{formatRelativeTime(lastCheckedAt)}</span>
      </div>
    </div>
  );
}
