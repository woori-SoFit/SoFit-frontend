import { createBrowserRouter, Navigate } from "react-router-dom";
import { AdminLayout } from "@/components/common/AdminLayout";
import LoginPage from "@/pages/auth/LoginPage";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import UsersPage from "@/pages/placeholder/UsersPage";
import ApiLogsPage from "@/pages/placeholder/ApiLogsPage";
import BatchPage from "@/pages/placeholder/BatchPage";

export const router = createBrowserRouter([
  // 로그인 — AdminLayout 미적용
  { path: "/login", element: <LoginPage /> },

  // 인증된 관리자 화면 — AdminLayout 적용
  {
    path: "/",
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "users", element: <UsersPage /> },
      { path: "api-logs", element: <ApiLogsPage /> },
      { path: "batch", element: <BatchPage /> },
    ],
  },
]);
