/**
 * 대출 실행 계좌 설정 스텝
 * 대출 약정 플로우에서 사용
 *
 * Flow:
 *   1. 계좌번호 입력 (AccountInputStep) → 1원 송금 요청
 *   2. 인증코드 입력 (AccountVerifyStep) → 검증
 */
import { useState, useEffect } from "react";
import { useLayoutStore } from "@/stores/layoutStore";
import { AccountInputStep } from "./AccountInputStep";
import { AccountVerifyStep } from "./AccountVerifyStep";

interface AccountStepProps {
  /** 계좌 인증 완료 시 호출 */
  onSubmit: () => void;
  /** 1원 송금 요청 API (계좌번호 전달, authCode 반환) */
  onSendVerification: (accountNumber: string) => Promise<{ authCode: string }>;
  /** 인증코드 검증 API (인증코드 전달) */
  onVerifyCode: (verificationCode: string) => Promise<{ success: boolean; message?: string }>;
}

type Step = "ACCOUNT" | "VERIFY";

export function AccountStep({ onSubmit, onSendVerification, onVerifyCode }: AccountStepProps) {
  const [step, setStep] = useState<Step>("ACCOUNT");
  const [accountNumber, setAccountNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // step에 따라 상단 헤더 타이틀 변경
  useEffect(() => {
    useLayoutStore.getState().setStepTitle(
      step === "ACCOUNT" ? "대출 실행 계좌 설정" : "계좌 인증"
    );
  }, [step]);

  const isAccountValid = accountNumber.length >= 10 && accountNumber.length <= 14;
  const isCodeValid = verificationCode.length === 3;

  /** 계좌번호 입력 → 1원 송금 요청 */
  const handleAccountSubmit = async () => {
    if (!isAccountValid || isLoading) return;
    setIsLoading(true);
    setError("");

    try {
      const result = await onSendVerification(accountNumber);
      setAuthCode(result.authCode);
      setStep("VERIFY");
    } catch {
      setError("1원 송금에 실패했습니다. 계좌번호를 확인해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  /** 인증코드 검증 */
  const handleVerifySubmit = async () => {
    if (!isCodeValid || isLoading) return;
    setIsLoading(true);
    setError("");

    try {
      const result = await onVerifyCode(verificationCode);
      if (!result.success) {
        setError(result.message ?? "인증코드가 일치하지 않습니다.");
        setVerificationCode("");
        setIsLoading(false);
        return;
      }
      onSubmit();
    } catch {
      setError("인증에 실패했습니다. 다시 시도해주세요.");
      setVerificationCode("");
    } finally {
      setIsLoading(false);
    }
  };

  if (step === "VERIFY") {
    return (
      <AccountVerifyStep
        accountNumber={accountNumber}
        authCode={authCode}
        verificationCode={verificationCode}
        onChangeCode={(value) => {
          setVerificationCode(value);
          setError("");
        }}
        error={error}
        isLoading={isLoading}
        isValid={isCodeValid}
        onSubmit={handleVerifySubmit}
      />
    );
  }

  return (
    <AccountInputStep
      accountNumber={accountNumber}
      onChangeAccount={(value) => {
        setAccountNumber(value);
        setError("");
      }}
      error={error}
      isLoading={isLoading}
      isValid={isAccountValid}
      onSubmit={handleAccountSubmit}
    />
  );
}
