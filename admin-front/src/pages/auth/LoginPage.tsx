import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginAdmin } from "@/api/authApi";
import { useAuthStore } from "@/stores/authStore";
import { AUTH_KEYS } from "@/constants/queryKeys";
import type { AuthUser } from "@/types";
import mainLogo from "@/assets/mainLogo.svg";
import { EyeIcon, EyeOffIcon } from "@/components/icons";
import type { AxiosError } from "axios";

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const queryClient = useQueryClient();

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const loginMutation = useMutation({
    mutationFn: loginAdmin,
    onSuccess: (data) => {
      const user: AuthUser = { userId: data.userId, name: data.name, role: data.role };
      login(user);

      // auth/me 쿼리 캐시에 직접 설정 (불필요한 /auth/me 호출 방지)
      queryClient.setQueryData<AuthUser>(AUTH_KEYS.me, user);

      navigate("/dashboard", { replace: true });
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      const message =
        err.response?.data?.message ?? "로그인에 실패했습니다. 다시 시도해주세요.";
      setPassword("");
      setError(message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!loginId.trim()) {
      setError("아이디를 입력하세요.");
      return;
    }

    if (!password) {
      setError("비밀번호를 입력하세요.");
      return;
    }

    loginMutation.mutate({ loginId: loginId.trim(), password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm p-8 bg-white rounded-xl border border-border-default">
        {/* 로고 */}
        <div className="flex justify-center mb-4">
          <img src={mainLogo} alt="SoFit 로고" className="h-14" />
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
              placeholder="아이디를 입력하세요"
              className="w-full px-4 py-3 border border-border-default rounded-lg text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-1">
              비밀번호
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                className="w-full px-4 py-3 border border-border-default rounded-lg text-sm focus:outline-none focus:border-primary pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-disabled hover:text-text-secondary"
                aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
              >
                {showPassword ? <EyeIcon /> : <EyeOffIcon />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full py-3 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loginMutation.isPending ? "로그인 중..." : "로그인"}
          </button>
        </form>
      </div>
    </div>
  );
}
