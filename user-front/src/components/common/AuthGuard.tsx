/**
 * 인증 가드 컴포넌트
 *
 * 로그인되지 않은 사용자를 /login으로 리다이렉트합니다.
 * returnUrl 파라미터로 현재 경로를 전달하여 로그인 후 복귀할 수 있도록 합니다.
 */
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useMe } from "@/hooks/useMe";

export function AuthGuard() {
  const { isLoggedIn, isLoading } = useMe();
  const location = useLocation();

  // 로딩 중에는 빈 화면 (깜빡임 방지)
  if (isLoading) {
    return null;
  }

  if (!isLoggedIn) {
    return <Navigate to={`/login?returnUrl=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return <Outlet />;
}
