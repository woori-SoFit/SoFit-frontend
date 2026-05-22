import { useState, useEffect } from 'react';
import type { LoanProductInfo, ApplicationInfo, RecommendationData, ReviewStatus, RepaymentMethod } from '@/types';
import { formatCurrency, formatMonths } from '@/utils/formatters';
import { REPAYMENT_METHOD_LABELS, PURPOSE_LABELS } from '@/constants/loanLabels';
import {
  validateApprovalAmount,
  validateInterestRate,
  validateLoanTerm,
} from '@/utils/validators';

/** 편집 가능한 승인 조건 값 */
export interface EditableApprovalCondition {
  approvedAmount: number;
  approvedRate: number;
  approvedTerm: number;
  repaymentMethod: RepaymentMethod;
}

interface ConditionComparisonCardProps {
  /** 대출 상품 기준 */
  product: LoanProductInfo;
  /** 신청자가 희망한 조건 */
  applicationInfo: ApplicationInfo;
  /** 시스템 추천 승인 조건 */
  recommendation: RecommendationData | undefined;
  /** 추천값 로딩 중 */
  isLoading: boolean;
  /** 현재 심사 상태 */
  reviewStatus: ReviewStatus;
  /** 편집 가능 여부 (심사 처리 가능한 상태일 때만 true) */
  editable?: boolean;
  /** 편집된 승인 조건 변경 콜백 (유효한 값일 때만 호출) */
  onConditionChange?: (condition: EditableApprovalCondition | null) => void;
  /** 카드 하단에 렌더링할 추가 콘텐츠 (의견 입력 + 버튼 등) */
  children?: React.ReactNode;
}

const SYSTEM_DECISION_CONFIG: Partial<Record<ReviewStatus, { label: string; className: string }>> = {
  SYSTEM_APPROVED: { label: '시스템 승인', className: 'bg-success/10 text-success' },
  SYSTEM_HOLD: { label: '시스템 보류', className: 'bg-warning/10 text-warning' },
  MANAGER_REVIEW: { label: '추가 심사 중', className: 'bg-info/10 text-info' },
  APPROVED: { label: '최종 승인', className: 'bg-success/10 text-success' },
  REJECTED: { label: '최종 거절', className: 'bg-error/10 text-error' },
};

const REPAYMENT_METHOD_OPTIONS: { value: RepaymentMethod; label: string }[] = [
  { value: 'EQUAL_PAYMENT', label: '원리금균등상환' },
  { value: 'EQUAL_PRINCIPAL', label: '원금균등상환' },
  { value: 'BULLET', label: '만기일시상환' },
];

/**
 * 상품 기준 | 신청 조건 | 승인 결과 3열 비교 카드.
 * editable=true일 때 승인 결과 열을 인라인 편집할 수 있다.
 */
