import type { ServerStatus } from '@/types/serverHealth';
import { Database } from 'lucide-react';
import ServerStatusRow from './ServerStatusRow';

interface InfraStatusSectionProps {
  servers: ServerStatus[] | undefined;
}

/**
 * DB 상태 섹션.
 * MySQL, Redis 서비스의 헬스체크 결과를 표시한다.
 * 데이터가 없는 경우 안내 메시지를 표시한다.
 */
export default function InfraStatusSection({ servers }: InfraStatusSectionProps) {
  if (!servers || servers.length === 0) {
    return (
      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-900">
          <Database className="h-4 w-4 text-gray-600" />
          DB
        </h2>
        <p className="text-sm text-red-600">
          DB 상태 정보를 불러올 수 없습니다.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-900">
        <Database className="h-4 w-4 text-gray-600" />
        DB
      </h2>

      <div className="divide-y divide-gray-100">
        {servers.map((server) => (
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
