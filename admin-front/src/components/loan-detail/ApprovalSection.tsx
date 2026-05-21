import { useState, useEffect, useCallback } from 'react';
import type { RepaymentMethod, ApprovalPayload } from '@/types';
import { useRecommendation } from '@/hooks/useRecommendation';
import {
  validateApprovalAmount,
  validateInterestRate,
  validateLoanTerm,
} from '@/utils/validators';

interface ApprovalSectionProps {
  /** 대출 신청 건 ID */
  loanId: number;
  /** 승인 처리 핸들러 */
  onSubmit: (payload: ApprovalPayload) => void;
  /** 승인 처리 중 여부 */
  isSubmitting: boolean;
  /** 승인 처리 에러 */
  error: Error | null;
}

const REPAYMENT_METHOD_OPTIONS: { value: RepaymentMethod; label: string }[] = [
  { value: 'EQUAL_PRINCIPAL_INTEREST', label: '원리금균등상환' },
  { value: 'EQUAL_PRINCIPAL', label: '원금균등상환' },
  { value: 'BULLET', label: '만기일시상환' },
];

function getMethodLabel(method: RepaymentMethod): string {
  return REPAYMENT_METHOD_OPTIONS.find((o) => o.value === method)?.label ?? method;
}

/**
 * 심사 결과 탭 내 승인 조건 섹션.
 * 시스템 추천값을 자동으로 채워서 읽기 전용으로 표시하고,
 * "수정" 버튼으로 편집 모드 전환 가능.
 * 의견 입력은 항상 가능.
 */
