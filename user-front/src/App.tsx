/**
 * App — 앱 최상위 컴포넌트
 *
 * SSE 연결과 미읽음 개수 초기화를 앱 레벨에서 관리하여
 * 페이지 이동과 무관하게 연결을 유지한다.
 * 로그아웃 시에만 SSE 연결을 종료한다.
 */
import { RouterProvider } from "react-router-dom";
import { router } from "./router/routes";
import { useSSE } from "@/hooks/useSSE";
import { useUnreadCount } from "@/hooks/useUnreadCount";
import { SessionExpiredModal } from "@/components/common/SessionExpiredModal";

export function App() {
  // SSE 실시간 알림 연결 (로그인 시에만 활성화, 로그아웃 시 종료)
  useSSE();
  // 미읽음 알림 개수 초기화
  useUnreadCount();

  return (
    <>
      <RouterProvider router={router} />
      <SessionExpiredModal />
    </>
  );
}
