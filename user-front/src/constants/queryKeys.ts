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
  productOptions: (id: number) => [...LOAN_KEYS.all, "productOptions", id] as const,
  applications: () => [...LOAN_KEYS.all, "applications"] as const,
  applicationsInProgress: () => [...LOAN_KEYS.all, "applications", "in-progress"] as const,
  applicationsCompleted: () => [...LOAN_KEYS.all, "applications", "completed"] as const,
  application: (id: number) =>
    [...LOAN_KEYS.all, "application", id] as const,
  applicationCompleted: (id: number) =>
    [...LOAN_KEYS.all, "application", "completed", id] as const,
  management: () => [...LOAN_KEYS.all, "management"] as const,
} as const;

export const GRADE_KEYS = {
  all: ["grade"] as const,
  report: () => [...GRADE_KEYS.all, "report"] as const,
} as const;

export const BIZ_DATA_KEYS = {
  all: ["bizData"] as const,
  dashboard: (month?: string) => [...BIZ_DATA_KEYS.all, "dashboard", month ?? "latest"] as const,
  status: () => [...BIZ_DATA_KEYS.all, "status"] as const,
} as const;

export const TERMS_KEYS = {
  all: ["terms"] as const,
  list: (termType: string) => [...TERMS_KEYS.all, "list", termType] as const,
} as const;

export const NOTIFICATION_KEYS = {
  all: ["notifications"] as const,
  list: () => [...NOTIFICATION_KEYS.all] as const,
} as const;

export const MYPAGE_KEYS = {
  all: ["mypage"] as const,
  profile: () => [...MYPAGE_KEYS.all, "profile"] as const,
  business: () => [...MYPAGE_KEYS.all, "business"] as const,
} as const;
