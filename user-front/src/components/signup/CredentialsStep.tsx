import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  isValidLoginId,
  isValidPassword,
} from "../../utils/signupValidation";
import { checkLoginId } from "../../api/signupApi";
import { useSignupStore } from "../../stores/signupStore";
import { BottomButton } from "../common/BottomButton";

/**
 * 아이디/비밀번호 설정 스텝
 * TODO: API 연동 시 useMutation + checkLoginId 복원
 */
export default function CredentialsStep() {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isIdChecked, setIsIdChecked] = useState(false);
  const [idCheckMessage, setIdCheckMessage] = useState("");
  const [isIdAvailable, setIsIdAvailable] = useState(false);

  const { updateFormData, nextStep } = useSignupStore();

  const checkIdMutation = useMutation({
    mutationFn: checkLoginId,
    onSuccess: (data) => {
      if (data.result?.available) {
        setIsIdChecked(true);
        setIsIdAvailable(true);
        setIdCheckMessage("사용 가능한 아이디입니다");
      } else {
        setIsIdChecked(false);
        setIsIdAvailable(false);
        setIdCheckMessage("이미 사용 중인 아이디입니다");
      }
    },
    onError: (error) => {
      setIsIdChecked(false);
      setIsIdAvailable(false);
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        const serverMessage = axiosError.response?.data?.message;
        if (serverMessage) {
          setIdCheckMessage(serverMessage);
          return;
        }
      }
      setIdCheckMessage("중복확인 요청에 실패했습니다. 다시 시도해주세요.");
    },
  });

  const showLoginIdError = loginId.length > 0 && !isValidLoginId(loginId);
  const showPasswordError = password.length > 0 && !isValidPassword(password);
  const showPasswordMismatch =
    passwordConfirm.length > 0 && password !== passwordConfirm;

  const isCheckButtonDisabled = !isValidLoginId(loginId) || checkIdMutation.isPending;

  // 다음 버튼: 아이디 유효 + 중복확인 완료 + 비밀번호 유효 + 비밀번호 일치
  const isNextDisabled =
    !isValidLoginId(loginId) ||
    !isIdChecked ||
    !isValidPassword(password) ||
    password !== passwordConfirm;

  const handleLoginIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLoginId(value);
    if (isIdChecked || idCheckMessage) {
      setIsIdChecked(false);
      setIsIdAvailable(false);
      setIdCheckMessage("");
    }
  };

  const handleCheckId = () => {
    if (isValidLoginId(loginId) && !checkIdMutation.isPending) {
      checkIdMutation.mutate(loginId);
    }
  };

  const handleSubmit = () => {
    if (!isNextDisabled) {
      updateFormData({ loginId, password });
      nextStep();
    }
  };

  const inputClass =
    "w-full h-11 px-3 border border-border-default bg-white rounded-lg text-sm text-text-primary placeholder:text-text-disabled focus:outline-none focus:border-primary";

  return (
    <div className="flex flex-col flex-1" data-testid="credentials-step">
      <div className="flex-1 px-5 pt-10">
        <h2 className="text-lg font-bold text-text-primary mb-1">
          아이디/비밀번호 설정
        </h2>
        <p className="text-xs text-text-secondary mb-8">
          로그인에 사용할 아이디와 비밀번호를 설정해주세요
        </p>

        {/* 아이디 입력 + 중복확인 버튼 */}
        <div className="mb-3">
          <label
            htmlFor="login-id"
            className="block text-xs font-medium text-text-primary mb-1.5"
          >
            아이디
          </label>
          <div className="flex gap-2">
            <input
              id="login-id"
              type="text"
              value={loginId}
              onChange={handleLoginIdChange}
              placeholder="영문 소문자, 숫자 4~20자"
              maxLength={20}
              className={`flex-1 ${inputClass}`}
            />
            <button
              type="button"
              onClick={handleCheckId}
              disabled={isCheckButtonDisabled}
              className="h-11 px-3 rounded-lg text-xs font-medium whitespace-nowrap transition-colors bg-primary text-white hover:bg-primary-dark active:bg-primary-dark cursor-pointer disabled:bg-bg-muted disabled:text-text-disabled disabled:cursor-not-allowed"
            >
              중복확인
            </button>
          </div>
          {/* 고정 높이 메시지 영역 */}
          <p
            className={`mt-1 text-xs min-h-5 ${
              showLoginIdError
                ? "text-error"
                : idCheckMessage
                  ? isIdAvailable
                    ? "text-success"
                    : "text-error"
                  : "text-transparent"
            }`}
            role="alert"
            aria-live="polite"
          >
            {showLoginIdError
              ? "영문 소문자와 숫자 조합 4~20자로 입력해주세요"
              : idCheckMessage || "\u00A0"}
          </p>
        </div>

        {/* 비밀번호 입력 */}
        <div className="mb-3">
          <label
            htmlFor="password"
            className="block text-xs font-medium text-text-primary mb-1.5"
          >
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="영문, 숫자, 특수문자 포함 8~20자"
            maxLength={20}
            className={inputClass}
          />
          {/* 고정 높이 메시지 영역 */}
          <p
            className={`mt-1 text-xs min-h-5 ${
              showPasswordError ? "text-error" : "text-transparent"
            }`}
            role="alert"
            aria-live="polite"
          >
            {showPasswordError
              ? "영문, 숫자, 특수문자를 각 1자 이상 포함한 8~20자로 입력해주세요"
              : "\u00A0"}
          </p>
        </div>

        {/* 비밀번호 확인 입력 */}
        <div className="mb-5">
          <label
            htmlFor="password-confirm"
            className="block text-xs font-medium text-text-primary mb-1.5"
          >
            비밀번호 확인
          </label>
          <input
            id="password-confirm"
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            placeholder="비밀번호를 다시 입력해주세요"
            maxLength={20}
            className={inputClass}
          />
          {/* 고정 높이 메시지 영역 */}
          <p
            className={`mt-1 text-xs min-h-5 ${
              showPasswordMismatch ? "text-error" : "text-transparent"
            }`}
            role="alert"
            aria-live="polite"
          >
            {showPasswordMismatch ? "비밀번호가 일치하지 않습니다" : "\u00A0"}
          </p>
        </div>
      </div>

      <BottomButton
        label="다음"
        onClick={handleSubmit}
        disabled={isNextDisabled}
      />
    </div>
  );
}
