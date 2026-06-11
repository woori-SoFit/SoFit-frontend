/**
 * 계좌 인증번호 입력 화면
 * AccountStep 내부에서 사용
 */
import { useRef, useEffect, useState } from "react";
import { ShieldCheck, Info } from "lucide-react";
import { BottomButton } from "@/components/common/BottomButton";
import { useMe } from "@/hooks/useMe";
import { maskAccountNumber } from "@/utils/format";
import signatureIcon from "@/assets/ba-1400-symbol.png";
import wooriWonIcon from "@/assets/icons/woori-won.png";

interface AccountVerifyStepProps {
  accountNumber: string;
  authCode: string;
  verificationCode: string;
  onChangeCode: (value: string) => void;
  error: string;
  isLoading: boolean;
  isValid: boolean;
  onSubmit: () => void;
}

export function AccountVerifyStep({
  accountNumber,
  authCode,
  verificationCode,
  onChangeCode,
  error,
  isLoading,
  isValid,
  onSubmit,
}: AccountVerifyStepProps) {
  const { me } = useMe();
  const inputRef = useRef<HTMLInputElement>(null);
  const [showBanner, setShowBanner] = useState(false);

  // 마운트 직후 딜레이 → 위에서 아래로 슬라이드, 5초 후 다시 위로 사라짐
  useEffect(() => {
    if (!authCode) return;
    const showTimer = setTimeout(() => setShowBanner(true), 100);
    const hideTimer = setTimeout(() => setShowBanner(false), 5000);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [authCode]);

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

  const maskedAccount = maskAccountNumber(accountNumber);

  return (
    <div className="flex flex-col min-h-full">
      {/* 인증번호 푸시 알림 스타일 토스트 — 헤더 위에 fixed */}
      {authCode && (
        <div
          className={`fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-100 px-3 pt-2 transition-transform duration-500 ease-out ${
            showBanner ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <div className="bg-[#f2f2f7]/80 backdrop-blur-xl rounded-2xl px-4 py-4 flex items-start gap-3">
            {/* 앱 아이콘 */}
            <img
              src={wooriWonIcon}
              alt="우리WON뱅킹"
              className="w-10 h-10 rounded-lg shrink-0"
            />
            {/* 내용 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900">SOFIT 입출금알림</span>
                <span className="text-xs text-gray-400">지금</span>
              </div>
              <p className="text-sm text-gray-700 mt-0.5 leading-relaxed">
                [입금] <span className="font-bold">{authCode}</span> 1원 {maskedAccount} 계좌
              </p>
            </div>
          </div>
        </div>
      )}

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
              {error}
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
