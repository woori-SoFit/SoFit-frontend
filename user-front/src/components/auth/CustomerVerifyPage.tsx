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
 *   3. PIN 6자리 입력 완료 → onSubmit 호출
 */
import { useState } from "react";
import { PinInput } from "./PinInput";
import { BottomButton } from "@/components/common/BottomButton";

interface CustomerVerifyData {
  name: string;
  /** 주민등록번호 앞 7자리 (생년월일 6 + 뒷자리 첫째 1) */
  residentNumber: string;
  phone: string;
  pin: string;
}

interface CustomerVerifyPageProps {
  /** 페이지 설명 (선택) */
  description?: string;
  /** PIN 인증 완료 시 호출 */
  onSubmit: (data: CustomerVerifyData) => void;
  /** PIN 검증 로딩 상태 */
  isLoading?: boolean;
  /** PIN 검증 에러 메시지 */
  errorMessage?: string;
}

type Step = "INFO" | "PIN";

export function CustomerVerifyPage({
  description,
  onSubmit,
  isLoading = false,
  errorMessage,
}: CustomerVerifyPageProps) {
  const [step, setStep] = useState<Step>("INFO");
  const [name, setName] = useState("");
  const [rrnFront, setRrnFront] = useState(""); // 생년월일 6자리
  const [rrnBack, setRrnBack] = useState("");   // 뒷자리 첫째 1자리
  const [phone, setPhone] = useState("");

  /** 생년월일 입력 (숫자만, 최대 6자리) */
  const handleRrnFrontChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 6);
    setRrnFront(digits);
  };

  /** 뒷자리 첫째 입력 (숫자만, 최대 1자리) */
  const handleRrnBackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 1);
    setRrnBack(digits);
  };

  /** 휴대폰 번호 포맷팅 (010-1234-5678) */
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

  /** PIN 입력 완료 */
  const handlePinSubmit = (pin: string) => {
    onSubmit({
      name: name.trim(),
      residentNumber: rrnFront + rrnBack,
      phone: phone.replace(/\D/g, ""),
      pin,
    });
  };

  if (step === "PIN") {
    return (
      <div className="flex flex-col h-full">
        <div className="flex flex-col items-center pt-16 px-5">
          <h1 className="text-xl font-bold text-text-primary mb-2 text-center">
            PIN 인증
          </h1>
          <p className="text-sm text-text-secondary mb-8 text-center">
            금융인증서 PIN 6자리를 입력해 주세요
          </p>
        </div>
        <div className="flex-1 flex flex-col justify-end px-5 pb-10">
          <PinInput
            onSubmit={handlePinSubmit}
            isLoading={isLoading}
            errorMessage={errorMessage}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* 정보 입력 폼 */}
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
                className="h-12 rounded-lg border border-border-default bg-white text-base text-text-primary text-center placeholder:text-text-disabled focus:outline-none focus:border-border-focus transition-colors"
              />
              <span className="text-text-disabled text-lg">—</span>
              <input
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
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="010-0000-0000"
              className="h-12 px-4 rounded-xl border border-border-default bg-white text-base text-text-primary placeholder:text-text-disabled focus:outline-none focus:border-border-focus transition-colors"
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
