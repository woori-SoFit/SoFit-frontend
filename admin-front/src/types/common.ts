/**
 * 프로젝트 공통 타입 정의
 */

export interface MenuItem {
  label: string;
  path: string;
}

export type AdminRole = 'ADMIN_DEV' | 'ADMIN_BANK_TELLER' | 'ADMIN_BANK_MANAGER';

/** 공통 페이지네이션 응답 */
export interface PaginatedResponse<T> {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  size: number;
  contents: T[];
}
