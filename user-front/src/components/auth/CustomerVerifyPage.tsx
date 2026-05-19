/**
 * 고객 정보 입력 + PIN 인증 페이지 공통 컴포넌트
 *
 * 사용처:
 * - 대출 신청 CERT_INFO + PIN step
 * - 대출 약정 PIN 인증
 *
 * 흐름:
 *   1. 고객 정보 입력 (이름, 주민등록번호 앞7자리, 휴대폰 번호)
 *   2. 다음 버튼 → PIN 입력 화면 전환
 *   3. PIN 6자리 입력 완료 → onVerify 호출 (서버 검증)
 *   4-a. true → 성공 애니메이션 → onSuccess 호출
 *   4-b. false → 에러 메시지 + 재입력
 */
import { useState, useRef, useCallback } from "react";
import { CircleCheckBig } from "lucide-react";
import { PinInput } from "./PinInput";
import { BottomButton } from "@/components/common/BottomButton";

export interface CustomerVerifyData {
  name: string;
  residentNumber: string;
  phone: string;
  pin: string;
}

interface CustomerVerifyPageProps {
  /** 페이지 설명 (선택) */
  description?: string;
  /**
   * PIN 검증 함수 — 서버에 POST 후 true/false 반환
   * API 연동 전에는 기본값으로 항상 true 반환
   */
  onVerify?: (data: CustomerVerifyData) => Promise<boolean>;
  /** PIN 검증 성공 후 호출 (애니메이션 끝난 뒤) */
  onSuccess: () => void;
}

type Step = "INFO" | "PIN" | "SUCCESS";

export function CustomerVerifyPage({
  description,
  onVerify,
  onSuccess,
}: CustomerVerifyPageProps) {
  const [step, setStep] = useState<Step>("INFO");
  const [name, setName] = useState("");
  const [rrnFront, setRrnFront] = useState("");
  const [rrnBack, setRrnBack] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const rrnBackRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  /** 생년월일 입력 */
  const handleRrnFrontChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 6);
    setRrnFront(digits);
    if (digits.length === 6) {
      rrnBackRef.current?.focus();
    }
  };

  /** 뒷자리 첫째 입력 */
  const handleRrnBackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 1);
    setRrnBack(digits);

    if (digits.length === 1) {
      setTimeout(() => {
        phoneRef.current?.focus();
      }, 0);
    }
  };

  /** 휴대폰 번호 포맷팅 */
  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
  };

  /** 정보 입력 유효성 검사 */
  const isInfoValid =
    name.trim().length >= 2 &&
    rrnFront.length === 6 &&
    rrnBack.length === 1 &&
    phone.replace(/\D/g, "").length === 11;

  /** PIN 입력 완료 → 서버 검증 */
  const handlePinSubmit = useCallback(
    async (pin: string) => {
      setIsLoading(true);
      setErrorMessage("");

      const data: CustomerVerifyData = {
        name: name.trim(),
        residentNumber: rrnFront + rrnBack,
        phone: phone.replace(/\D/g, ""),
        pin,
      };

      try {
        // API 연동 전 기본값: 항상 true
        const result = onVerify ? await onVerify(data) : true;

        if (result) {
          // 성공 → 애니메이션 화면
          setStep("SUCCESS");
          setTimeout(onSuccess, 1500);
        } else {
          // 실패 → 에러 메시지
          setErrorMessage("PIN이 일치하지 않습니다. 다시 입력해 주세요.");
        }
      } catch {
        setErrorMessage("인증 중 오류가 발생했습니다. 다시 시도해 주세요.");
      } finally {
        setIsLoading(false);
      }
    },
    [name, rrnFront, rrnBack, phone, onVerify, onSuccess]
  );

  // 성공 애니메이션 화면
  if (step === "SUCCESS") {
    return (
      <div className="flex flex-col items-center justify-center h-full px-5 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mb-5 animate-bounce-once">
          <CircleCheckBig size={40} className="text-white" />
        </div>
        <h2 className="text-xl font-bold text-text-primary text-center">
          인증이 완료되었습니다
        </h2>
      </div>
    );
  }

  // PIN 입력 화면
  if (step === "PIN") {
    return (
      <PinInput
        onSubmit={handlePinSubmit}
        isLoading={isLoading}
        errorMessage={errorMessage}
      />
    );
  }

  // 정보 입력 화면
  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 px-5 pt-10 pb-4">
        <div className="mb-10">
          <h1 className="text-xl font-bold text-text-primary pb-2">
            금융인증서를 불러오기 위해<br />고객 정보를 입력해주세요
          </h1>
          {description && (
            <p className="text-sm text-text-secondary">
              {description}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-6">
          {/* 이름 */}
          <div className="flex flex-col gap-2">
            <label htmlFor="customer-name" className="text-sm font-medium text-text-primary">
              이름
            </label>
            <input
              id="customer-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력해 주세요"
              className="h-12 px-4 rounded-lg border border-border-default bg-white text-base text-text-primary placeholder:text-text-disabled focus:outline-none focus:border-border-focus transition-colors"
            />
          </div>

          {/* 주민등록번호 */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-primary">
              주민등록번호
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                inputMode="numeric"
                value={rrnFront}
                onChange={handleRrnFrontChange}
                placeholder="생년월일"
                maxLength={6}
                className="w-40 h-12 px-4 rounded-lg border border-border-default bg-white text-base text-text-primary placeholder:text-text-disabled focus:outline-none focus:border-border-focus transition-colors"
              />
              <span className="text-text-disabled text-lg">—</span>
              <input
                ref={rrnBackRef}
                type="text"
                inputMode="numeric"
                value={rrnBack}
                onChange={handleRrnBackChange}
                placeholder="●"
                maxLength={1}
                className="w-10 h-12 rounded-lg border border-border-default bg-white text-base text-text-primary text-center placeholder:text-text-disabled focus:outline-none focus:border-border-focus transition-colors"
              />
              <span className="text-text-disabled">● ● ● ● ● ●</span>
            </div>
          </div>

          {/* 휴대폰 번호 */}
          <div className="flex flex-col gap-2">
            <label htmlFor="customer-phone" className="text-sm font-medium text-text-primary">
              휴대폰 번호
            </label>
            <input
              id="customer-phone"
              ref={phoneRef}
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="010-0000-0000"
              className="h-12 px-4 rounded-lg border border-border-default bg-white text-base text-text-primary placeholder:text-text-disabled focus:outline-none focus:border-border-focus transition-colors"
            />
          </div>
        </div>
      </div>

      {/* 다음 버튼 */}
      <BottomButton
        label="다음"
        onClick={() => setStep("PIN")}
        disabled={!isInfoValid}
      />
    </div>
  );
}
