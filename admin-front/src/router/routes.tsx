import { createBrowserRouter, Navigate } from "react-router-dom";
import { AdminLayout } from "@/components/common/AdminLayout";
import LoginPage from "@/pages/auth/LoginPage";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import UsersPage from "@/pages/placeholder/UsersPage";
import ApiLogsPage from "@/pages/placeholder/ApiLogsPage";
import BatchPage from "@/pages/placeholder/BatchPage";
import ReviewHistoryPage from "@/pages/placeholder/ReviewHistoryPage";
import ManagerApprovalPage from "@/pages/placeholder/ManagerApprovalPage";
import LoanDetailPage from "@/pages/placeholder/LoanDetailPage";
import RoleGuard from "@/components/common/RoleGuard";
import { ROUTE_PERMISSIONS } from "@/constants/permissions";

export const router = createBrowserRouter([
  // 로그인 — AdminLayout 미적용
  { path: "/login", element: <LoginPage /> },

  // 인증된 관리자 화면 — AdminLayout 적용
  {
    path: "/",
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      {
        path: "dashboard",
        element: (
          <RoleGuard allowedRoles={ROUTE_PERMISSIONS["/dashboard"]}>
            <DashboardPage />
          </RoleGuard>
        ),
      },
      {
        path: "review-history",
        element: (
          <RoleGuard allowedRoles={ROUTE_PERMISSIONS["/review-history"]}>
            <ReviewHistoryPage />
          </RoleGuard>
        ),
      },
      {
        path: "manager-approval",
        element: (
          <RoleGuard allowedRoles={ROUTE_PERMISSIONS["/manager-approval"]}>
            <ManagerApprovalPage />
          </RoleGuard>
        ),
      },
      {
        path: "loan/:id",
        element: (
          <RoleGuard allowedRoles={ROUTE_PERMISSIONS["/loan/:id"]}>
            <LoanDetailPage />
          </RoleGuard>
        ),
      },
      {
        path: "users",
        element: (
          <RoleGuard allowedRoles={ROUTE_PERMISSIONS["/users"]}>
            <UsersPage />
          </RoleGuard>
        ),
      },
      {
        path: "api-logs",
        element: (
          <RoleGuard allowedRoles={ROUTE_PERMISSIONS["/api-logs"]}>
            <ApiLogsPage />
          </RoleGuard>
        ),
      },
      {
        path: "batch",
        element: (
          <RoleGuard allowedRoles={ROUTE_PERMISSIONS["/batch"]}>
            <BatchPage />
          </RoleGuard>
        ),
      },
      // catch-all: 정의되지 않은 경로 → 대시보드 리다이렉트
      { path: "*", element: <Navigate to="/dashboard" replace /> },
    ],
  },
]);
