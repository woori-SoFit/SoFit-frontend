/**
 * MainLayout — 인증된 사용자용 레이아웃
 *
 * - 하단 네비게이션 바 포함
 * - 세션 미인증 시 /login 리다이렉트
 * - 서버 인증 상태는 React Query (useQuery)로 관리
 */
import { Outlet } from "react-router-dom";

export function MainLayout() {
  // TODO: useQuery로 /api/members/me 조회 → 미인증 시 /login 리다이렉트
  // TODO: 하단 네비게이션 바 구현

  return (
    <div data-testid="main-layout">
      <main>
        <Outlet />
      </main>
      {/* TODO: BottomNavBar */}
    </div>
  );
}
