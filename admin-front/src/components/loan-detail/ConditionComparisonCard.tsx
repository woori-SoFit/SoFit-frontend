import type { LoanProductInfo, ApplicationInfo, RecommendationData, ReviewStatus } from '@/types';
import { formatCurrency, formatMonths } from '@/utils/formatters';
import { REPAYMENT_METHOD_LABELS, PURPOSE_LABELS } from '@/constants/loanLabels';

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
}

const SYSTEM_DECISION_CONFIG: Partial<Record<ReviewStatus, { label: string; className: string }>> = {
  APPROVED: { label: '시스템 승인', className: 'bg-success/10 text-success' },
  REJECTED: { label: '시스템 거절', className: 'bg-error/10 text-error' },
  MANAGER_REVIEW: { label: '추가 심사 요청', className: 'bg-info/10 text-info' },
};

/**
 * 상품 기준 | 신청 조건 | 승인 결과 3열 비교 카드.
 * 승인 결과 열은 진하게 강조 표시한다.
 */
export default function ConditionComparisonCard({
  product,
  applicationInfo,
  recommendation,
  isLoading,
  reviewStatus,
}: ConditionComparisonCardProps) {
  const decisionBadge = SYSTEM_DECISION_CONFIG[reviewStatus];
  const rows = [
    {
      label: '대출 금액',
      productValue: `${formatCurrency(product.minAmount)} ~ ${formatCurrency(product.maxAmount)}`,
      appliedValue: formatCurrency(applicationInfo.requestedAmount),
      approvedValue: recommendation ? formatCurrency(recommendation.approvedAmount) : '-',
    },
    {
      label: '금리',
      productValue: `${product.minInterestRate}% ~ ${product.maxInterestRate}%`,
      appliedValue: '-',
      approvedValue: recommendation ? `${recommendation.approvedRate}%` : '-',
    },
    {
      label: '대출 기간',
      productValue: `${formatMonths(product.minTermMonths)} ~ ${formatMonths(product.maxTermMonths)}`,
      appliedValue: formatMonths(applicationInfo.requestedTerm),
      approvedValue: recommendation ? formatMonths(recommendation.approvedTerm) : '-',
    },
    {
      label: '상환 방식',
      productValue: product.availableRepaymentMethods.map((m) => REPAYMENT_METHOD_LABELS[m]).join(', '),
      appliedValue: REPAYMENT_METHOD_LABELS[applicationInfo.repaymentMethod],
      approvedValue: recommendation ? REPAYMENT_METHOD_LABELS[recommendation.repaymentMethod] : '-',
    },
    {
      label: '자금 용도',
      productValue: product.availablePurposes.map((p) => PURPOSE_LABELS[p]).join(', '),
      appliedValue: PURPOSE_LABELS[applicationInfo.purpose],
      approvedValue: recommendation ? PURPOSE_LABELS[applicationInfo.purpose] : '-',
    },
  ];

  return (
    <div className="rounded-lg border border-border-default bg-bg-surface p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary">{product.productName}</h3>
        {decisionBadge && (
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${decisionBadge.className}`}>
            {decisionBadge.label}
          </span>
        )}
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
                <th className="px-3 py-2.5 text-center font-semibold text-primary bg-primary/5">승인 결과</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {rows.map((row) => (
                <tr key={row.label}>
                  <td className="px-3 py-2.5 text-center text-text-secondary">{row.label}</td>
                  <td className="px-3 py-2.5 text-center text-text-primary">{row.productValue}</td>
                  <td className="px-3 py-2.5 text-center text-text-primary">{row.appliedValue}</td>
                  <td className="px-3 py-2.5 text-center font-semibold text-primary bg-primary/5">
                    {row.approvedValue}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
