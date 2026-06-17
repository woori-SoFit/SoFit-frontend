/**
 * Sidebar — 좌측 사이드바 네비게이션
 *
 * 구조:
 * - 상단: 사용자 이름 + 역할 한글 표시명
 * - 카테고리별 메뉴 그룹 (역할 기반 필터링)
 * - 하단: 개발자 전용 외부 서비스 바로가기
 * - 밝은 배경, 우측 border
 */
import { NavLink, Navigate } from "react-router-dom";
import { useAuthMe } from "@/hooks/useAuthMe";
import { getFilteredMenuGroups } from "@/utils/menuFilter";
import { ROLE_DISPLAY_NAMES } from "@/constants/permissions";
import Spinner from "@/components/common/Spinner";

/** 개발자 전용 외부 서비스 바로가기 */
const EXTERNAL_SHORTCUTS = [
  { label: "Jenkins", url: import.meta.env.VITE_JENKINS_URL },
  { label: "SonarQube", url: import.meta.env.VITE_SONARQUBE_URL },
  { label: "Spring Boot Admin", url: import.meta.env.VITE_SPRING_BOOT_ADMIN_URL },
  { label: "OpenStack", url: import.meta.env.VITE_OPENSTACK_URL },
];

export function Sidebar() {
  const { data: user, isLoading, isAuthenticated } = useAuthMe();

  // 로딩 중 처리
  if (isLoading) {
    return (
      <aside className="w-56 shrink-0 bg-white border-r border-border-default flex flex-col items-center justify-center">
        <Spinner size="sm" />
      </aside>
    );
  }

  // 미인증 시 로그인 페이지로 리다이렉트
  if (!isAuthenticated || !user) {
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
          <div key={group.category} className="mb-8">
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

      {/* 개발자 전용 바로가기 */}
      {user.role === "ADMIN_DEV" && (
        <div className="px-3 pb-4 border-t border-border-default pt-3">
          <p className="px-2 mb-1 text-xs font-semibold text-text-disabled uppercase">
            바로가기
          </p>
          {EXTERNAL_SHORTCUTS.map((shortcut) => (
            <a
              key={shortcut.label}
              href={shortcut.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-text-secondary hover:bg-gray-50 hover:text-text-primary transition-colors"
            >
              <span>{shortcut.label}</span>
              <svg
                className="w-3 h-3 text-text-disabled"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          ))}
        </div>
      )}
    </aside>
  );
}
