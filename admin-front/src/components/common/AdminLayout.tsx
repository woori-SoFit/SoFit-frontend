import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export function AdminLayout() {
  return (
    <div className="flex h-screen">
      {/* 좌측 고정 사이드바 */}
      <Sidebar />

      {/* 우측 콘텐츠 영역 */}
      <main className="flex-1 overflow-y-auto bg-white">
        <Outlet />
      </main>
    </div>
  );
}
