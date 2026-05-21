import type { LoanProductInfo, RepaymentMethod, LoanPurpose } from '@/types';
import { formatCurrency, formatMonths } from '@/utils/formatters';

interface ProductInfoCardProps {
  product: LoanProductInfo;
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
 * 대출 상품 정보 카드.
 * 상품의 기준(한도, 금리, 기간, 상환 방식, 자금 용도)을 표시한다.
 */
export default function ProductInfoCard({ product }: ProductInfoCardProps) {
  const items = [
    {
      label: '대출 금액',
      value: `${formatCurrency(product.minAmount)} ~ ${formatCurrency(product.maxAmount)}`,
    },
    {
      label: '금리 범위',
      value: `${product.minInterestRate}% ~ ${product.maxInterestRate}%`,
    },
    {
      label: '대출 기간',
      value: `${formatMonths(product.minTermMonths)} ~ ${formatMonths(product.maxTermMonths)}`,
    },
    {
      label: '상환 방식',
      value: product.availableRepaymentMethods.map((m) => REPAYMENT_METHOD_LABELS[m]).join(', '),
    },
    {
      label: '자금 용도',
      value: product.availablePurposes.map((p) => PURPOSE_LABELS[p]).join(', '),
    },
  ];

  return (
    <div className="rounded-lg border border-border-default bg-bg-surface p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary">대출 상품 정보</h3>
        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
          {product.productName}
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
