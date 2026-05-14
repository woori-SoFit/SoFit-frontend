/**
 * PublicLayout — 비인증 사용자용 레이아웃
 *
 * - 로그인, 회원가입 등 인증 불필요 화면
 * - 헤더/탭바 없음
 * - 앱 컨테이너 적용
 */
import { Outlet } from "react-router-dom";

export function PublicLayout() {
  return (
    <div className="app-container min-h-screen">
      <Outlet />
    </div>
  );
}
