import type { DbConnectionPool, ServerHealthData, ServerStatus } from '@/types/serverHealth';
import { getPoolColor } from '@/types/serverHealth';
import type { StatusColor } from '@/types/serverHealth';

/** 서버 요약 카드에 표시할 데이터 */
export interface ServerSummary {
  /** "정상수/전체수" 형식 문자열 */
  value: string;
  /** 부가 설명 (예: "모두 정상", "3개 정상") */
  subtitle: string | undefined;
}

/** 지연 서버 요약 카드에 표시할 데이터 */
export interface SlowServerSummary {
  /** 지연 서버 수 */
  value: string;
  /** 지연 서버 이름 목록 (화살표 구분) */
  subtitle: string | undefined;
  /** 지연 서버 목록 */
  servers: ServerStatus[];
}

/** DB 커넥션 풀 요약 카드에 표시할 데이터 */
export interface DbPoolSummary {
  /** 사용률 퍼센트 문자열 (예: "72%") */
  value: string;
  /** "사용중/전체 사용 중" 형식 부가 설명 */
  subtitle: string | undefined;
  /** 사용률 퍼센트 숫자 */
  percentage: number;
}

/**
 * 전체 서버 상태 요약 데이터를 계산한다.
 * @param data 서버 상태 API 응답 데이터
 */
export function getServerSummary(data: ServerHealthData): ServerSummary {
  const { normalCount, totalCount } = data.summary;
  const value = `${normalCount}/${totalCount}`;
  const subtitle =
    normalCount === totalCount
      ? '모두 정상'
      : `${normalCount}개 정상`;

  return { value, subtitle };
}

/**
 * 지연(SLOW) 서버 요약 데이터를 계산한다.
 * @param data 서버 상태 API 응답 데이터
 */
export function getSlowServerSummary(data: ServerHealthData): SlowServerSummary {
  const servers = [
    ...data.servers.applications,
    ...data.servers.infrastructure,
  ].filter((server) => server.status === 'SLOW');

  const value = `${servers.length}`;
  const subtitle =
    servers.length > 0
      ? servers.map((s) => s.name).join(' → ')
      : undefined;

  return { value, subtitle, servers };
}

/**
 * DB 커넥션 풀 요약 데이터를 계산한다.
 * @param data 서버 상태 API 응답 데이터
 */
export function getDbPoolSummary(data: ServerHealthData): DbPoolSummary {
  const pool = data.dbConnectionPool?.[0];

  if (!pool) {
    return { value: '', subtitle: undefined, percentage: 0 };
  }

  const percentage = Math.round((pool.used / pool.total) * 100);
  const value = `${percentage}%`;
  const subtitle = `${pool.used}/${pool.total} 사용 중`;

  return { value, subtitle, percentage };
}

/** 개별 커넥션 풀의 계산된 표시 데이터 */
export interface PoolDisplayData {
  /** 애플리케이션 이름 */
  name: string;
  /** 사용률 퍼센트 */
  percentage: number;
  /** 상태 색상 */
  color: StatusColor;
  /** 사용 중인 커넥션 수 */
  used: number;
  /** 전체 커넥션 수 */
  total: number;
}

/**
 * 커넥션 풀 배열을 표시용 데이터로 변환한다.
 * @param pools DB 커넥션 풀 배열
 */
export function getPoolDisplayList(pools: DbConnectionPool[]): PoolDisplayData[] {
  return pools.map((pool) => ({
    name: pool.name,
    percentage: pool.total > 0 ? Math.round((pool.used / pool.total) * 100) : 0,
    color: getPoolColor(pool.used, pool.total),
    used: pool.used,
    total: pool.total,
  }));
}
