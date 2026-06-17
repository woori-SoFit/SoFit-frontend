/** 사용자 역할 (관리자 포함 전체) */
export type UserRole = 'ADMIN_DEV' | 'ADMIN_BANK_TELLER' | 'ADMIN_BANK_MANAGER' | 'USER';

/** 사용자 상태 */
export type UserStatus = 'ACTIVE' | 'INACTIVE';

/** 탭 필터 타입 */
export type UserTab = 'all' | 'admin' | 'banker' | 'customer' | 'inactive';

/** 사용자 목록 조회 파라미터 */
export interface UserListParams {
  page: number;
  size: number;
  tab: UserTab;
  keyword?: string;
  role?: UserRole;
  status?: UserStatus;
}

/** 사용자 목록 항목 */
export interface UserListItem {
  id: number;
  loginId: string;
  name: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

/** 사용자 목록 페이징 응답 */
export interface PaginatedUserResponse {
  users: UserListItem[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  size: number;
}

/** 사용자 통계 데이터 */
export interface UserStatistics {
  totalCount: number;
  activeCount: number;
  bankerCount: number;
  userCount: number;
  inactiveCount: number;
}

/** 검색/필터 상태 */
export interface UserFilters {
  keyword: string;
  role: UserRole | '';
  status: UserStatus | '';
}

// ─── API Raw 타입 (서버 응답 원본 구조) ───

/** GET /api/admin/users 응답 항목 원본 */
export interface UserListItemRaw {
  id: number;
  loginId: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  phoneNumber: string;
  createdAt: string;
}
