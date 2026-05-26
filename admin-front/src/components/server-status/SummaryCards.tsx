import SummaryCard from './SummaryCard';
import { Server, Clock, AlertTriangle, Database } from 'lucide-react';
import type { ServerHealthData } from '@/types/serverHealth';

interface SummaryCardsProps {
  /** 서버 상태 데이터 */
  data: ServerHealthData | undefined;
  /** 로딩 상태 */
  isLoading: boolean;
}

/**
 * 서버 상태 대시보드 요약 카드 4개를 렌더링하는 컴포넌트.
 * 전체 서버, 평균 응답시간, 지연 구간, DB 커넥션 풀 정보를 표시한다.
 */
export default function SummaryCards({ data, isLoading }: SummaryCardsProps) {
  // 전체 서버 카드 값 계산
  const serverValue = data
    ? `${data.summary.normalCount}/${data.summary.totalCount}`
    : '';
  const serverSubtitle = data
    ? data.summary.normalCount === data.summary.totalCount
      ? '모두 정상'
      : `${data.summary.normalCount}개 정상`
    : undefined;

  // 평균 응답시간 카드 값 계산
  const responseValue = data
    ? `${Math.round(data.summary.averageResponseMs)}ms`
    : '';

  // 지연 구간 카드 값 계산
  const slowServers = data
    ? [
        ...data.servers.applications,
        ...data.servers.infrastructure,
      ].filter((server) => server.status === 'SLOW')
    : [];
  const slowCount = slowServers.length;
  const slowValue = data ? `${slowCount}` : '';
  const slowSubtitle =
    slowCount > 0
      ? slowServers.map((s) => s.name).join(' → ')
      : undefined;

  // DB 커넥션 풀 카드 값 계산
  const pool = data?.dbConnectionPool?.[0];
  const poolPercentage = pool
    ? Math.round((pool.used / pool.total) * 100)
    : 0;
  const poolValue = pool ? `${poolPercentage}%` : '';
  const poolSubtitle = pool
    ? `${pool.used}/${pool.total} 사용 중`
    : undefined;

  return (
    <div className="grid grid-cols-4 gap-4 min-h-[88px]">
      <SummaryCard
        icon={<Server className="h-5 w-5 text-blue-600" />}
        iconBg="bg-blue-100"
        title="전체 서버"
        value={serverValue}
        subtitle={serverSubtitle}
        isLoading={isLoading}
      />
      <SummaryCard
        icon={<Clock className="h-5 w-5 text-green-600" />}
        iconBg="bg-green-100"
        title="평균 응답시간"
        value={responseValue}
        isLoading={isLoading}
      />
      <SummaryCard
        icon={<AlertTriangle className="h-5 w-5 text-amber-600" />}
        iconBg="bg-orange-100"
        title="지연 구간"
        value={slowValue}
        subtitle={slowSubtitle}
        isLoading={isLoading}
      />
      <SummaryCard
        icon={<Database className="h-5 w-5 text-purple-600" />}
        iconBg="bg-purple-100"
        title="DB 커넥션 풀"
        value={poolValue}
        subtitle={poolSubtitle}
        isLoading={isLoading}
      />
    </div>
  );
}
