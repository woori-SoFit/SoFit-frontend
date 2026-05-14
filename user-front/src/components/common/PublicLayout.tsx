/**
 * PublicLayout — 비인증 사용자용 레이아웃
 *
 * - 로그인, 회원가입 등 인증 불필요 화면에 사용
 * - 하단 네비게이션 바 없음
 */
import { Outlet } from "react-router-dom";

export function PublicLayout() {
  return (
    <div data-testid="public-layout">
      <Outlet />
    </div>
  );
}
