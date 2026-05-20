import type { AdminRole } from '@/types';
import { ROUTE_CONFIG } from '@/constants/permissions';
import type { RouteGroupConfig } from '@/constants/permissions';

/**
 * 사이드바 메뉴용 필터링된 그룹을 반환한다.
 * - showInMenu: false인 항목은 제외
 * - 해당 역할에 허용된 항목만 포함
 * - items가 0개인 그룹은 결과에서 제외
 */
export function getFilteredMenuGroups(role: AdminRole): RouteGroupConfig[] {
  return ROUTE_CONFIG
    .map((group) => ({
      category: group.category,
      items: group.items.filter(
        (item) => item.showInMenu !== false && item.allowedRoles.includes(role)
      ),
    }))
    .filter((group) => group.items.length > 0);
}
