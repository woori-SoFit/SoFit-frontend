import type { AdminRole } from '@/types';
import { MENU_CONFIG } from '@/constants/permissions';
import type { MenuGroupConfig } from '@/constants/permissions';

/**
 * 주어진 역할에 허용된 메뉴 항목만 필터링하여 반환한다.
 * items가 0개인 그룹은 결과에서 제외된다.
 */
export function getFilteredMenuGroups(role: AdminRole): MenuGroupConfig[] {
  return MENU_CONFIG
    .map((group) => ({
      category: group.category,
      items: group.items.filter((item) => item.allowedRoles.includes(role)),
    }))
    .filter((group) => group.items.length > 0);
}
