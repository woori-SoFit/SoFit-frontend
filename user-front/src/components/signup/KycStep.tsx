import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { verifyKyc } from "../../api/signupApi";
import { useSignupStore } from "../../stores/signupStore";
import { BottomButton } from "../common/BottomButton";

/**
 * KYC 스텝 — 사업자등록번호 입력 및 진위 확인 API 연동
 * 3자리-2자리-5자리 분할 입력, 칸이 차면 자동 포커스 이동
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8
 */
export default function KycStep() {
  const [part1, setPart1] = useState(""); // 3자리
  const [part2, setPart2] = useState(""); // 2자리
  const [part3, setPart3] = useState(""); // 5자리
  const [errorMessage, setErrorMessage] = useState("");

  const ref1 = useRef<HTMLInputElement>(null);
  const ref2 = useRef<HTMLInputElement>(null);
  const ref3 = useRef<HTMLInputElement>(null);

  const { updateFormData, nextStep } = useSignupStore();

  const businessNumber = part1 + part2 + part3;

  /** 입력값 전체 초기화 */
  const clearInputs = () => {
    setPart1("");
    setPart2("");
    setPart3("");
    ref1.current?.focus();
  };

  const kycMutation = useMutation({
    mutationFn: verifyKyc,
    onSuccess: (data) => {
      if (data.result) {
        updateFormData({ businessRegistrationNumber: businessNumber });
        nextStep();
      } else {
        setErrorMessage(data.message || "유효하지 않은 사업자등록번호입니다");
        clearInputs();
      }
    },
    onError: (error) => {
      // 400 등 서버 에러 응답에서 message 추출
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        const serverMessage = axiosError.response?.data?.message;
        if (serverMessage) {
          setErrorMessage(serverMessage);
          clearInputs();
          return;
        }
      }
      setErrorMessage("인증 요청에 실패했습니다. 다시 시도해주세요.");
      clearInputs();
    },
  });

  const isButtonDisabled = businessNumber.length < 10 || kycMutation.isPending;

  /** 숫자만 필터링하는 헬퍼 */
  const filterDigits = (value: string, maxLen: number) =>
    value.replace(/[^0-9]/g, "").slice(0, maxLen);

  const clearError = () => {
    if (errorMessage) setErrorMessage("");
  };

  const handlePart1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = filterDigits(e.target.value, 3);
    setPart1(value);
    clearError();
    if (value.length === 3) {
      ref2.current?.focus();
    }
  };

  const handlePart2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = filterDigits(e.target.value, 2);
    setPart2(value);
    clearError();
    if (value.length === 2) {
      ref3.current?.focus();
    }
  };

  const handlePart3Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = filterDigits(e.target.value, 5);
    setPart3(value);
    clearError();
  };

  /** Backspace로 빈 칸에서 이전 칸으로 포커스 이동 */
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    currentValue: string,
    prevRef: React.RefObject<HTMLInputElement | null> | null
  ) => {
    if (e.key === "Backspace" && currentValue === "" && prevRef) {
      prevRef.current?.focus();
    }
  };

  const handleSubmit = () => {
    if (businessNumber.length === 10 && !kycMutation.isPending) {
      kycMutation.mutate(businessNumber);
    }
  };

  const inputClass =
    "h-10 px-2 min-w-0 bg-white border border-border-default rounded-lg text-center text-base font-medium placeholder:text-gray-300 focus:outline-none focus:border-primary";

  /** 붙여넣기 처리 — 어느 칸에 붙여넣어도 10자리를 3-2-5로 분배 */
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const raw = e.clipboardData.getData("text").replace(/[^0-9]/g, "");
    if (raw.length === 0) return;
    e.preventDefault();
    const p1 = raw.slice(0, 3);
    const p2 = raw.slice(3, 5);
    const p3 = raw.slice(5, 10);
    setPart1(p1);
    setPart2(p2);
    setPart3(p3);
    clearError();
    // 포커스: 아직 덜 채워진 첫 번째 칸으로 이동
    if (p1.length < 3) ref1.current?.focus();
    else if (p2.length < 2) ref2.current?.focus();
    else ref3.current?.focus();
  };

  return (
    <div className="flex flex-col flex-1" data-testid="kyc-step">
      <div className="flex-1 px-5 pt-10">
        <h2 className="text-xl font-bold text-text-primary mb-2">
          사업자등록번호 인증
        </h2>
        <p className="text-sm text-text-secondary mb-6">
          사업자등록번호 10자리를 입력해주세요
        </p>

        <div className="mb-4">
          <div className="flex items-center gap-1.5">
            <input
              ref={ref1}
              type="text"
              inputMode="numeric"
              value={part1}
              onChange={handlePart1Change}
              onPaste={handlePaste}
              placeholder="000"
              maxLength={3}
              aria-label="사업자등록번호 앞 3자리"
              className={`flex-3 ${inputClass}`}
            />
            <span className="text-text-secondary text-sm">-</span>
            <input
              ref={ref2}
              type="text"
              inputMode="numeric"
              value={part2}
              onChange={handlePart2Change}
              onPaste={handlePaste}
              onKeyDown={(e) => handleKeyDown(e, part2, ref1)}
              placeholder="00"
              maxLength={2}
              aria-label="사업자등록번호 중간 2자리"
              className={`flex-2 ${inputClass}`}
            />
            <span className="text-text-secondary text-sm">-</span>
            <input
              ref={ref3}
              type="text"
              inputMode="numeric"
              value={part3}
              onChange={handlePart3Change}
              onPaste={handlePaste}
              onKeyDown={(e) => handleKeyDown(e, part3, ref2)}
              placeholder="00000"
              maxLength={5}
              aria-label="사업자등록번호 뒤 5자리"
              className={`flex-5 ${inputClass}`}
            />
          </div>
          {errorMessage && (
            <p className="mt-2 text-sm text-error" role="alert">
              {errorMessage}
            </p>
          )}
        </div>
      </div>

      <BottomButton
        label={kycMutation.isPending ? "확인 중..." : "확인"}
        onClick={handleSubmit}
        disabled={isButtonDisabled}
      />
    </div>
  );
}