export default function ConditionComparisonCard({
  product,
  applicationInfo,
  recommendation,
  isLoading,
  reviewStatus,
  editable = false,
  onConditionChange,
  children,
}: ConditionComparisonCardProps) {
  const decisionBadge = SYSTEM_DECISION_CONFIG[reviewStatus];

  const [isEditing, setIsEditing] = useState(false);
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState('');
  const [term, setTerm] = useState('');
  const [method, setMethod] = useState<RepaymentMethod>('EQUAL_PRINCIPAL');

  // 추천값 로드 시 초기값 세팅
  useEffect(() => {
    if (recommendation) {
      setAmount(String(recommendation.approvedAmount));
      setRate(String(recommendation.approvedRate));
      setTerm(String(recommendation.approvedTerm));
      setMethod(recommendation.repaymentMethod);
    }
  }, [recommendation]);

  // 편집 값 유효성 검증 및 부모 콜백
  const isAmountValid = amount !== '' && validateApprovalAmount(Number(amount));
  const isRateValid = rate !== '' && validateInterestRate(Number(rate));
  const isTermValid = term !== '' && validateLoanTerm(Number(term));
  const isAllValid = isAmountValid && isRateValid && isTermValid;

  useEffect(() => {
    if (!onConditionChange) return;

    if (isAllValid) {
      onConditionChange({
        approvedAmount: Number(amount),
        approvedRate: Number(rate),
        approvedTerm: Number(term),
        repaymentMethod: method,
      });
    } else {
      onConditionChange(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, rate, term, method, isAllValid]);

  const handleReset = () => {
    if (recommendation) {
      setAmount(String(recommendation.approvedAmount));
      setRate(String(recommendation.approvedRate));
      setTerm(String(recommendation.approvedTerm));
      setMethod(recommendation.repaymentMethod);
    }
    setIsEditing(false);
  };

  const displayAmount = isEditing ? amount : (recommendation ? String(recommendation.approvedAmount) : '');
  const displayRate = isEditing ? rate : (recommendation ? String(recommendation.approvedRate) : '');
  const displayTerm = isEditing ? term : (recommendation ? String(recommendation.approvedTerm) : '');
  const displayMethod = isEditing ? method : (recommendation?.repaymentMethod ?? 'EQUAL_PRINCIPAL');

  const rows = [
    {
      label: '대출 금액',
      productValue: `${formatCurrency(product.minAmount)} ~ ${formatCurrency(product.maxAmount)}`,
      appliedValue: formatCurrency(applicationInfo.requestedAmount),
      approvedValue: displayAmount ? formatCurrency(Number(displayAmount)) : '-',
      editField: (
        <div>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="만원"
            className={`w-full rounded border px-2 py-1 text-xs text-center outline-none ${
              amount && !isAmountValid ? 'border-error' : 'border-border-default focus:border-primary'
            }`}
          />
          {amount && !isAmountValid && (
            <p className="mt-0.5 text-[10px] text-error">10~100,000</p>
          )}
        </div>
      ),
    },
    {
      label: '금리',
      productValue: `${product.minInterestRate}% ~ ${product.maxInterestRate}%`,
      appliedValue: '-',
      approvedValue: displayRate ? `${displayRate}%` : '-',
      editField: (
        <div>
          <input
            type="number"
            step="0.01"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            placeholder="%"
            className={`w-full rounded border px-2 py-1 text-xs text-center outline-none ${
              rate && !isRateValid ? 'border-error' : 'border-border-default focus:border-primary'
            }`}
          />
          {rate && !isRateValid && (
            <p className="mt-0.5 text-[10px] text-error">0.01~20.00</p>
          )}
        </div>
      ),
    },
    {
      label: '대출 기간',
      productValue: `${formatMonths(product.minTermMonths)} ~ ${formatMonths(product.maxTermMonths)}`,
      appliedValue: formatMonths(applicationInfo.requestedTerm),
      approvedValue: displayTerm ? formatMonths(Number(displayTerm)) : '-',
      editField: (
        <div>
          <input
            type="number"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="개월"
            className={`w-full rounded border px-2 py-1 text-xs text-center outline-none ${
              term && !isTermValid ? 'border-error' : 'border-border-default focus:border-primary'
            }`}
          />
          {term && !isTermValid && (
            <p className="mt-0.5 text-[10px] text-error">1~360</p>
          )}
        </div>
      ),
    },
    {
      label: '상환 방식',
      productValue: product.availableRepaymentMethods.map((m) => REPAYMENT_METHOD_LABELS[m]).join(', '),
      appliedValue: REPAYMENT_METHOD_LABELS[applicationInfo.repaymentMethod],
      approvedValue: recommendation ? REPAYMENT_METHOD_LABELS[displayMethod] : '-',
      editField: (
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value as RepaymentMethod)}
          className="w-full rounded border border-border-default px-2 py-1 text-xs text-center outline-none focus:border-primary"
        >
          {REPAYMENT_METHOD_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ),
    },
    {
      label: '자금 용도',
      productValue: product.availablePurposes.map((p) => PURPOSE_LABELS[p]).join(', '),
      appliedValue: PURPOSE_LABELS[applicationInfo.purpose],
      approvedValue: recommendation ? PURPOSE_LABELS[applicationInfo.purpose] : '-',
      editField: null, // 자금 용도는 수정 불가
    },
  ];

  return (
    <div className="rounded-lg border border-border-default bg-bg-surface p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary">{product.productName}</h3>
        <div className="flex items-center gap-2">
          {editable && !isEditing && recommendation && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="rounded-md border border-primary px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/5"
            >
              조건 수정
            </button>
          )}
          {editable && isEditing && (
            <button
              type="button"
              onClick={handleReset}
              className="rounded-md border border-border-default px-3 py-1 text-xs font-medium text-text-secondary transition-colors hover:bg-gray-50"
            >
              되돌리기
            </button>
          )}
          {decisionBadge && (
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${decisionBadge.className}`}>
              {decisionBadge.label}
            </span>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 py-4 text-sm text-text-secondary">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          승인 조건을 불러오는 중...
        </div>
      ) : (
        <div className="overflow-hidden rounded-md border border-border-default">
          <table className="w-full table-fixed text-xs">
            <thead>
              <tr className="border-b border-border-default bg-gray-50">
                <th className="w-[15%] px-3 py-2.5 text-center font-medium text-text-secondary">항목</th>
                <th className="px-3 py-2.5 text-center font-medium text-text-secondary">상품 기준</th>
                <th className="px-3 py-2.5 text-center font-medium text-text-secondary">고객 신청 정보</th>
                <th className="px-3 py-2.5 text-center font-semibold text-primary bg-primary/5">
                  {isEditing ? '승인 조건 (수정 중)' : '승인 결과'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {rows.map((row) => (
                <tr key={row.label}>
                  <td className="px-3 py-2.5 text-center text-text-secondary">{row.label}</td>
                  <td className="px-3 py-2.5 text-center text-text-primary">{row.productValue}</td>
                  <td className="px-3 py-2.5 text-center text-text-primary">{row.appliedValue}</td>
                  <td className="px-3 py-2.5 text-center font-semibold text-primary bg-primary/5">
                    {isEditing && row.editField ? row.editField : row.approvedValue}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}
