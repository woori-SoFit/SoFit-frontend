import type { ReviewStatus } from '@/types';

interface StatusBadgeProps {
  status: ReviewStatus | string;
}

export const STATUS_CONFIG: Record<ReviewStatus, { label: string; className: string }> = {
  SUBMITTED: { label: '접수 완료', className: 'bg-text-secondary/10 text-text-secondary' },
  SYSTEM_APPROVED: { label: '은행원 심사 대기', className: 'bg-warning/10 text-warning' },
  SYSTEM_REJECTED: { label: '은행원 심사 대기', className: 'bg-warning/10 text-warning' },
  MANAGER_REVIEW: { label: '최종 심사', className: 'bg-info/10 text-info' },
  APPROVED: { label: '승인 완료', className: 'bg-success/10 text-success' },
  REJECTED: { label: '거절 완료', className: 'bg-error/10 text-error' },
  EXECUTED: { label: '실행 완료', className: 'bg-success/20 text-success' },
};

/**
 * 심사 상태를 색상 뱃지로 표시하는 컴포넌트.
 * 알 수 없는 상태값은 원본 텍스트를 회색 배경으로 표시합니다.
 */
export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status as ReviewStatus];

  if (config) {
    return (
      <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  }

  // 알 수 없는 상태값: 원본 텍스트를 회색 배경으로 표시
  return (
    <span className="inline-block rounded-full px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600">
      {status}
    </span>
  );
}
