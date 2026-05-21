import type { LoanProductInfo, ApplicationCondition, RecommendationData, RepaymentMethod, LoanPurpose } from '@/types';
import { formatCurrency, formatMonths } from '@/utils/formatters';

interface ConditionComparisonCardProps {
  /** 대출 상품 기준 */
  product: LoanProductInfo;
  /** 신청자가 희망한 조건 */
  applicationCondition: ApplicationCondition;
  /** 시스템 추천 승인 조건 */
  recommendation: RecommendationData | undefined;
  /** 추천값 로딩 중 */
  isLoading: boolean;
}

/** 상환 방식 ENUM → 한글 라벨 매핑 */
const REPAYMENT_METHOD_LABELS: Record<RepaymentMethod, string> = {
  EQUAL_PRINCIPAL_INTEREST: '원리금균등상환',
  EQUAL_PRINCIPAL: '원금균등상환',
  BULLET: '만기일시상환',
};

/** 자금 용도 ENUM → 한글 라벨 매핑 */
const PURPOSE_LABELS: Record<LoanPurpose, string> = {
  FACILITY: '시설 자금',
  WORKING_CAPITAL: '운전 자금',
};

/**
 * 상품 기준 | 신청 조건 | 승인 결과 3열 비교 카드.
 * 승인 결과 열은 진하게 강조 표시한다.
 */
export default function ConditionComparisonCard({
  product,
  applicationCondition,
  recommendation,
  isLoading,
}: ConditionComparisonCardProps) {
  const rows = [
    {
      label: '대출 금액',
      productValue: `${formatCurrency(product.minAmount)} ~ ${formatCurrency(product.maxAmount)}`,
      appliedValue: formatCurrency(applicationCondition.desiredAmount),
      approvedValue: recommendation ? formatCurrency(recommendation.approvedAmount) : '-',
    },
    {
      label: '금리',
      productValue: `${product.minInterestRate}% ~ ${product.maxInterestRate}%`,
      appliedValue: '-',
      approvedValue: recommendation ? `${recommendation.interestRate}%` : '-',
    },
    {
      label: '대출 기간',
      productValue: `${formatMonths(product.minTermMonths)} ~ ${formatMonths(product.maxTermMonths)}`,
      appliedValue: formatMonths(applicationCondition.loanTermMonths),
      approvedValue: recommendation ? formatMonths(recommendation.loanTermMonths) : '-',
    },
    {
      label: '상환 방식',
      productValue: product.availableRepaymentMethods.map((m) => REPAYMENT_METHOD_LABELS[m]).join(', '),
      appliedValue: REPAYMENT_METHOD_LABELS[applicationCondition.repaymentMethod],
      approvedValue: recommendation ? REPAYMENT_METHOD_LABELS[recommendation.repaymentMethod] : '-',
    },
    {
      label: '자금 용도',
      productValue: product.availablePurposes.map((p) => PURPOSE_LABELS[p]).join(', '),
      appliedValue: PURPOSE_LABELS[applicationCondition.purpose],
      approvedValue: recommendation ? PURPOSE_LABELS[applicationCondition.purpose] : '-',
    },
  ];

  return (
    <div className="rounded-lg border border-border-default bg-bg-surface p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary">{product.productName}</h3>
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
