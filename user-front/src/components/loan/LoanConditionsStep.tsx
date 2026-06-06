/**
 * 희망 대출 조건 입력 step
 *
 * 서버에서 상품별 옵션(자금용도, 상환방식, 최대기간, 금액 범위)을 조회하여
 * 단계적으로 선택하도록 구성:
 *   1. 자금용도 선택
 *   2. 상환방식 선택 (선택한 자금용도에 따라 필터링)
 *   3. 대출기간 입력 (선택한 조합의 maxTermMonths 이내)
 *   4. 희망 대출금액 입력 (서버 minLimit ~ maxLimit)
 */
import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BottomButton } from "@/components/common/BottomButton";
import { CharacterLoadingSpinner } from "@/components/common/CharacterLoadingSpinner";
import { fetchLoanProductOptions, submitLoanApplication } from "@/api/loanApi";
import { LOAN_KEYS } from "@/constants/queryKeys";
import { REPAYMENT_LABELS, PURPOSE_LABELS } from "@/constants/loanLabels";
import { useLoanApplyStore } from "@/stores/loanApplyStore";
import loanCondIcon from "@/assets/icons/loan-pre-apply.svg";
import type { LoanOption, SubmitLoanApplicationRequest } from "@/types/loan";

interface LoanConditionsData {
  desiredAmount: number;
  desiredTerm: number;
  repaymentMethod: string;
  purpose: string;
}

interface LoanConditionsStepProps {
  productId: number;
  applicationId: number;
  onSubmit: (data: LoanConditionsData) => void;
}

