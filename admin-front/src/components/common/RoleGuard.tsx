import { Navigate } from 'react-router-dom';
import { useAuthMe } from '@/hooks/useAuthMe';
import type { AdminRole } from '@/types';
import ForbiddenPage from '@/pages/error/ForbiddenPage';
import Spinner from '@/components/common/Spinner';

interface RoleGuardProps {
  allowedRoles: AdminRole[];
  children: React.ReactNode;
}

/**
 * 라우트 레벨 접근 제어 컴포넌트.
 * - 로딩 중: 로딩 스피너 표시
 * - 에러/미인증: /login 리다이렉트
 * - 역할 미허용: ForbiddenPage 렌더링
 * - 역할 허용: children 렌더링
 */
export default function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { data, isLoading, isAuthenticated } = useAuthMe();

  // 로딩 중: 스피너 표시
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner />
      </div>
    );
  }

  // 미인증: 로그인 페이지로 리다이렉트
  if (!isAuthenticated || !data) {
    return <Navigate to="/login" replace />;
  }

  // 역할 미허용: ForbiddenPage 렌더링
  if (!allowedRoles.includes(data.role)) {
    return <ForbiddenPage />;
  }

  // 역할 허용: children 렌더링
  return <>{children}</>;
}
