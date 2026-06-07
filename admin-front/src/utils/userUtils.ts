import type { UserTab, UserFilters, UserListParams, UserRole, UserStatus } from '../types/user';

/**
 * 사용자 관리 페이지에서 사용하는 유틸리티 함수 모음
 */

/**
 * 연락처 마스킹 함수
 * "01012345678" → "010-****-5678"
 * "010-1234-5678" → "010-****-5678"
 */
export function maskPhone(phone: string): string {
  const digits = phone.replace(/-/g, '');
  if (digits.length === 11) {
    return `${digits.slice(0, 3)}-****-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-***-${digits.slice(6)}`;
  }
  return phone;
}

/** 뱃지/인디케이터 설정 타입 */
export interface BadgeConfig {
  label: string;
  color: string;
}

/**
 * 비율 계산 함수
 * totalCount가 0이면 "0.00%"를 반환하고,
 * 그 외에는 (part / total * 100).toFixed(2) + "%" 형식으로 반환한다.
 * @param part - 부분 카운트
 * @param total - 전체 카운트
 * @returns "N.NN%" 형식의 비율 문자열
 */
export function calculatePercentage(part: number, total: number): string {
  if (total === 0) {
    return '0.00%';
  }
  return (part / total * 100).toFixed(2) + '%';
}

/**
 * 순번 계산 함수
 * totalCount - ((currentPage - 1) × pageSize + rowIndex) 값을 반환한다.
 * @param totalCount - 전체 사용자 수
 * @param currentPage - 현재 페이지 번호 (1부터 시작)
 * @param pageSize - 페이지당 표시 건수
 * @param rowIndex - 현재 행 인덱스 (0부터 시작)
 * @returns 내림차순 순번
 */
export function calculateRowNumber(
  totalCount: number,
  currentPage: number,
  pageSize: number,
  rowIndex: number,
): number {
  return totalCount - ((currentPage - 1) * pageSize + rowIndex);
}

/**
 * 날짜 포맷팅 함수
 * null이면 "-"를 반환하고, 유효한 ISO 8601 문자열이면 "YYYY.MM.DD HH:mm" 형식으로 반환한다.
 * @param dateString - ISO 8601 형식의 날짜 문자열 또는 null
 * @returns "YYYY.MM.DD HH:mm" 형식의 문자열 또는 "-"
 */
export function formatLastLogin(dateString: string | null): string {
  if (dateString === null) {
    return '-';
  }

  const isoPattern = /^\d{4}-\d{2}-\d{2}/;
  if (!isoPattern.test(dateString)) {
    return '-';
  }

  const date = dateString.slice(0, 10).replace(/-/g, '.');
  const timeMatch = dateString.match(/T(\d{2}):(\d{2})/);
  if (!timeMatch) {
    return date;
  }

  return `${date} ${timeMatch[1]}:${timeMatch[2]}`;
}

/**
 * 검색 트리거 판정 함수
 * 문자열 길이가 2 이상이면 true, 미만이면 false를 반환한다.
 * @param keyword - 검색어
 * @returns 검색 실행 여부
 */
export function shouldTriggerSearch(keyword: string): boolean {
  return keyword.length >= 2;
}

/**
 * API 파라미터 빌드 함수
 * 비어있지 않은 필터 값을 AND 조합으로 포함하는 UserListParams 객체를 반환한다.
 * @param tab - 현재 활성 탭
 * @param filters - 검색/필터 상태
 * @param page - 현재 페이지 번호
 * @param size - 페이지당 표시 건수
 * @returns UserListParams 객체
 */
export function buildUserListParams(
  tab: UserTab,
  filters: UserFilters,
  page: number,
  size: number,
): UserListParams {
  const params: UserListParams = {
    page: page - 1,
    size,
    tab,
  };

  if (filters.keyword && shouldTriggerSearch(filters.keyword)) {
    params.keyword = filters.keyword;
  }

  if (filters.role) {
    params.role = filters.role as UserRole;
  }

  if (filters.status) {
    params.status = filters.status as UserStatus;
  }

  return params;
}

/**
 * 역할 뱃지 설정 반환 함수
 * ADMIN_DEV → {label: "관리자", color: "blue"}
 * ADMIN_BANK_TELLER/ADMIN_BANK_MANAGER → {label: "은행원", color: "green"}
 * USER → {label: "고객", color: "orange"}
 * 기타 → {label: role, color: "gray"}
 * @param role - 역할 문자열
 * @returns 뱃지 설정 객체
 */
export function getRoleBadgeConfig(role: string): BadgeConfig {
  switch (role) {
    case 'ADMIN_DEV':
      return { label: '개발자', color: 'blue' };
    case 'ADMIN_BANK_MANAGER':
      return { label: '지점장', color: 'purple' };
    case 'ADMIN_BANK_TELLER':
      return { label: '은행원', color: 'green' };
    case 'USER':
      return { label: '고객', color: 'orange' };
    default:
      return { label: role, color: 'gray' };
  }
}

/**
 * 상태 인디케이터 설정 반환 함수
 * ACTIVE → {label: "활성", color: "green"}
 * INACTIVE → {label: "비활성", color: "red"}
 * 기타 → {label: status, color: "gray"}
 * @param status - 상태 문자열
 * @returns 인디케이터 설정 객체
 */
export function getStatusIndicatorConfig(status: string): BadgeConfig {
  switch (status) {
    case 'ACTIVE':
      return { label: '활성', color: 'green' };
    case 'INACTIVE':
      return { label: '비활성', color: 'red' };
    default:
      return { label: status, color: 'gray' };
  }
}
