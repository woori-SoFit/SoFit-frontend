import type { SystemCollectedData, VatFilingStatus, InsurancePaymentStatus } from '@/types';
import { formatCurrency, formatBusinessAge, formatPercentage } from '@/utils/formatters';

interface SystemCollectedCardProps {
  data: SystemCollectedData | null;
}

/** 부가세 신고 상태 라벨 및 색상 */
const VAT_STATUS_CONFIG: Record<VatFilingStatus, { label: string; className: string }> = {
  FILED: { label: '신고 완료', className: 'bg-green-100 text-green-700' },
  PENDING: { label: '대기', className: 'bg-yellow-100 text-yellow-700' },
  OVERDUE: { label: '연체', className: 'bg-red-100 text-red-700' },
};

/** 보험료 납부 상태 라벨 및 색상 */
const INSURANCE_STATUS_CONFIG: Record<InsurancePaymentStatus, { label: string; className: string }> = {
  PAID: { label: '납부 완료', className: 'bg-green-100 text-green-700' },
  PENDING: { label: '대기', className: 'bg-yellow-100 text-yellow-700' },
  OVERDUE: { label: '연체', className: 'bg-red-100 text-red-700' },
};

/**
 * 숫자 값을 안전하게 통화 포맷팅한다. null/undefined면 "-" 반환.
 */
function safeFormatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) return '-';
  return formatCurrency(value);
}

/**
 * 상태 뱃지를 렌더링한다.
 */
function StatusBadge({ label, className }: { label: string; className: string }) {
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}

/**
 * 시스템 수집 정보(마이비즈데이터) 카드 컴포넌트.
 * 전체 너비 카드로 재무 현황, 운영 신뢰도, 시장 포지션 3섹션을 가로 배치한다.
 *
 * - 마이데이터 미연동(data === null) 시 안내 메시지 표시
 * - 개별 필드 null 시 "-" 표시
 * - 증감률: 양수=파란색, 음수=빨간색
 * - 상태 뱃지: FILED/PAID=초록, PENDING=노란, OVERDUE=빨간
 * - 반응형: 768px 미만 시 섹션 세로 배치
 */
export default function SystemCollectedCard({ data }: SystemCollectedCardProps) {
  // 마이데이터 미연동 시 안내 메시지 표시
  if (data === null) {
    return (
      <div className="rounded-lg border border-border-default bg-bg-surface p-5 shadow-card">
        <div className="mb-4 flex items-center gap-2">
          <h3 className="text-sm font-semibold text-text-primary">시스템 수집 정보</h3>
        </div>
        <p className="py-8 text-center text-sm text-text-disabled">
          마이데이터 미연동
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border-default bg-bg-surface p-5 shadow-card">
      {/* 헤더: 제목 + 마이데이터 연동 배지 */}
      <div className="mb-5 flex items-center gap-2">
        <h3 className="text-sm font-semibold text-text-primary">시스템 수집 정보</h3>
        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
          마이데이터 연동
        </span>
      </div>

      {/* 2열 배치: 재무 현황 | 운영 신뢰도 + 시장 포지션 */}
      <div className="grid grid-cols-2 gap-6 divide-x divide-border-default">
        {/* 왼쪽: 재무 현황 */}
        <div className="pr-6">
          <h4 className="mb-3 text-xs font-semibold text-text-secondary">재무 현황</h4>
          <dl className="space-y-2">
            <InfoRow label="연 소득" value={safeFormatCurrency(data.annual_income)} />
            <InfoRow
              label="보유 대출 건수"
              value={data.existing_loan_count != null ? `${data.existing_loan_count}건` : '-'}
            />
            <InfoRow label="월 매출액" value={safeFormatCurrency(data.monthly_revenue)} />
            <InfoRow
              label="전월 대비 증감률"
              value={
                data.monthly_revenue_growth_rate != null
                  ? formatPercentage(data.monthly_revenue_growth_rate)
                  : '-'
              }
              valueClassName={
                data.monthly_revenue_growth_rate != null
                  ? data.monthly_revenue_growth_rate >= 0
                    ? 'text-blue-600'
                    : 'text-red-600'
                  : 'text-text-primary'
              }
            />
            <InfoRow label="현금흐름" value={safeFormatCurrency(data.cash_flow)} />
            <InfoRow label="계좌 잔액" value={safeFormatCurrency(data.account_balance)} />
          </dl>
        </div>

        {/* 오른쪽: 운영 신뢰도 + 시장 포지션 */}
        <div className="pl-6 space-y-5">
          {/* 운영 신뢰도 */}
          <div>
            <h4 className="mb-3 text-xs font-semibold text-text-secondary">운영 신뢰도</h4>
            <dl className="space-y-2">
              <InfoRow
                label="업력"
                value={
                  data.business_age_months != null
                    ? formatBusinessAge(data.business_age_months)
                    : '-'
                }
              />
              <div className="flex items-center justify-between">
                <dt className="text-xs text-text-secondary">부가세 신고</dt>
                <dd>
                  {data.vat_filing_status != null ? (
                    <StatusBadge {...VAT_STATUS_CONFIG[data.vat_filing_status]} />
                  ) : (
                    <span className="text-sm font-medium text-text-primary">-</span>
                  )}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-xs text-text-secondary">세금 체납</dt>
                <dd>
                  {data.tax_overdue != null ? (
                    data.tax_overdue ? (
                      <StatusBadge label="체납" className="bg-red-100 text-red-700" />
                    ) : (
                      <span className="text-sm font-medium text-text-primary">없음</span>
                    )
                  ) : (
                    <span className="text-sm font-medium text-text-primary">-</span>
                  )}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-xs text-text-secondary">4대보험 납부</dt>
                <dd>
                  {data.insurance_payment_status != null ? (
                    <StatusBadge {...INSURANCE_STATUS_CONFIG[data.insurance_payment_status]} />
                  ) : (
                    <span className="text-sm font-medium text-text-primary">-</span>
                  )}
                </dd>
              </div>
            </dl>
          </div>

          <div className="border-t border-border-default" />

          {/* 시장 포지션 */}
          <div>
            <h4 className="mb-3 text-xs font-semibold text-text-secondary">시장 포지션</h4>
            <dl className="space-y-2">
              <InfoRow
                label="업종 내 매출 순위"
                value={
                  data.industry_sales_rank != null
                    ? `상위 ${data.industry_sales_rank.toFixed(1)}%`
                    : '-'
                }
              />
              <InfoRow
                label="업종 내 수익성 순위"
                value={
                  data.industry_profit_rank != null
                    ? `상위 ${data.industry_profit_rank.toFixed(1)}%`
                    : '-'
                }
              />
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

/** 라벨-값 행 컴포넌트 */
function InfoRow({
  label,
  value,
  valueClassName = 'text-text-primary',
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-xs text-text-secondary">{label}</dt>
      <dd className={`text-sm font-medium ${valueClassName}`}>{value}</dd>
    </div>
  );
}
