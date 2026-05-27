/** 서버 상태 값 */
export type HealthStatus = 'UP' | 'SLOW' | 'DOWN';

/** 개별 서버/서비스 상태 */
export interface ServerStatus {
  /** 서버 이름 (예: "user_back", "mysql") */
  name: string;
  /** 서버 상태 */
  status: HealthStatus;
  /** 응답 시간 (밀리초) */
  responseMs: number;
  /** 마지막 체크 시각 (ISO 8601, 예: "2026-05-26T14:32:07") */
  lastCheckedAt: string;
}

/** 서버 그룹 */
export interface ServerGroup {
  /** 애플리케이션 서버 목록 */
  applications: ServerStatus[];
  /** 인프라 서비스 목록 */
  infrastructure: ServerStatus[];
}

/** DB 커넥션 풀 정보 */
export interface DbConnectionPool {
  /** 애플리케이션 이름 (예: "Spring Boot") */
  name: string;
  /** 사용 중인 커넥션 수 */
  used: number;
  /** 전체 커넥션 수 */
  total: number;
}

/** 요약 정보 */
export interface HealthSummary {
  /** 전체 서버 수 */
  totalCount: number;
  /** 정상 서버 수 */
  normalCount: number;
  /** 지연 서버 수 */
  slowCount: number;
  /** 평균 응답 시간 (밀리초) */
  averageResponseMs: number;
}

/** 서버 상태 API 전체 응답 (result 필드 내부) */
export interface ServerHealthData {
  servers: ServerGroup;
  dbConnectionPool: DbConnectionPool[];
  summary: HealthSummary;
}

/** 응답시간 기반 상태 색상 */
export type StatusColor = 'green' | 'orange' | 'red';

/** 서버 상태에 따른 색상 결정 */
export function getStatusColor(status: HealthStatus): StatusColor {
  if (status === 'DOWN') return 'red';
  if (status === 'SLOW') return 'orange';
  return 'green';
}

/** 커넥션 풀 사용률 기반 색상 결정 */
export function getPoolColor(used: number, total: number): StatusColor {
  const percentage = total > 0 ? (used / total) * 100 : 0;
  if (percentage < 60) return 'green';
  if (percentage < 85) return 'orange';
  return 'red';
}

/** 상대 시간 포맷 (예: "방금 전", "3분 전") */
export function formatRelativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  return `${Math.floor(minutes / 60)}시간 전`;
}

/** 타임스탬프를 "YYYY-MM-DD HH:mm" 형식으로 포맷 */
export function formatDateTime(timestamp: number): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}
