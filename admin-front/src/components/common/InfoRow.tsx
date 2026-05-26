interface InfoRowProps {
  /** 라벨 (좌측) */
  label: string;
  /** 값 (우측) */
  value: string;
  /** 값 텍스트 색상 클래스 (기본: "text-text-primary") */
  valueClassName?: string;
}

/**
 * 라벨-값 수평 행 컴포넌트.
 * 카드 내부에서 key-value 쌍을 표시할 때 사용한다.
 */
export default function InfoRow({ label, value, valueClassName = 'text-text-primary' }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-xs text-text-secondary">{label}</dt>
      <dd className={`text-sm font-medium ${valueClassName}`}>{value}</dd>
    </div>
  );
}
