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
  statusCounts: () => [...LOAN_KEYS.all, "status-counts"] as const,
  sGradeTab: (id: number) => [...LOAN_KEYS.all, "sgrade-tab", id] as const,
  shap: (id: number) => [...LOAN_KEYS.all, "shap", id] as const,
  recommendation: (id: number) => [...LOAN_KEYS.all, "recommendation", id] as const,
  reviewTab: (id: number) => [...LOAN_KEYS.all, "review-tab", id] as const,
  myBizData: (id: number) => [...LOAN_KEYS.all, "mybiz-data", id] as const,
  managerApprovals: () => [...LOAN_KEYS.all, "manager-approvals"] as const,
} as const;

export const USER_KEYS = {
  all: ["users"] as const,
  list: () => [...USER_KEYS.all, "list"] as const,
  statistics: () => [...USER_KEYS.all, "statistics"] as const,
} as const;

export const SERVER_HEALTH_KEYS = {
  all: ["server-health"] as const,
  status: () => [...SERVER_HEALTH_KEYS.all, "status"] as const,
} as const;

export const ERROR_LOG_KEYS = {
  all: ["error-logs"] as const,
  list: () => [...ERROR_LOG_KEYS.all, "list"] as const,
} as const;

export const BATCH_KEYS = {
  all: ["batch"] as const,
  list: (params?: unknown) => [...BATCH_KEYS.all, "list", params] as const,
};