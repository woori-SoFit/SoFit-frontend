import type { CustomerInfo } from '@/types';
import { maskResidentNumber, formatPhoneNumber, displayValue } from '@/utils/formatters';

interface CustomerInfoCardProps {
  data: CustomerInfo;
}

/**
 * 가입일시를 "YYYY.MM.DD HH:mm" 형식으로 변환한다.
 */
function formatDateTime(isoDateTime: string): string {
  const date = new Date(isoDateTime);
  if (isNaN(date.getTime())) return isoDateTime;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}.${month}.${day} ${hours}:${minutes}`;
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
      value: data.registeredAt ? formatDateTime(data.registeredAt) : '-',
    },
    { label: '아이디', value: displayValue(data.loginId) },
  ];

  return (
    <div className="rounded-lg border border-border-default bg-bg-surface p-5 shadow-card">
      <h3 className="mb-4 text-sm font-semibold text-text-primary">고객 기본 정보</h3>
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
