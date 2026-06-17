import { createBrowserRouter, Navigate } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import { AdminLayout } from "@/components/common/AdminLayout";
import LoginPage from "@/pages/auth/LoginPage";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import UserManagementPage from "@/pages/user-management/UserManagementPage";
import ServerStatusPage from "@/pages/server-status/ServerStatusPage";
import BatchPage from "@/pages/batch/BatchPage";
import LoanDetailPage from "@/pages/loan-detail/LoanDetailPage";
import ErrorLogsPage from "@/pages/error-logs/ErrorLogsPage";
import RoleGuard from "@/components/common/RoleGuard";
import { getAllRouteItems } from "@/constants/permissions";
import { type ComponentType } from "react";

/**
 * 라우트 key → 페이지 컴포넌트 매핑
 *
 * ROUTE_CONFIG의 key와 1:1 대응하여 컴포넌트를 연결한다.
 * 새 페이지 추가 시 여기에 매핑만 추가하면 라우트가 자동 생성된다.
 */
const PAGE_COMPONENTS: Record<string, ComponentType> = {
  "loan-applications": DashboardPage,
  "loan-detail": LoanDetailPage,
  users: UserManagementPage,
  "server-status": ServerStatusPage,
  "error-logs": ErrorLogsPage,
  batch: BatchPage,
};

/**
 * ROUTE_CONFIG에서 RoleGuard가 적용된 라우트 배열을 자동 생성한다.
 */
function buildProtectedRoutes(): RouteObject[] {
  return getAllRouteItems()
    .filter((item) => PAGE_COMPONENTS[item.key])
    .map((item) => {
      const Component = PAGE_COMPONENTS[item.key];
      // path에서 선행 '/' 제거 (react-router children은 상대 경로 사용)
      const relativePath = item.path.replace(/^\//, "");

      return {
        path: relativePath,
        element: (
          <RoleGuard allowedRoles={item.allowedRoles}>
            <Component />
          </RoleGuard>
        ),
      };
    });
}

export const router = createBrowserRouter([
  // 로그인 — AdminLayout 미적용
  { path: "/login", element: <LoginPage /> },

  // 인증된 관리자 화면 — AdminLayout 적용
  {
    path: "/",
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      ...buildProtectedRoutes(),
      // catch-all: 정의되지 않은 경로 → 대시보드 리다이렉트
      { path: "*", element: <Navigate to="/dashboard" replace /> },
    ],
  },
]);
