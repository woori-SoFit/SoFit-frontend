import { useState, useEffect, useCallback } from 'react';
import type { RepaymentMethod, ApprovalPayload } from '@/types';
import { useRecommendation } from '@/hooks/useRecommendation';
import {
  validateApprovalAmount,
  validateInterestRate,
  validateLoanTerm,
} from '@/utils/validators';

interface ApprovalModalProps {
  /** 대출 신청 건 ID */
  loanId: number;
  /** 모달 열림 여부 */
  isOpen: boolean;
  /** 모달 닫기 핸들러 */
  onClose: () => void;
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
 * 대출 승인 모달 컴포넌트.
 * 시스템 추천값을 조회하여 자동으로 채워진 상태로 표시하고,
 * "수정" 버튼을 눌러야 편집 모드로 전환된다.
 * 의견만 항상 편집 가능하다.
 */
export default function ApprovalModal({
  loanId,
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  error,
}: ApprovalModalProps) {
  const { data: recommendation, isLoading: isLoadingRecommendation, isError: isRecommendationError } =
    useRecommendation(loanId, isOpen);

  const [isEditing, setIsEditing] = useState(false);
  const [approvedAmount, setApprovedAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTermMonths, setLoanTermMonths] = useState('');
  const [repaymentMethod, setRepaymentMethod] = useState<RepaymentMethod>('EQUAL_PRINCIPAL_INTEREST');
  const [comment, setComment] = useState('');

  // 모달 열릴 때 상태 초기화 → 추천값 로드 후 채우기
  useEffect(() => {
    if (isOpen) {
      // 모달이 열릴 때마다 초기화 먼저
      setIsEditing(false);
      setApprovedAmount('');
      setInterestRate('');
      setLoanTermMonths('');
      setRepaymentMethod('EQUAL_PRINCIPAL_INTEREST');
      setComment('');

      // 캐시된 추천값이 이미 있으면 즉시 채움
      if (recommendation) {
        setApprovedAmount(String(recommendation.approvedAmount));
        setInterestRate(String(recommendation.interestRate));
        setLoanTermMonths(String(recommendation.loanTermMonths));
        setRepaymentMethod(recommendation.repaymentMethod);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // 추천값 fetch 완료 시 초기값 설정 (모달 열린 상태에서만)
  useEffect(() => {
    if (isOpen && recommendation) {
      setApprovedAmount(String(recommendation.approvedAmount));
      setInterestRate(String(recommendation.interestRate));
      setLoanTermMonths(String(recommendation.loanTermMonths));
      setRepaymentMethod(recommendation.repaymentMethod);
    }
  }, [recommendation]); // isOpen 의존성 제외: fetch 완료 시점에만 반응

  const isAmountValid = approvedAmount !== '' && validateApprovalAmount(Number(approvedAmount));
  const isRateValid = interestRate !== '' && validateInterestRate(Number(interestRate));
  const isTermValid = loanTermMonths !== '' && validateLoanTerm(Number(loanTermMonths));
  const isCommentValid = comment.trim().length > 0;
  const isFormValid = isAmountValid && isRateValid && isTermValid && isCommentValid;

  const handleSubmit = useCallback(() => {
    if (!isFormValid) return;

    const payload: ApprovalPayload = {
      approvedAmount: Number(approvedAmount),
      interestRate: Number(interestRate),
      loanTermMonths: Number(loanTermMonths),
      repaymentMethod,
      comment: comment.trim(),
    };
    onSubmit(payload);
  }, [isFormValid, approvedAmount, interestRate, loanTermMonths, repaymentMethod, comment, onSubmit]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 오버레이 */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* 모달 본체 */}
      <div className="relative w-full max-w-lg rounded-xl bg-bg-surface shadow-lg overflow-hidden">
        <div className="p-6 overflow-y-auto max-h-[80vh]">
        <h2 className="mb-5 text-lg font-semibold text-text-primary">대출 승인</h2>

        {/* 추천값 로딩 상태 */}
        {isLoadingRecommendation && (
          <div className="mb-4 flex items-center gap-2 text-sm text-text-secondary">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            시스템 추천값을 불러오는 중...
          </div>
        )}

        {/* 추천값 조회 실패 안내 */}
        {isRecommendationError && (
          <p className="mb-4 text-sm text-warning">
            시스템 추천값을 불러오지 못했습니다. 직접 입력해 주세요.
          </p>
        )}

        {/* 읽기 전용 모드 (추천값 로드 완료 + 편집 모드 아닐 때) */}
        {!isLoadingRecommendation && !isRecommendationError && !isEditing && approvedAmount && (
          <div className="space-y-4">
            <div className="rounded-md border border-border-default bg-gray-50 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium text-text-secondary">시스템 추천 승인 조건</span>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="rounded-md border border-primary px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/5"
                >
                  수정
                </button>
              </div>
              <dl className="space-y-2">
                <div className="flex items-center justify-between">
                  <dt className="text-xs text-text-secondary">승인 금액</dt>
                  <dd className="text-sm font-medium text-text-primary">
                    {Number(approvedAmount).toLocaleString('ko-KR')}만원
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-xs text-text-secondary">확정 금리</dt>
                  <dd className="text-sm font-medium text-text-primary">{interestRate}%</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-xs text-text-secondary">확정 기간</dt>
                  <dd className="text-sm font-medium text-text-primary">{loanTermMonths}개월</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-xs text-text-secondary">상환 방식</dt>
                  <dd className="text-sm font-medium text-text-primary">{getMethodLabel(repaymentMethod)}</dd>
                </div>
              </dl>
            </div>

            {/* 의견 (항상 편집 가능) */}
            <div>
              <label htmlFor="approvalComment" className="mb-1 block text-xs font-medium text-text-secondary">
                의견 (필수, 최대 500자)
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
          </div>
        )}

        {/* 편집 모드 또는 추천값 실패 시 */}
        {(isEditing || isRecommendationError) && (
          <div className="space-y-4">
            {isEditing && (
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-text-secondary">승인 조건 수정</span>
                <button
                  type="button"
                  onClick={() => {
                    // 추천값으로 되돌리기
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
              </div>
            )}

            {/* 승인 금액 */}
            <div>
              <label htmlFor="approvedAmount" className="mb-1 block text-xs font-medium text-text-secondary">
                승인 금액 (만원)
              </label>
              <input
                id="approvedAmount"
                type="number"
                value={approvedAmount}
                onChange={(e) => setApprovedAmount(e.target.value)}
                placeholder="10 ~ 100,000"
                className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition-colors ${
                  approvedAmount && !isAmountValid
                    ? 'border-error focus:border-error'
                    : 'border-border-default focus:border-border-focus'
                }`}
              />
              {approvedAmount && !isAmountValid && (
                <p className="mt-1 text-xs text-error">10만원(10) 이상 10억원(100,000) 이하의 정수를 입력해 주세요.</p>
              )}
            </div>

            {/* 확정 금리 */}
            <div>
              <label htmlFor="interestRate" className="mb-1 block text-xs font-medium text-text-secondary">
                확정 금리 (%)
              </label>
              <input
                id="interestRate"
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
              <label htmlFor="loanTermMonths" className="mb-1 block text-xs font-medium text-text-secondary">
                확정 기간 (개월)
              </label>
              <input
                id="loanTermMonths"
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
              <label htmlFor="repaymentMethod" className="mb-1 block text-xs font-medium text-text-secondary">
                상환 방식
              </label>
              <select
                id="repaymentMethod"
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

            {/* 의견 */}
            <div>
              <label htmlFor="approvalCommentEdit" className="mb-1 block text-xs font-medium text-text-secondary">
                의견 (필수, 최대 500자)
              </label>
              <textarea
                id="approvalCommentEdit"
                value={comment}
                onChange={(e) => setComment(e.target.value.slice(0, 500))}
                maxLength={500}
                rows={3}
                placeholder="승인 의견을 입력해 주세요."
                className="w-full resize-none rounded-md border border-border-default px-3 py-2 text-sm outline-none transition-colors focus:border-border-focus"
              />
              <p className="mt-1 text-right text-xs text-text-disabled">{comment.length}/500</p>
            </div>
          </div>
        )}

        {/* 에러 메시지 */}
        {error && (
          <p className="mt-3 text-sm text-error">승인 처리에 실패했습니다. 다시 시도해 주세요.</p>
        )}
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-end gap-3 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-md border border-border-default px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-text-inverse transition-colors hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '처리 중...' : '승인'}
          </button>
        </div>
      </div>
    </div>
  );
}
