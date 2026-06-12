import { useState, useEffect, useCallback } from 'react';
import type { LoanProductInfo, ApplicationInfo, RecommendationData, RepaymentMethod, ReviewDecision } from '@/types';
import { formatCurrency, formatMonths, formatDateTime } from '@/utils/formatters';
import { REPAYMENT_METHOD_LABELS, PURPOSE_LABELS } from '@/constants/loanLabels';
import {
  validateApprovalAmount,
  validateInterestRate,
  validateLoanTerm,
} from '@/utils/validators';
import Card from '@/components/common/Card';
import Spinner from '@/components/common/Spinner';

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
  /** 편집 가능 여부 (심사 처리 가능한 상태일 때만 true) */
  editable?: boolean;
  /** 편집된 승인 조건 변경 콜백 (유효한 값일 때만 호출) */
  onConditionChange?: (condition: EditableApprovalCondition | null) => void;
  /** 결재 이력 (은행원 → 지점장 순서) */
  decisions?: ReviewDecision[];
  /** 최종 거절 여부 */
  isRejected?: boolean;
  /** 카드 하단에 렌더링할 추가 콘텐츠 (의견 입력 + 버튼 등) */
  children?: React.ReactNode;
}

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
  editable = false,
  onConditionChange,
  decisions = [],
  isRejected = false,
  children,
}: ConditionComparisonCardProps) {
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
            <p className="mt-0.5 text-[10px] text-error">100만~10억</p>
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
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary">{product.productName}</h3>
        <div className="flex items-center gap-2">
          {editable && !isEditing && recommendation && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="rounded-md bg-gray-100 px-3 py-1 text-xs font-medium text-text-secondary transition-colors hover:bg-gray-200"
            >
              조건 수정
            </button>
          )}
          {editable && isEditing && (
            <button
              type="button"
              onClick={handleReset}
              className="rounded-md bg-gray-100 px-3 py-1 text-xs font-medium text-text-secondary transition-colors hover:bg-gray-200"
            >
              되돌리기
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 py-4 text-sm text-text-secondary">
          <Spinner size="sm" className="h-4 w-4" />
          승인 조건을 불러오는 중...
        </div>
      ) : (
        <div className="overflow-hidden rounded-md border border-border-default">
          <table className="w-full table-fixed text-xs">
            <thead>
              <tr className="border-b border-border-default bg-gray-50">
                <th className="w-[15%] px-3 py-2 text-center font-medium text-text-secondary">항목</th>
                <th className="px-3 py-2 text-center font-medium text-text-secondary">상품 기준</th>
                <th className="px-3 py-2 text-center font-medium text-text-secondary">고객 신청 정보</th>
                <th className={`px-3 py-2 text-center font-semibold ${
                  isRejected
                    ? 'text-text-disabled bg-gray-50'
                    : 'text-primary bg-primary/5'
                }`}>
                  {isRejected ? '대출 거절' : isEditing ? '승인 조건 (수정 중)' : '승인 결과'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {rows.map((row) => (
                <tr key={row.label}>
                  <td className="px-3 py-2 text-center text-text-secondary">{row.label}</td>
                  <td className="px-3 py-2 text-center text-text-primary">{row.productValue}</td>
                  <td className="px-3 py-2 text-center text-text-primary">{row.appliedValue}</td>
                  <td className={`px-3 py-2 text-center font-semibold ${
                    isRejected ? 'text-text-disabled bg-gray-50' : 'text-primary bg-primary/5'
                  }`}>
                    {isRejected ? '—' : isEditing && row.editField ? row.editField : row.approvedValue}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {children && <div className="mt-4">{children}</div>}

      {/* 심사 이력 스텝퍼 (하단 배치) */}
      {decisions.length > 0 && (
        <DecisionStepper decisions={decisions} />
      )}
    </Card>
  );
}

/** 스텝퍼에 표시할 단계 (완료 + 미완료) */
interface StepItem {
  type: 'completed' | 'pending';
  label: string;        // 상단 라벨 (자동 승인, 승인, 등)
  subLabel: string;     // 이름 또는 역할
  subRole?: string;     // 직급 (시스템은 없음)
  date?: string;        // 완료 일시
  comment?: string | null;
  accentColor: string;
  textColor: string;
  lineColor: string;
  icon: 'check' | 'x' | 'warn' | 'active' | 'none';
}

/** 미완료 단계를 decisions 기반으로 추론 */
function buildPendingSteps(decisions: ReviewDecision[]): StepItem[] {
  const lastDecision = decisions[decisions.length - 1];
  if (!lastDecision) return [];

  const pending: StepItem[] = [];

  // 현재 진행 중인 단계 (첫 번째 미완료)
  const activeStep: Omit<StepItem, 'label' | 'subLabel' | 'subRole'> = {
    type: 'pending',
    accentColor: 'border-primary bg-primary',
    textColor: 'text-primary',
    lineColor: 'bg-primary',
    icon: 'active',
  };

  // 아직 차례가 안 온 단계
  const waitingStep: Omit<StepItem, 'label' | 'subLabel' | 'subRole'> = {
    type: 'pending',
    accentColor: 'border-gray-300 bg-gray-200',
    textColor: 'text-text-disabled',
    lineColor: 'bg-gray-300',
    icon: 'none',
  };

  // 시스템만 완료된 상태
  if (decisions.length === 1) {
    if (lastDecision.status === 'SYSTEM_APPROVED') {
      pending.push({ ...activeStep, label: '심사 중', subLabel: '은행원' });
      pending.push({ ...waitingStep, label: '대기', subLabel: '지점장' });
    } else if (lastDecision.status === 'SYSTEM_REJECTED') {
      pending.push({ ...activeStep, label: '심사 중', subLabel: '은행원' });
    }
  }

  // 시스템 + 은행원 완료된 상태
  if (decisions.length === 2) {
    if (lastDecision.status === 'TELLER_APPROVED') {
      pending.push({ ...activeStep, label: '심사 중', subLabel: '지점장' });
    }
    // TELLER_REJECTED → 끝 (추가 단계 없음)
  }

  return pending;
}

/** 심사 이력 스텝퍼 하위 컴포넌트 */
function DecisionStepper({ decisions }: { decisions: ReviewDecision[] }) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(
    decisions.length > 0 ? decisions.length - 1 : null
  );

  // decisions가 갱신되면 최신 항목(현재 상태)으로 포커스
  useEffect(() => {
    if (decisions.length > 0) {
      setSelectedIdx(decisions.length - 1);
    }
  }, [decisions.length]);

  const handleStepClick = useCallback((idx: number) => {
    setSelectedIdx((prev) => (prev === idx ? null : idx));
  }, []);

  // 완료된 스텝 + 미완료 스텝 합치기
  const completedSteps: StepItem[] = decisions.map((decision) => {
    const isApproved = decision.status === 'SYSTEM_APPROVED'
      || decision.status === 'TELLER_APPROVED'
      || decision.status === 'MANAGER_APPROVED';
    const isRejected = decision.status === 'TELLER_REJECTED'
      || decision.status === 'MANAGER_REJECTED';
    const isSystem = decision.reviewerRole === 'SYSTEM';

    const roleLabel =
      decision.reviewerRole === 'ADMIN_BANK_TELLER'
        ? '은행원'
        : decision.reviewerRole === 'ADMIN_BANK_MANAGER'
          ? '지점장'
          : undefined;

    const statusLabel =
      decision.status === 'SYSTEM_APPROVED'
        ? '자동 승인'
        : decision.status === 'SYSTEM_REJECTED'
          ? '자동 거절'
          : isApproved
            ? '승인'
            : '거절';

    return {
      type: 'completed' as const,
      label: statusLabel,
      subLabel: isSystem ? '시스템' : decision.reviewerName,
      subRole: roleLabel,
      date: decision.decidedAt,
      comment: decision.comment,
      accentColor: isApproved
        ? 'border-success bg-success'
        : isRejected
          ? 'border-error bg-error'
          : 'border-warning bg-warning',
      textColor: isApproved
        ? 'text-success'
        : isRejected
          ? 'text-error'
          : 'text-warning',
      lineColor: isApproved
        ? 'bg-success'
        : isRejected
          ? 'bg-error'
          : 'bg-warning',
      icon: isApproved ? 'check' as const : isRejected ? 'x' as const : 'warn' as const,
    };
  });

  const pendingSteps = buildPendingSteps(decisions);
  const allSteps = [...completedSteps, ...pendingSteps];

  const selectedDecision = selectedIdx !== null && selectedIdx < decisions.length
    ? decisions[selectedIdx]
    : null;

  return (
    <div className="mt-4 border-t border-border-default pt-4">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-text-primary">심사 이력</h4>
      </div>

      {/* 스텝퍼 컨테이너 (컴팩트) */}
      <div className="flex items-center gap-3">
        {allSteps.map((step, idx) => {
          const isLast = idx === allSteps.length - 1;
          const isSelected = selectedIdx === idx;
          const isCompleted = step.type === 'completed';

          return (
            <div key={idx} className="flex items-center">
              {/* 스텝 노드 */}
              <button
                type="button"
                onClick={() => isCompleted && handleStepClick(idx)}
                disabled={!isCompleted}
                className={`group flex items-center gap-2 rounded-full pl-2 pr-3 py-1 transition-colors ${
                  isSelected && isCompleted
                    ? 'bg-gray-100 ring-1 ring-gray-200'
                    : isCompleted
                      ? 'hover:bg-gray-50'
                      : 'cursor-default'
                }`}
              >
                {/* 아이콘 (작은 원) */}
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${step.accentColor}`}
                >
                  {step.icon === 'check' && (
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {step.icon === 'x' && (
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  {step.icon === 'warn' && (
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01" />
                    </svg>
                  )}
                  {step.icon === 'none' && (
                    <span className="h-2 w-2 rounded-full bg-gray-400" />
                  )}
                  {step.icon === 'active' && (
                    <span className="relative flex h-3 w-3">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-white" />
                    </span>
                  )}
                </div>
                {/* 인라인 텍스트 */}
                <div className="flex flex-col">
                  <span className={`text-xs font-semibold leading-tight ${step.textColor}`}>
                    {step.label}
                  </span>
                  <span className="text-[11px] leading-tight text-text-disabled">
                    {step.subLabel}{step.subRole ? ` · ${step.subRole}` : ''}
                  </span>
                </div>
              </button>

              {/* 화살표 커넥터 */}
              {!isLast && (
                <svg className="mx-1 h-3 w-3 text-text-disabled/40" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          );
        })}
      </div>

      {/* 선택된 스텝의 의견 (최소 높이) */}
      {selectedDecision && (
        <div className="mt-2 rounded-md bg-gray-50 px-3 py-2">
          {selectedDecision.comment ? (
            <p className="text-sm leading-relaxed text-text-secondary">
              <span className="font-medium text-text-primary">{selectedDecision.reviewerName}</span>
              {' · '}
              <span className="text-text-disabled">{formatDateTime(selectedDecision.decidedAt)}</span>
              <br />
              {selectedDecision.comment}
            </p>
          ) : (
            <p className="text-sm text-text-disabled">작성된 의견이 없습니다.</p>
          )}
        </div>
      )}
    </div>
  );
}
