import type { ServerStatus } from '@/types/serverHealth';
import { Database } from 'lucide-react';
import ServerStatusRow from './ServerStatusRow';

interface InfraStatusSectionProps {
  servers: ServerStatus[] | undefined;
}

/** 데이터 없을 때 표시할 인프라 서비스 기본 목록 (호출 시점의 시간 사용) */
function getFallbackServers(): ServerStatus[] {
  return [
    { name: 'MySQL', status: 'DOWN', responseMs: 0, lastCheckedAt: new Date().toISOString() },
    { name: 'Redis', status: 'DOWN', responseMs: 0, lastCheckedAt: new Date().toISOString() },
  ];
}

/**
 * DB 상태 섹션.
 * MySQL, Redis 서비스의 헬스체크 결과를 표시한다.
 * 데이터가 없는 경우 빨간 인디케이터 + "장애" 상태로 폴백 표시한다.
 */
export default function InfraStatusSection({ servers }: InfraStatusSectionProps) {
  const displayServers = servers && servers.length > 0 ? servers : getFallbackServers();

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-900">
        <Database className="h-4 w-4 text-gray-600" />
        DB
      </h2>

      <div className="divide-y divide-gray-100">
        {displayServers.map((server) => (
          <ServerStatusRow
            key={server.name}
            name={server.name}
            status={server.status}
            responseMs={server.responseMs}
            lastCheckedAt={server.lastCheckedAt}
          />
        ))}
      </div>
    </section>
  );
}
