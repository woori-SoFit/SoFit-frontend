import type { AdminRole } from '@/types';

/**
 * 메뉴 항목 설정 인터페이스
 */
export interface MenuItemConfig {
  key: string;
  label: string;
  path: string;
  allowedRoles: AdminRole[];
}

/**
 * 메뉴 그룹 설정 인터페이스
 */
export interface MenuGroupConfig {
  category: string;
  items: MenuItemConfig[];
}

/**
 * 역할별 메뉴 접근 권한 중앙 설정
 */
export const MENU_CONFIG: MenuGroupConfig[] = [
  {
    category: '대출',
    items: [
      {
        key: 'loan-applications',
        label: '대출 신청 현황',
        path: '/dashboard',
        allowedRoles: ['ADMIN_DEV', 'ADMIN_BANK_TELLER', 'ADMIN_BANK_MANAGER'],
      },
      {
        key: 'review-history',
        label: '심사 내역 조회',
        path: '/review-history',
        allowedRoles: ['ADMIN_DEV', 'ADMIN_BANK_TELLER', 'ADMIN_BANK_MANAGER'],
      },
      {
        key: 'manager-approval',
        label: '지점장 결재',
        path: '/manager-approval',
        allowedRoles: ['ADMIN_DEV', 'ADMIN_BANK_MANAGER'],
      },
    ],
  },
  {
    category: '관리',
    items: [
      {
        key: 'users',
        label: '고객 관리',
        path: '/users',
        allowedRoles: ['ADMIN_DEV', 'ADMIN_BANK_TELLER', 'ADMIN_BANK_MANAGER'],
      },
    ],
  },
  {
    category: '시스템',
    items: [
      {
        key: 'api-logs',
        label: 'API 로그',
        path: '/api-logs',
        allowedRoles: ['ADMIN_DEV'],
      },
      {
        key: 'batch',
        label: 'S등급 배치 관리',
        path: '/batch',
        allowedRoles: ['ADMIN_DEV'],
      },
    ],
  },
];

/**
 * 경로별 허용 역할 매핑
 */
export const ROUTE_PERMISSIONS: Record<string, AdminRole[]> = {
  '/dashboard': ['ADMIN_DEV', 'ADMIN_BANK_TELLER', 'ADMIN_BANK_MANAGER'],
  '/review-history': ['ADMIN_DEV', 'ADMIN_BANK_TELLER', 'ADMIN_BANK_MANAGER'],
  '/manager-approval': ['ADMIN_DEV', 'ADMIN_BANK_MANAGER'],
  '/users': ['ADMIN_DEV', 'ADMIN_BANK_TELLER', 'ADMIN_BANK_MANAGER'],
  '/api-logs': ['ADMIN_DEV'],
  '/batch': ['ADMIN_DEV'],
  '/loan/:id': ['ADMIN_DEV', 'ADMIN_BANK_TELLER', 'ADMIN_BANK_MANAGER'],
};

/**
 * 역할 한글 표시명 매핑
 */
export const ROLE_DISPLAY_NAMES: Record<AdminRole, string> = {
  ADMIN_DEV: '개발 관리자',
  ADMIN_BANK_TELLER: '은행원',
  ADMIN_BANK_MANAGER: '지점장',
};
