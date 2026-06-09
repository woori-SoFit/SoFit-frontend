/**
 * 계좌번호 입력 화면
 * AccountStep 내부에서 사용
 */
import { Landmark, CircleCheck, Info } from "lucide-react";
import { BottomButton } from "@/components/common/BottomButton";
import signatureIcon from "@/assets/ba-1400-symbol.png";

interface AccountInputStepProps {
  accountNumber: string;
  onChangeAccount: (value: string) => void;
  error: string;
  isLoading: boolean;
  isValid: boolean;
  onSubmit: () => void;
}

export function AccountInputStep({
  accountNumber,
  onChangeAccount,
  error,
  isLoading,
  isValid,
  onSubmit,
}: AccountInputStepProps) {
  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 px-5 pt-8">
        {/* 상단 아이콘 + 타이틀 */}
        <div className="flex flex-col items-center mb-12">
          <div className="relative w-16 h-16 mb-8">
            <div className="w-16 h-16 rounded-full bg-blue-200 flex items-center justify-center">
              <Landmark size={32} className="text-primary" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-primary-light flex items-center justify-center">
              <CircleCheck size={14} className="text-white" />
            </div>
          </div>
          <h1 className="text-xl font-bold text-text-primary text-center mb-2">
            대출금을 입금받을 계좌를<br />입력해주세요
          </h1>
          <p className="text-sm text-text-secondary text-center">
            우리은행 입출금 계좌로만 입금받을 수 있습니다.
          </p>
        </div>

        {/* 은행 표시 */}
        <div className="flex items-center gap-3 px-4 py-3 border border-border-default rounded-lg mb-6">
          <img src={signatureIcon} alt="우리은행" className="w-6 h-6" />
          <span className="text-base font-medium text-text-primary">우리은행</span>
        </div>

        {/* 계좌번호 입력 */}
        <div className="mb-6">
          <label
            htmlFor="account-number"
            className="block text-sm font-semibold text-text-primary mb-2 ml-1"
          >
            계좌번호
          </label>
          <div className="flex items-center gap-2">
            <input
              id="account-number"
              type="text"
              inputMode="numeric"
              value={accountNumber}
              onChange={(e) => onChangeAccount(e.target.value.replace(/\D/g, ""))}
              placeholder="'-' 없이 숫자만 입력해주세요"
              className="flex-1 h-12 px-4 border border-border-default rounded-lg text-base text-text-primary placeholder:text-text-disabled focus:outline-none focus:border-primary"
            />
          </div>
          {error && (
            <p className="mt-2 text-xs text-error">{error}</p>
          )}
        </div>

        {/* 안내 박스 */}
        <div className="bg-blue-50 rounded-xl px-4 py-4">
          <div className="flex items-start gap-2">
            <Info size={16} className="text-text-secondary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-text-primary mb-1.5">
                본인 명의 계좌만 등록할 수 있어요.
              </p>
            </div>
          </div>
          <ul className="text-xs text-text-secondary space-y-1">
            <li>• 타인 명의 계좌는 입력할 수 없습니다.</li>
            <li>• 계좌 확인 시 예금주명이 자동으로 확인됩니다.</li>
          </ul>
        </div>
      </div>

      <BottomButton
        label={isLoading ? "송금 중..." : "1원 인증 요청하기"}
        onClick={onSubmit}
        disabled={!isValid || isLoading}
      />
    </div>
  );
}
