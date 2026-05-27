import type { DbConnectionPool } from '@/types/serverHealth';
import { getPoolDisplayList } from '@/utils/serverHealthUtils';
import { HardDrive } from 'lucide-react';

interface ConnectionPoolSectionProps {
  pools: DbConnectionPool[] | undefined;
}

/** 풀 색상에 대응하는 Tailwind 프로그레스 바 클래스 */
const POOL_COLOR_CLASS = {
  green: 'bg-green-500',
  orange: 'bg-amber-500',
  red: 'bg-red-500',
} as const;

/**
 * DB 커넥션 풀 사용률 섹션.
 * 각 애플리케이션의 커넥션 풀 사용 현황을 프로그레스 바로 표시한다.
 * - < 60%: 초록
 * - 60~84%: 주황
 * - >= 85%: 빨강
 */
export default function ConnectionPoolSection({ pools }: ConnectionPoolSectionProps) {
  // 데이터 로드 실패 또는 빈 배열인 경우 에러 메시지 표시
  if (!pools || pools.length === 0) {
    return (
      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-900">
          <HardDrive className="h-4 w-4 text-gray-600" />
          DB 커넥션 풀 사용률
        </h2>
        <p className="text-sm text-red-600">
          커넥션 풀 정보를 불러올 수 없습니다.
        </p>
      </section>
    );
  }

  const poolDisplayList = getPoolDisplayList(pools);

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-900">
        <HardDrive className="h-4 w-4 text-gray-600" />
        DB 커넥션 풀 사용률
      </h2>

      <div className="space-y-4">
        {poolDisplayList.map((pool) => (
          <div key={pool.name} className="flex items-center gap-4">
            {/* 애플리케이션 이름 */}
            <span className="w-28 shrink-0 text-sm font-medium text-gray-700">
              {pool.name}
            </span>

            {/* 프로그레스 바 */}
            <div className="flex-1">
              <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className={`h-full rounded-full ${POOL_COLOR_CLASS[pool.color]}`}
                  style={{ width: `${pool.percentage}%` }}
                />
              </div>
            </div>

            {/* 사용률 표시: {percentage}% {used}/{total} */}
            <span className="shrink-0 text-sm text-gray-600">
              {pool.percentage}% {pool.used}/{pool.total}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
