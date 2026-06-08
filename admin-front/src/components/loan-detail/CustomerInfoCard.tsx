import type { CustomerInfo } from '@/types';
import { maskResidentNumber, formatPhoneNumber, displayValue, formatDateTime } from '@/utils/formatters';
import { User } from 'lucide-react';
import Card from '@/components/common/Card';
import InfoRow from '@/components/common/InfoRow';

interface CustomerInfoCardProps {
  data: CustomerInfo;
}

/**
 * 고객 기본 정보 카드 컴포넌트.
 * 이름, 주민번호(마스킹), 연락처, 가입일시, 아이디를 라벨-값 쌍으로 표시한다.
 * null/빈 값은 "-"으로 표시한다.
 */
export default function CustomerInfoCard({ data }: CustomerInfoCardProps) {
  const items = [
    { label: '이름', value: displayValue(data.name) },
    {
      label: '주민번호',
      value: data.residentNumber ? maskResidentNumber(data.residentNumber) : '-',
    },
    {
      label: '연락처',
      value: data.phoneNumber ? formatPhoneNumber(data.phoneNumber) : '-',
    },
    {
      label: '가입일시',
      value: data.joinedAt ? formatDateTime(data.joinedAt) : '-',
    },
    { label: '아이디', value: displayValue(data.loginId) },
  ];

  return (
    <Card title="고객 기본 정보" titleIcon={<User size={16} className="text-text-primary" />}>
      <dl className="space-y-3">
        {items.map((item) => (
          <InfoRow key={item.label} label={item.label} value={item.value} />
        ))}
      </dl>
    </Card>
  );
}
