import type { ServerStatus } from '@/types/serverHealth';
import { Monitor } from 'lucide-react';
import ServerStatusRow from './ServerStatusRow';

interface ApplicationStatusSectionProps {
  servers: ServerStatus[] | undefined;
}

/**
 * 애플리케이션 상태 섹션.
 * user_back, admin_back 서버의 헬스체크 결과를 표시한다.
 */
export default function ApplicationStatusSection({ servers }: ApplicationStatusSectionProps) {
  if (!servers || servers.length === 0) {
    return null;
  }

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-900">
        <Monitor className="h-4 w-4 text-gray-600" />
        애플리케이션
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
