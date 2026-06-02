/**
 * MainLayout — 인증된 사용자용 레이아웃
 *
 * 구조:
 *   - 전체: max-w-[430px] 중앙 정렬 앱 컨테이너
 *   - 상단 헤더 고정 (sticky top-0)
 *   - 하단 탭바 없음
 *   - 콘텐츠 영역: 세로 스크롤
 */
import { Outlet } from "react-router-dom";
import { AppHeader } from "./AppHeader";

export function MainLayout() {

  return (
    <div className="app-container flex flex-col min-h-screen bg-[--color-bg-base]">
      {/* 상단 헤더 고정 */}
      <AppHeader />

      {/* 콘텐츠 영역 — 헤더 높이만큼 패딩, 세로 스크롤 */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
