/**
 * Sidebar — 좌측 사이드바 네비게이션
 *
 * 구조:
 * - 상단: 사용자 인사 ("관리자 님, 반가워요!")
 * - 카테고리별 메뉴 그룹
 * - 밝은 배경, 우측 border
 */
import { NavLink } from "react-router-dom";

interface MenuItem {
  label: string;
  path: string;
}

interface MenuGroup {
  category: string;
  items: MenuItem[];
}

const MENU_GROUPS: MenuGroup[] = [
  {
    category: "대출",
    items: [
      { label: "대출 신청 현황", path: "/dashboard" },
    ],
  },
  {
    category: "관리",
    items: [
      { label: "고객 관리", path: "/users" },
    ],
  },
  {
    category: "시스템",
    items: [
      { label: "API 로그", path: "/api-logs" },
      { label: "S등급 배치 관리", path: "/batch" },
    ],
  },
];

export function Sidebar() {
  return (
    <aside className="w-52 shrink-0 bg-white border-r border-border-default flex flex-col">
      {/* 사용자 인사 */}
      <div className="px-5 py-4">
        <p className="text-sm text-text-primary">
          <span className="font-semibold text-primary">관리자</span> 님, 반가워요!
        </p>
      </div>

      {/* 메뉴 그룹 */}
      <nav className="flex-1 px-3">
        {MENU_GROUPS.map((group) => (
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