export default function ApprovalSection({
  loanId,
  onSubmit,
  isSubmitting,
  error,
}: ApprovalSectionProps) {
  const { data: recommendation, isLoading, isError: isRecommendationError } =
    useRecommendation(loanId, true);

  const [isEditing, setIsEditing] = useState(false);
  const [approvedAmount, setApprovedAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTermMonths, setLoanTermMonths] = useState('');
  const [repaymentMethod, setRepaymentMethod] = useState<RepaymentMethod>('EQUAL_PRINCIPAL_INTEREST');
  const [comment, setComment] = useState('');

  // 추천값 로드 시 초기값 설정
  useEffect(() => {
    if (recommendation) {
      setApprovedAmount(String(recommendation.approvedAmount));
      setInterestRate(String(recommendation.interestRate));
      setLoanTermMonths(String(recommendation.loanTermMonths));
      setRepaymentMethod(recommendation.repaymentMethod);
    }
  }, [recommendation]);

  const isAmountValid = approvedAmount !== '' && validateApprovalAmount(Number(approvedAmount));
  const isRateValid = interestRate !== '' && validateInterestRate(Number(interestRate));
  const isTermValid = loanTermMonths !== '' && validateLoanTerm(Number(loanTermMonths));
  const isFormValid = isAmountValid && isRateValid && isTermValid;

  const handleSubmit = useCallback(() => {
    if (!isFormValid) return;
    const payload: ApprovalPayload = {
      approvedAmount: Number(approvedAmount),
      interestRate: Number(interestRate),
      loanTermMonths: Number(loanTermMonths),
      repaymentMethod,
      comment: comment.trim() || undefined,
    };
    onSubmit(payload);
  }, [isFormValid, approvedAmount, interestRate, loanTermMonths, repaymentMethod, comment, onSubmit]);

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="rounded-lg border border-border-default bg-bg-surface p-6 shadow-card">
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          시스템 추천 승인 조건을 불러오는 중...
        </div>
      </div>
    );
  }

  // 추천값 조회 실패 → 직접 입력 모드
  if (isRecommendationError) {
    return (
      <div className="rounded-lg border border-border-default bg-bg-surface p-6 shadow-card">
        <p className="mb-4 text-sm text-warning">
          시스템 추천값을 불러오지 못했습니다. 직접 입력해 주세요.
        </p>
        <EditForm
          approvedAmount={approvedAmount}
          setApprovedAmount={setApprovedAmount}
          interestRate={interestRate}
          setInterestRate={setInterestRate}
          loanTermMonths={loanTermMonths}
          setLoanTermMonths={setLoanTermMonths}
          repaymentMethod={repaymentMethod}
          setRepaymentMethod={setRepaymentMethod}
          comment={comment}
          setComment={setComment}
          isAmountValid={isAmountValid}
          isRateValid={isRateValid}
          isTermValid={isTermValid}
          isFormValid={isFormValid}
          isSubmitting={isSubmitting}
          error={error}
          onSubmit={handleSubmit}
        />
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border-default bg-bg-surface p-6 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary">시스템 추천 승인 조건</h3>
        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="rounded-md border border-primary px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/5"
          >
            수정
          </button>
        )}
        {isEditing && (
          <button
            type="button"
            onClick={() => {
              if (recommendation) {
                setApprovedAmount(String(recommendation.approvedAmount));
                setInterestRate(String(recommendation.interestRate));
                setLoanTermMonths(String(recommendation.loanTermMonths));
                setRepaymentMethod(recommendation.repaymentMethod);
              }
              setIsEditing(false);
            }}
            className="text-xs text-text-secondary hover:text-text-primary transition-colors"
          >
            되돌리기
          </button>
        )}
      </div>

      {/* 읽기 전용 모드 */}
      {!isEditing && (
        <div className="space-y-5">
          <dl className="grid grid-cols-2 gap-4 rounded-md border border-border-default bg-gray-50 p-4 md:grid-cols-4">
            <div>
              <dt className="text-xs text-text-secondary">승인 금액</dt>
              <dd className="mt-1 text-sm font-semibold text-text-primary">
                {approvedAmount ? `${Number(approvedAmount).toLocaleString('ko-KR')}만원` : '-'}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-text-secondary">확정 금리</dt>
              <dd className="mt-1 text-sm font-semibold text-text-primary">
                {interestRate ? `${interestRate}%` : '-'}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-text-secondary">확정 기간</dt>
              <dd className="mt-1 text-sm font-semibold text-text-primary">
                {loanTermMonths ? `${loanTermMonths}개월` : '-'}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-text-secondary">상환 방식</dt>
              <dd className="mt-1 text-sm font-semibold text-text-primary">
                {getMethodLabel(repaymentMethod)}
              </dd>
            </div>
          </dl>

          {/* 의견 입력 */}
          <div>
            <label htmlFor="approvalComment" className="mb-1 block text-xs font-medium text-text-secondary">
              의견 (선택, 최대 500자)
            </label>
            <textarea
              id="approvalComment"
              value={comment}
              onChange={(e) => setComment(e.target.value.slice(0, 500))}
              maxLength={500}
              rows={3}
              placeholder="승인 의견을 입력해 주세요."
              className="w-full resize-none rounded-md border border-border-default px-3 py-2 text-sm outline-none transition-colors focus:border-border-focus"
            />
            <p className="mt-1 text-right text-xs text-text-disabled">{comment.length}/500</p>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <p className="text-sm text-error">승인 처리에 실패했습니다. 다시 시도해 주세요.</p>
          )}

          {/* 승인 버튼 */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isFormValid || isSubmitting}
              className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-text-inverse transition-colors hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '처리 중...' : '승인'}
            </button>
          </div>
        </div>
      )}

      {/* 편집 모드 */}
      {isEditing && (
        <EditForm
          approvedAmount={approvedAmount}
          setApprovedAmount={setApprovedAmount}
          interestRate={interestRate}
          setInterestRate={setInterestRate}
          loanTermMonths={loanTermMonths}
          setLoanTermMonths={setLoanTermMonths}
          repaymentMethod={repaymentMethod}
          setRepaymentMethod={setRepaymentMethod}
          comment={comment}
          setComment={setComment}
          isAmountValid={isAmountValid}
          isRateValid={isRateValid}
          isTermValid={isTermValid}
          isFormValid={isFormValid}
          isSubmitting={isSubmitting}
          error={error}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

// ─── 편집 폼 서브 컴포넌트 ─────────────────────────────────────────

interface EditFormProps {
  approvedAmount: string;
  setApprovedAmount: (v: string) => void;
  interestRate: string;
  setInterestRate: (v: string) => void;
  loanTermMonths: string;
  setLoanTermMonths: (v: string) => void;
  repaymentMethod: RepaymentMethod;
  setRepaymentMethod: (v: RepaymentMethod) => void;
  comment: string;
  setComment: (v: string) => void;
  isAmountValid: boolean;
  isRateValid: boolean;
  isTermValid: boolean;
  isFormValid: boolean;
  isSubmitting: boolean;
  error: Error | null;
  onSubmit: () => void;
}

function EditForm({
  approvedAmount,
  setApprovedAmount,
  interestRate,
  setInterestRate,
  loanTermMonths,
  setLoanTermMonths,
  repaymentMethod,
  setRepaymentMethod,
  comment,
  setComment,
  isAmountValid,
  isRateValid,
  isTermValid,
  isFormValid,
  isSubmitting,
  error,
  onSubmit,
}: EditFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* 승인 금액 */}
        <div>
          <label htmlFor="editAmount" className="mb-1 block text-xs font-medium text-text-secondary">
            승인 금액 (만원)
          </label>
          <input
            id="editAmount"
            type="number"
            value={approvedAmount}
            onChange={(e) => setApprovedAmount(e.target.value)}
            placeholder="100,000 ~ 1,000,000,000"
            className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition-colors ${
              approvedAmount && !isAmountValid
                ? 'border-error focus:border-error'
                : 'border-border-default focus:border-border-focus'
            }`}
          />
          {approvedAmount && !isAmountValid && (
            <p className="mt-1 text-xs text-error">10만 이상 10억 이하의 정수를 입력해 주세요.</p>
          )}
        </div>

        {/* 확정 금리 */}
        <div>
          <label htmlFor="editRate" className="mb-1 block text-xs font-medium text-text-secondary">
            확정 금리 (%)
          </label>
          <input
            id="editRate"
            type="number"
            step="0.01"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            placeholder="0.01 ~ 20.00"
            className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition-colors ${
              interestRate && !isRateValid
                ? 'border-error focus:border-error'
                : 'border-border-default focus:border-border-focus'
            }`}
          />
          {interestRate && !isRateValid && (
            <p className="mt-1 text-xs text-error">0.01% 이상 20.00% 이하로 입력해 주세요.</p>
          )}
        </div>

        {/* 확정 기간 */}
        <div>
          <label htmlFor="editTerm" className="mb-1 block text-xs font-medium text-text-secondary">
            확정 기간 (개월)
          </label>
          <input
            id="editTerm"
            type="number"
            value={loanTermMonths}
            onChange={(e) => setLoanTermMonths(e.target.value)}
            placeholder="1 ~ 360"
            className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition-colors ${
              loanTermMonths && !isTermValid
                ? 'border-error focus:border-error'
                : 'border-border-default focus:border-border-focus'
            }`}
          />
          {loanTermMonths && !isTermValid && (
            <p className="mt-1 text-xs text-error">1개월 이상 360개월 이하의 정수를 입력해 주세요.</p>
          )}
        </div>

        {/* 상환 방식 */}
        <div>
          <label htmlFor="editMethod" className="mb-1 block text-xs font-medium text-text-secondary">
            상환 방식
          </label>
          <select
            id="editMethod"
            value={repaymentMethod}
            onChange={(e) => setRepaymentMethod(e.target.value as RepaymentMethod)}
            className="w-full rounded-md border border-border-default px-3 py-2 text-sm outline-none transition-colors focus:border-border-focus"
          >
            {REPAYMENT_METHOD_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 의견 */}
      <div>
        <label htmlFor="editComment" className="mb-1 block text-xs font-medium text-text-secondary">
          의견 (선택, 최대 500자)
        </label>
        <textarea
          id="editComment"
          value={comment}
          onChange={(e) => setComment(e.target.value.slice(0, 500))}
          maxLength={500}
          rows={3}
          placeholder="승인 의견을 입력해 주세요."
          className="w-full resize-none rounded-md border border-border-default px-3 py-2 text-sm outline-none transition-colors focus:border-border-focus"
        />
        <p className="mt-1 text-right text-xs text-text-disabled">{comment.length}/500</p>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <p className="text-sm text-error">승인 처리에 실패했습니다. 다시 시도해 주세요.</p>
      )}

      {/* 승인 버튼 */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onSubmit}
          disabled={!isFormValid || isSubmitting}
          className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-text-inverse transition-colors hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '처리 중...' : '승인'}
        </button>
      </div>
    </div>
  );
}
