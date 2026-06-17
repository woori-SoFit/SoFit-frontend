/**
 * 고객 정보 입력 폼 컴포넌트
 *
 * 이름, 주민등록번호(앞 7자리), 휴대폰 번호 입력 필드 제공.
 * 자동 포커스 이동 및 휴대폰 번호 포맷 적용.
 *
 * 사용처: CustomerVerifyPage 정보 입력 step
 */
import { useRef } from "react";
import { formatPhone } from "@/utils/format";

interface CustomerInfoFormProps {
  name: string;
  rrnFront: string;
  rrnBack: string;
  phone: string;
  onNameChange: (value: string) => void;
  onRrnFrontChange: (value: string) => void;
  onRrnBackChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
}

export function CustomerInfoForm({
  name,
  rrnFront,
  rrnBack,
  phone,
  onNameChange,
  onRrnFrontChange,
  onRrnBackChange,
  onPhoneChange,
}: CustomerInfoFormProps) {
  const rrnBackRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  const handleRrnFrontChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 6);
    onRrnFrontChange(digits);
    if (digits.length === 6) {
      rrnBackRef.current?.focus();
    }
  };

  const handleRrnBackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 1);
    onRrnBackChange(digits);
    if (digits.length === 1) {
      setTimeout(() => phoneRef.current?.focus(), 0);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onPhoneChange(formatPhone(e.target.value));
  };

  return (
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
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="이름을 입력해 주세요"
          className="h-12 px-4 rounded-lg border border-border-default bg-white text-base text-text-primary placeholder:text-gray-300 focus:outline-none focus:border-border-focus transition-colors"
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
            className="w-40 h-12 px-4 rounded-lg border border-border-default bg-white text-base text-text-primary placeholder:text-gray-300 focus:outline-none focus:border-border-focus transition-colors"
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
            className="w-10 h-12 rounded-lg border border-border-default bg-white text-base text-text-primary text-center placeholder:text-gray-300 focus:outline-none focus:border-border-focus transition-colors"
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
          className="h-12 px-4 rounded-lg border border-border-default bg-white text-base text-text-primary placeholder:text-gray-300 focus:outline-none focus:border-border-focus transition-colors"
        />
      </div>
    </div>
  );
}
