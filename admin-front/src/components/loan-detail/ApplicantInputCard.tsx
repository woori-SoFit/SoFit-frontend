import type { ApplicantInput, IncomeType } from '@/types';
import { formatCurrency } from '@/utils/formatters';

interface ApplicantInputCardProps {
  data: ApplicantInput;
}

/** 소득 종류 ENUM → 한글 라벨 매핑 */
const INCOME_TYPE_LABELS: Record<IncomeType, string> = {
  SALARY: '근로소득',
  BUSINESS: '사업소득',
  OTHER: '기타소득',
};

/**
 * 신청자 입력 정보 카드 컴포넌트.
 * 연 소득, 신용점수, 소득 종류, 보유 대출액을 라벨-값 쌍으로 표시한다.
 * "사용자 직접 입력" 표시로 시스템 수집 정보와 구분한다.
 */
export default function ApplicantInputCard({ data }: ApplicantInputCardProps) {
  const items = [
    {
      label: '연 소득',
      value: data.annualIncome != null ? formatCurrency(data.annualIncome) : '-',
    },
    {
      label: '신용점수',
      value: data.creditScore != null ? `${data.creditScore}점` : '-',
    },
    {
      label: '소득 종류',
      value: data.incomeType ? (INCOME_TYPE_LABELS[data.incomeType] ?? '-') : '-',
    },
    {
      label: '보유 대출액',
      value: data.existingLoanAmount != null ? formatCurrency(data.existingLoanAmount) : '-',
    },
  ];

  return (
    <div className="rounded-lg border border-border-default bg-bg-surface p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary">신청자 입력 정보</h3>
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-text-secondary">
          사용자 직접 입력
        </span>
      </div>
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
