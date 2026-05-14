/**
 * React Query queryKey 상수
 * 도메인별로 분리 관리
 */

export const AUTH_KEYS = {
  me: ["auth", "me"] as const,
} as const;

export const LOAN_KEYS = {
  all: ["loans"] as const,
  list: () => [...LOAN_KEYS.all, "list"] as const,
  detail: (id: number) => [...LOAN_KEYS.all, "detail", id] as const,
  applications: () => [...LOAN_KEYS.all, "applications"] as const,
  application: (id: number) =>
    [...LOAN_KEYS.all, "application", id] as const,
} as const;

export const GRADE_KEYS = {
  all: ["grade"] as const,
  report: () => [...GRADE_KEYS.all, "report"] as const,
} as const;

export const BIZ_DATA_KEYS = {
  all: ["bizData"] as const,
  dashboard: () => [...BIZ_DATA_KEYS.all, "dashboard"] as const,
} as const;
