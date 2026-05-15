import { NavLink } from "react-router-dom";
import mainLogo from "@/assets/main-logo.svg";

interface MenuItem {
  label: string;
  path: string;
}

const MENU_ITEMS: MenuItem[] = [
  { label: "대출 현황 대시보드", path: "/dashboard" },
  { label: "사용자 관리", path: "/users" },
  { label: "API 로그", path: "/api-logs" },
  { label: "S등급 배치 관리", path: "/batch" },
];

export function Sidebar() {
  return (
    <aside className="w-60 h-screen bg-sidebar-dark flex flex-col shrink-0">
      {/* 로고 영역 */}
      <div className="p-6">
        <img src={mainLogo} alt="SoFit 로고" className="h-8" />
      </div>

      {/* 메뉴 네비게이션 */}
      <nav className="flex-1 px-3 mt-4">
        {MENU_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
