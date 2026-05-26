import type { ReactNode } from 'react';

interface SummaryCardProps {
  /** 아이콘 (Lucide ReactNode) */
  icon: ReactNode;
  /** 아이콘 배경색 클래스 (예: "bg-blue-100") */
  iconBg: string;
  /** 카드 제목 */
  title: string;
  /** 주요 값 */
  value: string;
  /** 부가 정보 (선택) */
  subtitle?: string;
  /** 로딩 상태 */
  isLoading?: boolean;
}

/** 스켈레톤 로딩 상태 */
function SummaryCardSkeleton() {
  return (
    <div className="rounded-lg border border-border-default bg-bg-surface p-5 shadow-card">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-16 animate-pulse rounded bg-gray-200" />
          <div className="h-5 w-20 animate-pulse rounded bg-gray-200" />
          <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

/**
 * 서버 상태 대시보드 요약 카드 컴포넌트.
 * 아이콘, 제목, 주요 값, 부가 정보를 표시한다.
 * isLoading이 true이면 스켈레톤 플레이스홀더를 렌더링한다.
 */
export default function SummaryCard({
  icon,
  iconBg,
  title,
  value,
  subtitle,
  isLoading = false,
}: SummaryCardProps) {
  if (isLoading) {
    return <SummaryCardSkeleton />;
  }

  return (
    <div className="rounded-lg border border-border-default bg-bg-surface p-5 shadow-card">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full ${iconBg}`}
        >
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-xs text-text-secondary">{title}</p>
          <p className="text-lg font-semibold text-text-primary">{value}</p>
          {subtitle && (
            <p className="text-xs text-text-disabled">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}
