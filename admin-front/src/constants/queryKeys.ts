export const AUTH_KEYS = {
  me: ["auth", "me"] as const,
} as const;

export const LOAN_KEYS = {
  all: ["loans"] as const,
  list: () => [...LOAN_KEYS.all, "list"] as const,
  summary: (id: number) => [...LOAN_KEYS.all, "summary", id] as const,
  detail: (id: number) => [...LOAN_KEYS.all, "detail", id] as const,
  applications: () => [...LOAN_KEYS.all, "applications"] as const,
  application: (id: number) => [...LOAN_KEYS.all, "application", id] as const,
  shap: (id: number) => [...LOAN_KEYS.all, "shap", id] as const,
  recommendation: (id: number) => [...LOAN_KEYS.all, "recommendation", id] as const,
  reviewTab: (id: number) => [...LOAN_KEYS.all, "review-tab", id] as const,
  managerApprovals: () => [...LOAN_KEYS.all, "manager-approvals"] as const,
} as const;
