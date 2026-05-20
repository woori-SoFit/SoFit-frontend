/**
 * Sidebar — 좌측 사이드바 네비게이션
 *
 * 구조:
 * - 상단: 사용자 이름 + 역할 한글 표시명
 * - 카테고리별 메뉴 그룹 (역할 기반 필터링)
 * - 밝은 배경, 우측 border
 */
import { NavLink, Navigate } from "react-router-dom";
import { useAuthMe } from "@/hooks/useAuthMe";
import { getFilteredMenuGroups } from "@/utils/menuFilter";
import { ROLE_DISPLAY_NAMES } from "@/constants/permissions";

export function Sidebar() {
  const { data: user, isLoading, isError } = useAuthMe();

  // 로딩 중 처리
  if (isLoading) {
    return (
      <aside className="w-56 shrink-0 bg-white border-r border-border-default flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
      </aside>
    );
  }

  // 에러 시 로그인 페이지로 리다이렉트
  if (isError || !user) {
    return <Navigate to="/login" replace />;
  }

  const menuGroups = getFilteredMenuGroups(user.role);

  return (
    <aside className="w-56 shrink-0 bg-white border-r border-border-default flex flex-col">
      {/* 사용자 정보 */}
      <div className="px-5 py-4">
        <p className="text-sm text-text-primary">
          <span className="font-semibold text-primary">{user.name}</span> 님, 반가워요!
        </p>
        <p className="text-xs text-text-disabled mt-1">
          {ROLE_DISPLAY_NAMES[user.role]}
        </p>
      </div>

      {/* 메뉴 그룹 */}
      <nav className="flex-1 px-3">
        {menuGroups.map((group) => (
          <div key={group.category} className="mb-6">
            <p className="px-2 mb-1 text-xs font-semibold text-text-disabled uppercase">
              {group.category}
            </p>
            {group.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-sm transition-colors ${
                    isActive
                      ? "bg-primary/5 text-primary font-semibold border-l-3 border-primary"
                      : "text-text-secondary hover:bg-gray-50 hover:text-text-primary"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}
