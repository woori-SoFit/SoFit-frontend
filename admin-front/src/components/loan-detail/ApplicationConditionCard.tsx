import type { ApplicationCondition, RepaymentMethod, LoanPurpose } from '@/types';
import { formatCurrency, formatMonths, displayValue } from '@/utils/formatters';

interface ApplicationConditionCardProps {
  data: ApplicationCondition;
}

/** 상환 방식 ENUM → 한글 라벨 매핑 */
const REPAYMENT_METHOD_LABELS: Record<RepaymentMethod, string> = {
  EQUAL_PRINCIPAL_INTEREST: '원리금균등',
  EQUAL_PRINCIPAL: '원금균등',
  BULLET: '만기일시',
};

/** 자금 용도 ENUM → 한글 라벨 매핑 */
const PURPOSE_LABELS: Record<LoanPurpose, string> = {
  FACILITY: '시설 자금',
  WORKING_CAPITAL: '운전 자금',
};

/**
 * 신청 조건 카드 컴포넌트.
 * 희망 대출 금액, 대출 기간, 상환 방식, 자금 용도를 라벨-값 쌍으로 표시한다.
 */
export default function ApplicationConditionCard({ data }: ApplicationConditionCardProps) {
  const items = [
    {
      label: '희망 대출 금액',
      value: data.desiredAmount != null ? formatCurrency(data.desiredAmount) : '-',
    },
    {
      label: '대출 기간',
      value: data.loanTermMonths != null ? formatMonths(data.loanTermMonths) : '-',
    },
    {
      label: '상환 방식',
      value: data.repaymentMethod
        ? REPAYMENT_METHOD_LABELS[data.repaymentMethod] ?? displayValue(data.repaymentMethod)
        : '-',
    },
    {
      label: '자금 용도',
      value: data.purpose ? PURPOSE_LABELS[data.purpose] ?? displayValue(data.purpose) : '-',
    },
  ];

  return (
    <div className="rounded-lg border border-border-default bg-bg-surface p-5 shadow-card">
      <h3 className="mb-4 text-sm font-semibold text-text-primary">신청 조건</h3>
      <dl className="space-y-3">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <dt className="text-xs text-text-secondary">{item.label}</dt>
            <dd className="text-sm font-medium text-text-primary">{item.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
