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
