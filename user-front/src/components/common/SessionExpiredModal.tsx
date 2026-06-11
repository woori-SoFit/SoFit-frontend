/**
 * 세션 만료 모달
 *
 * 서버에서 401 응답을 받으면 표시됩니다.
 * "다시 로그인" 버튼 클릭 시 현재 경로를 returnUrl로 전달하며 로그인 페이지로 이동합니다.
 */
import { useSessionStore } from "@/stores/sessionStore";
import { Clock } from "lucide-react";

export function SessionExpiredModal() {
  const isSessionExpired = useSessionStore((s) => s.isSessionExpired);
  const resetSession = useSessionStore((s) => s.resetSession);

  if (!isSessionExpired) return null;

  const handleLogin = () => {
    resetSession();
    const currentPath = window.location.pathname + window.location.search;
    window.location.href = `/login?returnUrl=${encodeURIComponent(currentPath)}`;
  };

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/50 px-6">
      <div className="w-full max-w-[320px] bg-white rounded-2xl p-6 text-center shadow-xl animate-fade-in">
        {/* 아이콘 */}
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-warning/10 flex items-center justify-center">
          <Clock size={28} className="text-warning" />
        </div>

        {/* 타이틀 */}
        <h2 className="text-lg font-bold text-text-primary mb-2">
          세션이 만료되었습니다
        </h2>

        {/* 설명 */}
        <p className="text-sm text-text-secondary mb-6 leading-relaxed">
          고객님의 정보를 안전하게 보호하기 위해<br />
          자동으로 로그아웃되었어요.
        </p>

        {/* 버튼 */}
        <button
          type="button"
          onClick={handleLogin}
          className="w-full h-12 rounded-xl bg-primary text-white text-base font-semibold hover:bg-primary-dark transition-colors"
        >
          로그인
        </button>
      </div>
    </div>
  );
}
