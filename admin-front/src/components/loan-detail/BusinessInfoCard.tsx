import type { BusinessInfo } from '@/types';
import { formatBusinessNumber, displayValue } from '@/utils/formatters';
import { formatDate } from '@/utils/formatDate';

interface BusinessInfoCardProps {
  data: BusinessInfo;
}

/**
 * 사업자 정보 카드 컴포넌트.
 * 사업자명, 사업자등록번호, 업종, 업태, 사업장 주소, 사업 개시일을 라벨-값 쌍으로 표시한다.
 */
export default function BusinessInfoCard({ data }: BusinessInfoCardProps) {
  const items = [
    { label: '사업자명', value: displayValue(data.businessName) },
    {
      label: '사업자등록번호',
      value: data.businessNumber ? formatBusinessNumber(data.businessNumber) : '-',
    },
    { label: '업종', value: displayValue(data.industry) },
    { label: '업태', value: displayValue(data.businessType) },
    { label: '사업장 주소', value: displayValue(data.address) },
    {
      label: '사업 개시일',
      value: data.startDate ? formatDate(data.startDate) : '-',
    },
  ];

  return (
    <div className="rounded-lg border border-border-default bg-bg-surface p-5 shadow-card">
      <h3 className="mb-4 text-sm font-semibold text-text-primary">사업자 정보</h3>
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
