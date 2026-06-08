import type { BusinessInfo } from '@/types';
import { formatBusinessNumber, displayValue, formatDate } from '@/utils/formatters';
import { Building2 } from 'lucide-react';
import Card from '@/components/common/Card';
import InfoRow from '@/components/common/InfoRow';

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
    { label: '업종', value: displayValue(data.businessCategory) },
    { label: '업태', value: displayValue(data.businessType) },
    { label: '사업장 주소', value: displayValue(data.businessAddress) },
    {
      label: '사업 개시일',
      value: data.openDate ? formatDate(data.openDate) : '-',
    },
  ];

  return (
    <Card title="사업자 정보" titleIcon={<Building2 size={16} className="text-text-primary" />}>
      <dl className="space-y-3">
        {items.map((item) => (
          <InfoRow key={item.label} label={item.label} value={item.value} />
        ))}
      </dl>
    </Card>
  );
}
