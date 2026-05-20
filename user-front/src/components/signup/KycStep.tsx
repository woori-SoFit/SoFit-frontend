import { useRef, useState } from "react";
import { useSignupStore } from "../../stores/signupStore";
import { BottomButton } from "../common/BottomButton";

/**
 * KYC 스텝 — 사업자등록번호 입력 및 국세청 API 진위 확인
 * 3자리-2자리-5자리 분할 입력, 칸이 차면 자동 포커스 이동
 * TODO: API 연동 시 useMutation + verifyKyc 복원
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

  const isButtonDisabled = businessNumber.length < 10;

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

  /** 임시: API 없이 바로 다음 스텝으로 이동 */
  const handleSubmit = () => {
    if (businessNumber.length === 10) {
      updateFormData({ businessRegistrationNumber: businessNumber });
      nextStep();
    }
  };

  const inputClass =
    "h-10 px-2 min-w-0 border border-border-default rounded-lg text-center text-base font-medium text-text-primary placeholder:text-text-disabled focus:outline-none focus:border-primary";

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
        label="확인"
        onClick={handleSubmit}
        disabled={isButtonDisabled}
      />
    </div>
  );
}
