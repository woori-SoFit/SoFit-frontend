/**
 * 계좌 인증번호 입력 화면
 * AccountStep 내부에서 사용
 */
import { useRef, useEffect } from "react";
import { ShieldCheck, Info } from "lucide-react";
import { BottomButton } from "@/components/common/BottomButton";
import { useMe } from "@/hooks/useMe";
import signatureIcon from "@/assets/ba-1400-symbol.png";

interface AccountVerifyStepProps {
  accountNumber: string;
  verificationCode: string;
  onChangeCode: (value: string) => void;
  error: string;
  isLoading: boolean;
  isValid: boolean;
  onSubmit: () => void;
}

export function AccountVerifyStep({
  accountNumber,
  verificationCode,
  onChangeCode,
  error,
  isLoading,
  isValid,
  onSubmit,
}: AccountVerifyStepProps) {
  const { me } = useMe();
  const inputRef = useRef<HTMLInputElement>(null);

  // 마운트 시 자동 포커스
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  // 인증 실패로 코드가 초기화되면 다시 포커스
  useEffect(() => {
    if (verificationCode === "" && error) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [verificationCode, error]);

  /** 계좌번호 마스킹 (예: 1002940540000 → 1002-****-40000) */
  const maskedAccount = accountNumber.length >= 8
    ? `${accountNumber.slice(0, 4)}-****-${accountNumber.slice(-5)}`
    : accountNumber;

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 px-5 pt-8">
        {/* 상단 아이콘 + 타이틀 */}
        <div className="flex flex-col items-center mb-12">
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center mb-8">
            <ShieldCheck size={28} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-text-primary text-center mb-2">
            인증번호를 입력해주세요
          </h1>
          <p className="text-sm text-text-secondary text-center">
            입금자명에 표시된 인증번호 3자리를 입력해주세요.
          </p>
        </div>

        {/* 계좌 정보 카드 */}
        <div className="border border-border-default rounded-xl mb-8 divide-y divide-border-default">
          <div className="flex items-center justify-between px-4 py-3.5">
            <span className="text-sm text-text-secondary">은행</span>
            <div className="flex items-center gap-2">
              <img src={signatureIcon} alt="우리은행" className="w-4 h-4" />
              <span className="text-sm font-medium text-text-primary">우리은행</span>
            </div>
          </div>
          <div className="flex items-center justify-between px-4 py-3.5">
            <span className="text-sm text-text-secondary">계좌번호</span>
            <span className="text-sm font-medium text-text-primary">{maskedAccount}</span>
          </div>
          <div className="flex items-center justify-between px-4 py-3.5">
            <span className="text-sm text-text-secondary">예금주</span>
            <span className="text-sm font-medium text-text-primary">{me?.name ?? "-"}</span>
          </div>
        </div>

        {/* 인증번호 입력 */}
        <div>
          <p className="text-sm font-semibold text-text-primary mb-3">인증번호 입력</p>
          <div
            className="flex gap-3 justify-center mb-4 cursor-text"
            onClick={() => inputRef.current?.focus()}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`w-14 h-14 rounded-lg border-2 flex items-center justify-center text-2xl font-bold ${
                  verificationCode[i]
                    ? "border-primary text-primary"
                    : i === verificationCode.length
                      ? "border-primary"
                      : "border-border-default text-text-disabled"
                }`}
              >
                {verificationCode[i] ?? ""}
              </div>
            ))}
          </div>
          {/* 실제 input — 화면에 보이지 않지만 포커스 가능 */}
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            maxLength={3}
            value={verificationCode}
            onChange={(e) => onChangeCode(e.target.value.replace(/\D/g, ""))}
            className="w-0 h-0 overflow-hidden opacity-0 absolute"
          />
          {error && (
            <p className="text-xs text-error text-center mt-3">
              인증번호가 일치하지 않습니다.<br />
              입금자명에 표시된 숫자 3자리를 다시 확인해주세요.
            </p>
          )}
        </div>

        {/* 안내 문구 */}
        <div className="flex items-center gap-2 mt-6">
          <Info size={14} className="text-text-secondary shrink-0" />
          <p className="text-xs text-text-secondary">
            인증번호 3자리를 입력하면 계좌 인증이 완료됩니다.
          </p>
        </div>
      </div>

      <BottomButton
        label={isLoading ? "확인 중..." : "계좌 인증 완료"}
        onClick={onSubmit}
        disabled={!isValid || isLoading}
      />
    </div>
  );
}