export function LoanConditionsStep({ productId, applicationId, onSubmit }: LoanConditionsStepProps) {
  const queryClient = useQueryClient();
  // API 연동: 상품별 옵션 조회
  const { data: options, isLoading } = useQuery({
    queryKey: LOAN_KEYS.productOptions(productId),
    queryFn: () => fetchLoanProductOptions(productId),
    enabled: !!productId,
  });

  const [purpose, setPurpose] = useState<string | null>(null);
  const [repayment, setRepayment] = useState<string | null>(null);
  const [termInput, setTermInput] = useState("");
  const [amount, setAmount] = useState("");

  // 자금용도 목록 (중복 제거)
  const purposeList = useMemo(() => {
    if (!options) return [];
    const set = new Set(options.loanOptions.map((o) => o.purpose));
    return Array.from(set);
  }, [options]);

  // 선택한 자금용도에 따른 상환방식 목록
  const repaymentList = useMemo(() => {
    if (!options || !purpose) return [];
    const filtered = options.loanOptions.filter((o) => o.purpose === purpose);
    const set = new Set(filtered.map((o) => o.repaymentMethod));
    return Array.from(set);
  }, [options, purpose]);

  // 선택한 조합의 최대 기간
  const selectedOption: LoanOption | undefined = useMemo(() => {
    if (!options || !purpose || !repayment) return undefined;
    return options.loanOptions.find(
      (o) => o.purpose === purpose && o.repaymentMethod === repayment
    );
  }, [options, purpose, repayment]);

  const maxTermMonths = selectedOption?.maxTermMonths ?? 0;
  const maxLimit = options?.maxLimit ?? 0;
  const minLimit = options?.minLimit ?? 0;

  // 자금용도 변경 시 하위 선택 초기화
  const handlePurposeChange = (value: string) => {
    setPurpose(value);
    setRepayment(null);
    setTermInput("");
    setAmount("");
  };

  // 상환방식 변경 시 하위 선택 초기화
  const handleRepaymentChange = (value: string) => {
    setRepayment(value);
    setTermInput("");
    setAmount("");
  };

  // 기간 입력 핸들러
  const handleTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "");
    setTermInput(digits);
  };

  // 금액 입력 핸들러 (만원 단위)
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "");
    setAmount(digits);
  };

  const displayAmount = amount ? Number(amount).toLocaleString() : "";
  const amountInWon = Number(amount) * 10_000;
  const termValue = Number(termInput);

  const isTermValid = termInput.length > 0 && termValue >= 1 && termValue <= maxTermMonths;
  const isTermTooHigh = termInput.length > 0 && termValue > maxTermMonths;
  const isAmountValid = amount.length > 0 && amountInWon >= minLimit && amountInWon <= maxLimit;
  const isAmountTooLow = amount.length > 0 && amountInWon < minLimit;
  const isAmountTooHigh = amount.length > 0 && amountInWon > maxLimit;

  const isValid = purpose !== null && repayment !== null && isTermValid && isAmountValid;

  const formatWon = (value: number) => {
    const man = value / 10_000;
    if (man >= 10_000) return `${(man / 10_000).toFixed(0)}억원`;
    return `${man.toLocaleString()}만원`;
  };

  // 심사 요청 mutation
  const submitMutation = useMutation({
    mutationFn: (body: SubmitLoanApplicationRequest) =>
      submitLoanApplication(applicationId, body),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: LOAN_KEYS.applications() });
      useLoanApplyStore.getState().setSubmitResult(data.result);
      onSubmit({
        desiredAmount: amountInWon,
        desiredTerm: termValue,
        repaymentMethod: repayment!,
        purpose: purpose!,
      });
    },
  });

  const handleSubmit = () => {
    if (!isValid) return;
    submitMutation.mutate({
      purpose: purpose!,
      repaymentMethod: repayment!,
      requestedTerm: termValue,
      requestedAmount: amountInWon,
    });
  };

  if (isLoading) {
    return <CharacterLoadingSpinner text="대출 옵션을 불러오는 중..." />;
  }

  if (!options) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-text-secondary">대출 옵션을 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* 상단 안내 배너 */}
      <div className="mx-5 mt-4 p-5 rounded-2xl bg-blue-50 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-text-primary mb-1">
            희망하시는 <span className="text-primary">대출 조건</span>을<br />입력해주세요.
          </h2>
          <p className="text-sm text-text-secondary">
            입력하신 정보는 심사를 위해 사용됩니다.
          </p>
        </div>
        <img src={loanCondIcon} alt="" className="w-16 h-16 shrink-0 ml-3" />
      </div>

      {/* 입력 폼 */}
      <div className="flex-1 px-5 pt-6 pb-4 flex flex-col gap-7">
        {/* 1. 자금용도 */}
        <div>
          <label className="text-sm font-semibold text-text-primary mb-2 block">자금용도</label>
          <div className="flex gap-3">
            {purposeList.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => handlePurposeChange(p)}
                className={`flex-1 h-11 rounded-lg border text-sm font-medium transition-colors ${
                  purpose === p
                    ? "border-primary text-primary bg-blue-50"
                    : "border-border-default text-text-primary bg-white"
                }`}
              >
                {PURPOSE_LABELS[p] ?? p}
              </button>
            ))}
          </div>
        </div>

        {/* 2. 상환방식 (자금용도 선택 후 표시) */}
        {purpose && (
          <div>
            <label className="text-sm font-semibold text-text-primary mb-2 block">상환방식</label>
            <div className="flex gap-3">
              {repaymentList.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleRepaymentChange(r)}
                  className={`flex-1 h-11 rounded-lg border text-sm font-medium transition-colors ${
                    repayment === r
                      ? "border-primary text-primary bg-blue-50"
                      : "border-border-default text-text-primary bg-white"
                  }`}
                >
                  {REPAYMENT_LABELS[r] ?? r}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 3. 대출기간 (상환방식 선택 후 표시) */}
        {repayment && selectedOption && (
          <div>
            <label className="text-sm font-semibold text-text-primary mb-2 block">대출기간</label>
            <div className={`flex items-center h-12 px-4 rounded-lg border bg-white focus-within:border-border-focus transition-colors ${
              isTermTooHigh ? "border-error" : "border-border-default"
            }`}>
              <input
                type="text"
                inputMode="numeric"
                value={termInput}
                onChange={handleTermChange}
                placeholder="기간을 입력해주세요"
                className="flex-1 text-base text-text-primary placeholder:text-text-disabled outline-none bg-transparent"
              />
              <span className="text-sm text-text-secondary ml-2">개월</span>
            </div>
            {isTermTooHigh && (
              <p className="text-xs text-error mt-1.5">
                최대 {maxTermMonths}개월까지 가능합니다.
              </p>
            )}
            {!isTermTooHigh && (
              <p className="text-xs text-text-disabled mt-1.5">
                최대 {maxTermMonths}개월
              </p>
            )}
          </div>
        )}

        {/* 4. 희망 대출금액 (기간 입력 후 표시) */}
        {isTermValid && (
          <div>
            <label className="text-sm font-semibold text-text-primary mb-2 block">희망 대출금액</label>
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
                최소 {formatWon(minLimit)} 이상 입력해주세요.
              </p>
            )}
            {isAmountTooHigh && (
              <p className="text-xs text-error mt-1.5">
                최대 가능 한도는 {formatWon(maxLimit)}입니다.
              </p>
            )}
            {!isAmountTooLow && !isAmountTooHigh && (
              <p className="text-xs text-text-disabled mt-1.5">
                {formatWon(minLimit)} ~ {formatWon(maxLimit)}
              </p>
            )}
          </div>
        )}
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
