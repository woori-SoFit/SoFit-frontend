export interface MenuItem {
  label: string;
  path: string;
}

export type AdminRole = 'ADMIN_DEV' | 'ADMIN_BANK_TELLER' | 'ADMIN_BANK_MANAGER';

export const VALID_ROLES: AdminRole[] = [
  'ADMIN_DEV',
  'ADMIN_BANK_TELLER',
  'ADMIN_BANK_MANAGER',
];

export function isValidRole(value: unknown): value is AdminRole {
  return VALID_ROLES.includes(value as AdminRole);
}

export type ReviewStatus = 'UNDER_REVIEW' | 'MANAGER_REVIEW' | 'APPROVED' | 'REJECTED';

export interface LoanApplication {
  /** 고유 식별자 */
  id: number;
  /** 신청일 (ISO 8601 형식: "2025-01-15") */
  applicationDate: string;
  /** 신청자명 */
  applicantName: string;
  /** 사업자명 */
  businessName: string;
  /** 대출 상품명 */
  productName: string;
  /** 심사 상태 */
  reviewStatus: ReviewStatus;
  /** 담당자명 */
  assigneeName: string;
}

/** 서버 페이징 응답 */
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

/** 대출 신청 목록 조회 파라미터 */
export interface LoanApplicationParams {
  page: number;
  size: number;
  status?: ReviewStatus;
  assigneeName?: string;
}
