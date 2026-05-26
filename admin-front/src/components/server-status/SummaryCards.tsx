import SummaryCard from './SummaryCard';
import { Server, Clock, AlertTriangle, Database } from 'lucide-react';
import type { ServerHealthData } from '@/types/serverHealth';
import {
  getServerSummary,
  getSlowServerSummary,
  getDbPoolSummary,
} from '@/utils/serverHealthUtils';

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
  const serverSummary = data ? getServerSummary(data) : null;
  const slowSummary = data ? getSlowServerSummary(data) : null;
  const dbPoolSummary = data ? getDbPoolSummary(data) : null;

  // 평균 응답시간 카드 값 계산
  const responseValue = data
    ? `${Math.round(data.summary.averageResponseMs)}ms`
    : '';

  return (
    <div className="grid grid-cols-4 gap-4 min-h-[88px]">
      <SummaryCard
        icon={<Server className="h-5 w-5 text-blue-600" />}
        iconBg="bg-blue-100"
        title="전체 서버"
        value={serverSummary?.value ?? ''}
        subtitle={serverSummary?.subtitle}
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
        value={slowSummary?.value ?? ''}
        subtitle={slowSummary?.subtitle}
        isLoading={isLoading}
      />
      <SummaryCard
        icon={<Database className="h-5 w-5 text-purple-600" />}
        iconBg="bg-purple-100"
        title="DB 커넥션 풀"
        value={dbPoolSummary?.value ?? ''}
        subtitle={dbPoolSummary?.subtitle}
        isLoading={isLoading}
      />
    </div>
  );
}
