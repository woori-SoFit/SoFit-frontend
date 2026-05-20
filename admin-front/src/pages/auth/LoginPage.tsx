import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import type { AdminRole } from "@/types";
import mainLogo from "@/assets/main-logo.svg";

/** Mock 계정 목록 — API 연동 전 테스트용 */
const MOCK_ACCOUNTS: { loginId: string; name: string; role: AdminRole }[] = [
  { loginId: "dev_admin", name: "개발자", role: "ADMIN_DEV" },
  { loginId: "bank_teller", name: "김은행", role: "ADMIN_BANK_TELLER" },
  { loginId: "bank_manager", name: "박지점장", role: "ADMIN_BANK_MANAGER" },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Mock 인증: loginId만 매칭 (비밀번호 검증 생략)
    const account = MOCK_ACCOUNTS.find((a) => a.loginId === loginId);
    if (!account) {
      setError("존재하지 않는 계정입니다. (dev_admin / bank_teller / bank_manager)");
      return;
    }

    if (!password) {
      setError("비밀번호를 입력하세요.");
      return;
    }

    // Zustand에 사용자 정보 저장
    login({ id: MOCK_ACCOUNTS.indexOf(account) + 1, name: account.name, role: account.role });
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm p-8 bg-white rounded-xl shadow-card">
        {/* 로고 */}
        <div className="flex justify-center mb-8">
          <img src={mainLogo} alt="SoFit 로고" className="h-10" />
        </div>

        {/* 로그인 폼 */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-text-secondary mb-1">
              아이디
            </label>
            <input
              id="username"
              type="text"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              placeholder="dev_admin / bank_teller / bank_manager"
              className="w-full px-4 py-3 border border-border-default rounded-lg text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-1">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="아무 값이나 입력"
              className="w-full px-4 py-3 border border-border-default rounded-lg text-sm focus:outline-none focus:border-primary"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors"
          >
            로그인
          </button>
        </form>

        {/* 테스트 계정 안내 */}
        <div className="mt-6 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs font-medium text-text-secondary mb-2">테스트 계정</p>
          <ul className="text-xs text-text-disabled space-y-1">
            <li><span className="font-mono">dev_admin</span> — 개발 관리자 (전체 메뉴)</li>
            <li><span className="font-mono">bank_teller</span> — 은행원 (대출+관리)</li>
            <li><span className="font-mono">bank_manager</span> — 지점장 (대출+관리+결재)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
