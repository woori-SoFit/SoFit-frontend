/**
 * 로그인 페이지
 * Layout: PublicLayout
 */
import { useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AxiosError } from "axios";
import mainLogo from "@/assets/mainLogo.svg";
import { useLogin } from "@/hooks/useLogin";
import { Eye, EyeOff } from 'lucide-react';

interface ValidationErrors {
  loginId?: string;
  password?: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");

  const passwordRef = useRef<HTMLInputElement>(null);
  const loginIdRef = useRef<HTMLInputElement>(null);

  // 폼 상태
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);

  // useLogin 훅 연동
  const { mutate: login, isPending } = useLogin({
    onSuccess: () => {
      navigate(returnUrl || "/", { replace: true });
    },
    onError: (error: AxiosError) => {
      const responseData = error.response?.data as { code?: string } | undefined;
      const code = responseData?.code;

      if (code === "AUTH4031") {
        setServerError("탈퇴한 계정입니다. 다시 가입 후 이용해주세요.");
      } else if (error.response?.status === 401) {
        setServerError("아이디 또는 비밀번호가 올바르지 않습니다");
      } else {
        setServerError("로그인에 실패했습니다. 잠시 후 다시 시도해주세요");
      }
      setLoginId("");
      setPassword("");
      setTimeout(() => loginIdRef.current?.focus(), 100);
    },
  });

  // 유효성 검사
  const validate = (): boolean => {
    const errors: ValidationErrors = {};

    if (!loginId.trim()) {
      errors.loginId = "아이디를 입력해주세요";
    }
    if (!password.trim()) {
      errors.password = "비밀번호를 입력해주세요";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 폼 제출
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    login({ loginId, password });
  };

  // 입력 변경 핸들러 — 에러 메시지 제거
  const handleLoginIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginId(e.target.value);
    if (validationErrors.loginId) {
      setValidationErrors((prev) => ({ ...prev, loginId: undefined }));
    }
    if (serverError) {
      setServerError(null);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (validationErrors.password) {
      setValidationErrors((prev) => ({ ...prev, password: undefined }));
    }
    if (serverError) {
      setServerError(null);
    }
  };

  return (
    <div data-testid="login-page" className="flex flex-col min-h-screen px-page-x">
      {/* 상단 여백 + 로고 */}
      <div className="flex flex-col items-center pt-32 pb-5">
        <img src={mainLogo} alt="SoFit 로고" onClick={() => navigate("/")} className="h-30" />
      </div>

      {/* 로그인 폼 */}
      <form onSubmit={handleSubmit} className="flex flex-col">
        {/* 아이디 필드 */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="loginId" className="text-sm font-medium text-text-primary">
            아이디
          </label>
          <input
            id="loginId"
            ref={loginIdRef}
            type="text"
            value={loginId}
            onChange={handleLoginIdChange}
            placeholder="아이디를 입력하세요"
            className="w-full px-4 py-3 bg-white border border-border-default rounded-lg text-base text-text-primary placeholder:text-gray-400 focus:outline-none focus:border-border-focus"
          />
          <p className="text-xs text-error min-h-4">
            {validationErrors.loginId ?? "\u00A0"}
          </p>
        </div>

        {/* 비밀번호 필드 */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium text-text-primary">
            비밀번호
          </label>
          <div className="relative">
            <input
              ref={passwordRef}
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              placeholder="비밀번호를 입력하세요"
              className="w-full px-4 py-3 bg-white border border-border-default rounded-lg text-base text-text-primary placeholder:text-gray-400 focus:outline-none focus:border-border-focus pr-12"
            />
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                setShowPassword((prev) => !prev);
                passwordRef.current?.focus();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 표시"}
            >
              {showPassword ? (
                <Eye size={18} />
              ) : (
                <EyeOff size={18} />
              )}
            </button>
          </div>
          <p className="text-xs text-error min-h-4">
            {validationErrors.password ?? "\u00A0"}
          </p>
        </div>

        {/* 서버 에러 메시지 */}
        <p className="text-xs text-error text-center min-h-4">
          {serverError ?? "\u00A0"}
        </p>

        {/* 로그인 버튼 */}
        <button
          type="submit"
          disabled={!loginId.trim() || !password.trim() || isPending}
          className="w-full h-12 items-center mt-6 bg-primary text-white font-semibold rounded-lg text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "로그인 중..." : "로그인"}
        </button>
      </form>

      {/* 비밀번호 찾기 링크 — 미구현 */}
      {/* <div className="flex justify-center mt-4">
        <Link to="" className="text-sm text-primary">
          비밀번호 찾기 &gt;
        </Link>
      </div> */}

      {/* 하단 회원가입 링크 */}
      <div className="flex justify-center items-center mt-auto pb-10 gap-2">
        <span className="text-sm text-gray-500">계정이 없으신가요?</span>
        <Link to="/signup" className="text-sm font-bold text-primary">
          회원가입 &gt;
        </Link>
      </div>
    </div>
  );
}
