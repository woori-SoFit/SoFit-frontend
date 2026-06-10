/**
 * MainLayout — 인증된 사용자용 레이아웃
 *
 * 구조:
 *   - 전체: max-w-[430px] 중앙 정렬 앱 컨테이너
 *   - 상단 헤더: 스크롤 아래로 → 숨김, 위로 → 다시 나타남
 *   - 콘텐츠 영역: 세로 스크롤
 */
import { useRef, useState, useCallback } from "react";
import { Outlet } from "react-router-dom";
import { AppHeader } from "./AppHeader";

/** 스크롤 방향 감지 임계값 (px) — 너무 민감하지 않게 */
const SCROLL_THRESHOLD = 10;

export function MainLayout() {
  const [headerVisible, setHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);

  const handleScroll = useCallback((e: React.UIEvent<HTMLElement>) => {
    const currentY = e.currentTarget.scrollTop;
    const delta = currentY - lastScrollY.current;

    if (delta > SCROLL_THRESHOLD) {
      // 아래로 스크롤 → 헤더 숨김
      setHeaderVisible(false);
    } else if (delta < -SCROLL_THRESHOLD) {
      // 위로 스크롤 → 헤더 표시
      setHeaderVisible(true);
    }

    // 최상단이면 항상 표시
    if (currentY <= 0) {
      setHeaderVisible(true);
    }

    lastScrollY.current = currentY;
  }, []);

  return (
    <div className="app-container flex flex-col min-h-screen bg-[--color-bg-base] relative">
      <AppHeader visible={headerVisible} />

      {/* 콘텐츠 영역 — 헤더 높이만큼 상단 패딩 */}
      <main
        className="flex-1 overflow-y-auto scrollbar-none pt-14"
        onScroll={handleScroll}
      >
        <Outlet />
      </main>
    </div>
  );
}
