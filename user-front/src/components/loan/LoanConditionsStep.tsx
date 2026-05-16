/**
 * 희망 대출 조건 입력 step
 *
 * 사용처:
 * - 대출 신청 LOAN_CONDITIONS step
 *
 * 입력 항목: 희망 금액, 대출 기간, 상환 방식, 자금 용도
 */
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { BottomButton } from "@/components/common/BottomButton";
import loanCondIcon from "@/assets/icons/loan-pre-apply.svg";

/** 대출 기간 옵션 */
const TERM_OPTIONS = [
  { label: "1년", value: 12 },
  { label: "3년", value: 36 },
  { label: "5년", value: 60 },
];

/** 상환 방식 옵션 */
const REPAYMENT_OPTIONS = ["원리금균등", "원금균등", "만기일시"];

/** 자금 용도 옵션 */
const PURPOSE_OPTIONS = ["운전자금", "시설자금", "기타"];

interface LoanConditionsData {
  desiredAmount: number;
  desiredTerm: number;
  repaymentMethod: string;
  purpose: string;
}

interface LoanConditionsStepProps {
  /** 최대 한도 (원) */
  maxAmount?: number;
  /** 최소 금액 (원) */
  minAmount?: number;
  /** 심사 요청 시 호출 */
  onSubmit: (data: LoanConditionsData) => void;
}

export function LoanConditionsStep({
  maxAmount = 300_000_000,
  minAmount = 10_000_000,
  onSubmit,
}: LoanConditionsStepProps) {
  const [amount, setAmount] = useState("");
  const [term, setTerm] = useState<number | null>(null);
  const [repayment, setRepayment] = useState<string | null>(null);
  const [purpose, setPurpose] = useState<string | null>(null);
  const [purposeOpen, setPurposeOpen] = useState(false);

  /** 금액 입력 핸들러 (만원 단위, 숫자만) */
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "");
    setAmount(digits);
  };

  /** 금액 표시 (콤마) — 만원 단위 */
  const displayAmount = amount ? Number(amount).toLocaleString() : "";

  /** 유효성 검사 — 입력값은 만원 단위, props는 원 단위이므로 변환 */
  const amountInWon = Number(amount) * 10_000;
  const isAmountTooLow = amount.length > 0 && amountInWon < minAmount;
  const isAmountTooHigh = amount.length > 0 && amountInWon > maxAmount;
  const isAmountValid = amount.length > 0 && !isAmountTooLow && !isAmountTooHigh;
  const isValid = isAmountValid && term !== null && repayment !== null && purpose !== null;

  /** 금액 포맷 (원 → 만원/억원 표시) */
  const formatWon = (value: number) => {
    const man = value / 10_000;
    if (man >= 10_000) return `${(man / 10_000).toFixed(0)}억원`;
    return `${man.toLocaleString()}만원`;
  };

  const handleSubmit = () => {
    if (!isValid) return;
    onSubmit({
      desiredAmount: amountInWon,
      desiredTerm: term!,
      repaymentMethod: repayment!,
      purpose: purpose!,
    });
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* 상단 안내 배너 */}
      <div className="mx-5 mt-6 p-5 rounded-2xl bg-blue-50 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-text-primary mb-1">
            희망하시는 <span className="text-primary">대출 조건</span>을<br />입력해주세요.
          </h2>
          <p className="text-sm text-text-secondary">
            입력하신 정보는 심사를 위해 사용되며,<br />정확한 정보를 입력해주세요.
          </p>
        </div>
        <img src={loanCondIcon} alt="" className="w-16 h-16 shrink-0 ml-3" />
      </div>

      {/* 입력 폼 */}
      <div className="flex-1 px-5 pt-6 pb-4 flex flex-col gap-7">
        {/* 희망 대출금액 */}
        <div>
          <div className="flex items-center mb-2">
            <label className="text-sm font-semibold text-text-primary">희망 대출금액</label>
          </div>
          <div className={`flex items-center h-12 px-4 rounded-lg border bg-white focus-within:border-border-focus transition-colors ${
            isAmountTooLow || isAmountTooHigh ? "border-error" : "border-border-default"
          }`}>
            <input
              type="text"
              inputMode="numeric"
              value={displayAmount}
              onChange={handleAmountChange}
              placeholder="금액을 입력해주세요"
              className="flex-1 text-base text-text-primary placeholder:text-text-disabled outline-none bg-transparent"
            />
            <span className="text-sm text-text-secondary ml-2">만원</span>
          </div>
          {isAmountTooLow && (
            <p className="text-xs text-error mt-1.5">
              최소 {formatWon(minAmount)} 이상 입력해주세요.
            </p>
          )}
          {isAmountTooHigh && (
            <p className="text-xs text-error mt-1.5">
              최대 가능 한도는 {formatWon(maxAmount)}입니다.
            </p>
          )}
          {!isAmountTooLow && !isAmountTooHigh && (
            <p className="text-xs text-text-disabled mt-1.5">
              {formatWon(minAmount)} ~ {formatWon(maxAmount)}
            </p>
          )}
        </div>

        {/* 대출기간 */}
        <div>
          <label className="text-sm font-semibold text-text-primary mb-2 block">대출기간</label>
          <div className="flex gap-3">
            {TERM_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setTerm(opt.value)}
                className={`flex-1 h-11 rounded-lg border text-sm font-medium transition-colors ${
                  term === opt.value
                    ? "border-primary text-primary bg-blue-50"
                    : "border-border-default text-text-primary bg-white"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 상환방식 */}
        <div>
          <label className="text-sm font-semibold text-text-primary mb-2 block">상환방식</label>
          <div className="flex gap-3">
            {REPAYMENT_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setRepayment(opt)}
                className={`flex-1 h-11 rounded-lg border text-sm font-medium transition-colors ${
                  repayment === opt
                    ? "border-primary text-primary bg-blue-50"
                    : "border-border-default text-text-primary bg-white"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* 자금용도 */}
        <div className="relative">
          <label className="text-sm font-semibold text-text-primary mb-2 block">자금용도</label>
          <button
            type="button"
            onClick={() => setPurposeOpen(!purposeOpen)}
            className="w-full flex items-center justify-between h-12 px-4 rounded-lg border border-border-default bg-white text-left transition-colors hover:border-primary"
          >
            <span className={`text-sm ${purpose ? "text-text-primary" : "text-text-disabled"}`}>
              {purpose || "선택해 주세요"}
            </span>
            <ChevronDown size={18} className={`text-text-secondary transition-transform ${purposeOpen ? "rotate-180" : ""}`} />
          </button>

          {/* 드롭다운 */}
          {purposeOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setPurposeOpen(false)} />
              <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white rounded-lg shadow-modal p-2">
                {PURPOSE_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setPurpose(opt);
                      setPurposeOpen(false);
                    }}
                    className={`w-full flex items-center px-4 py-3 rounded-lg text-left text-sm transition-colors ${
                      purpose === opt
                        ? "bg-blue-50 text-primary font-medium"
                        : "text-text-primary hover:bg-gray-50"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* 심사 요청 버튼 */}
      <BottomButton
        label="심사 요청하기"
        onClick={handleSubmit}
        disabled={!isValid}
      />
    </div>
  );
}
