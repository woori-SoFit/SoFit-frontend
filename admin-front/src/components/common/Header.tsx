/**
 * Header — 최상단 고정 헤더 바
 *
 * 구조: 좌측 로고 + 우측 (로그아웃 버튼, 사용자 이메일)
 */
import mainLogo from "@/assets/main-logo.svg";

export function Header() {
  // TODO: React Query로 /api/auth/me 조회하여 사용자 정보 표시
  return (
    <header className="h-14 shrink-0 flex items-center justify-between px-6 bg-white border-b border-border-default">
      {/* 좌측 로고 */}
      <div className="flex items-center gap-2">
        <img src={mainLogo} alt="SoFit 로고" className="h-7" />
        <span className="text-sm font-medium text-text-secondary">Admin</span>
      </div>

      {/* 우측: 로그아웃 + 사용자 정보 */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="px-3 py-1.5 text-xs font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition-colors"
        >
          로그아웃
        </button>
        <span className="text-sm text-text-secondary">admin@email.com</span>
      </div>
    </header>
  );
}
