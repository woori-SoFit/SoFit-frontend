/**
 * AdminLayout — 관리자 전체 레이아웃
 *
 * 구조:
 * - 최상단: Header (로고 + 로그아웃 + 이메일)
 * - 좌측: Sidebar (사용자 인사 + 카테고리별 메뉴)
 * - 우측: 콘텐츠 영역 (밝은 회색 배경)
 */
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export function AdminLayout() {
  return (
    <div className="flex flex-col h-screen">
      {/* 최상단 헤더 */}
      <Header />

      {/* 하단: 사이드바 + 콘텐츠 */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-bg-base p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
