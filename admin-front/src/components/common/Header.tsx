/**
 * Header — 최상단 고정 헤더 바
 *
 * 구조: 좌측 로고 + 우측 (사용자 이름 + 로그아웃 버튼)
 */
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useAuthMe } from "@/hooks/useAuthMe";
import Button from "@/components/common/Button";
import mainLogo from "@/assets/mainLogo.svg";


export function Header() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const { data: user } = useAuthMe();

  const handleLogout = () => {
    // TODO: API 연동 시 서버 세션 삭제 요청 추가
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="h-14 shrink-0 flex items-center justify-between px-6 bg-white border-b border-border-default">
      {/* 좌측 로고 */}
      <div className="flex items-center gap-2">
        <img src={mainLogo} alt="SoFit 로고" className="h-8 mb-0.5" />
        <span className="text-sm font-medium text-text-disabled">Admin</span>
      </div>

      {/* 우측: 사용자 정보 + 로그아웃 */}
      <div className="flex items-center gap-3">
        {user && (
          <span className="text-sm text-text-secondary">{user.name}</span>
        )}
        <Button size="sm" onClick={handleLogout}>
          로그아웃
        </Button>
      </div>
    </header>
  );
}
