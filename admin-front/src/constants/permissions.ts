import type { AdminRole } from '@/types';

/**
 * 라우트 항목 설정 인터페이스
 */
export interface RouteItemConfig {
  key: string;
  label: string;
  path: string;
  allowedRoles: AdminRole[];
  /** 메뉴에 표시할지 여부 (기본값: true) */
  showInMenu?: boolean;
}

/**
 * 라우트 그룹 설정 인터페이스
 */
export interface RouteGroupConfig {
  category: string;
  items: RouteItemConfig[];
}

/**
 * 역할별 메뉴 접근 권한 + 라우트 설정 (단일 소스)
 *
 * - 메뉴 렌더링, 라우트 생성, 권한 체크 모두 이 config에서 파생
 * - showInMenu: false인 항목은 사이드바에 표시되지 않지만 라우트는 생성됨
 */
export const ROUTE_CONFIG: RouteGroupConfig[] = [
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
        key: 'loan-detail',
        label: '대출 상세',
        path: '/loan/:id',
        allowedRoles: ['ADMIN_DEV', 'ADMIN_BANK_TELLER', 'ADMIN_BANK_MANAGER'],
        showInMenu: false,
      },
    ],
  },
  {
    category: '계정',
    items: [
      {
        key: 'users',
        label: '계정 관리',
        path: '/users',
        allowedRoles: ['ADMIN_DEV', 'ADMIN_BANK_TELLER', 'ADMIN_BANK_MANAGER'],
      },
    ],
  },
  {
    category: '모니터링',
    items: [
      {
        key: 'server-status',
        label: '서버 상태 확인',
        path: '/server-status',
        allowedRoles: ['ADMIN_DEV'],
        showInMenu: false,
      },
      {
        key: 'error-logs',
        label: '에러 로그',
        path: '/error-logs',
        allowedRoles: ['ADMIN_DEV'],
        showInMenu: false,
      },
      {
        key: 'batch',
        label: '배치 관리',
        path: '/batch',
        allowedRoles: ['ADMIN_DEV'],
      },
    ],
  },
];

/**
 * ROUTE_CONFIG에서 모든 라우트 항목을 플랫하게 추출
 */
export function getAllRouteItems(): RouteItemConfig[] {
  return ROUTE_CONFIG.flatMap((group) => group.items);
}

/**
 * 경로별 허용 역할 매핑 (ROUTE_CONFIG에서 자동 파생)
 */
export const ROUTE_PERMISSIONS: Record<string, AdminRole[]> = Object.fromEntries(
  getAllRouteItems().map((item) => [item.path, item.allowedRoles])
);

/**
 * 역할 한글 표시명 매핑
 */
export const ROLE_DISPLAY_NAMES: Record<AdminRole, string> = {
  ADMIN_DEV: '개발 관리자',
  ADMIN_BANK_TELLER: '은행원',
  ADMIN_BANK_MANAGER: '지점장',
};
