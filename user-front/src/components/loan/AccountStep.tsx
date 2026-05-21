/**
 * 대출 실행 계좌 설정 스텝
 * 대출 약정 플로우에서 사용
 */
import { useState } from "react";
import { BottomButton } from "@/components/common/BottomButton";

interface AccountStepProps {
  onSubmit: () => void;
}

export function AccountStep({ onSubmit }: AccountStepProps) {
  const [accountNumber, setAccountNumber] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "");
    setAccountNumber(digits);
  };

  const isValid = accountNumber.length >= 10 && accountNumber.length <= 14;

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 px-5 pt-10 pb-4">
        <h1 className="text-xl font-bold text-text-primary mb-2">
          대출금 입금 계좌
        </h1>
        <p className="text-sm text-text-secondary mb-8">
          대출금을 받으실 계좌번호를 입력해주세요.
        </p>

        <div>
          <label
            htmlFor="account-number"
            className="block text-sm font-medium text-text-primary mb-2"
          >
            계좌번호
          </label>
          <input
            id="account-number"
            type="text"
            inputMode="numeric"
            value={accountNumber}
            onChange={handleChange}
            placeholder="'-' 없이 숫자만 입력"
            className="w-full h-12 px-4 border border-border-default rounded-lg text-base text-text-primary placeholder:text-text-disabled focus:outline-none focus:border-primary"
          />
          <p className="mt-2 text-xs text-text-disabled">
            본인 명의 계좌만 등록 가능합니다.
          </p>
        </div>
      </div>

      <BottomButton
        label="대출 실행하기"
        onClick={onSubmit}
        disabled={!isValid}
      />
    </div>
  );
}
