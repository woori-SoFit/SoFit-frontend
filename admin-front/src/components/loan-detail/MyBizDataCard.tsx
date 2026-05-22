import type { MyBizData, VatFilingStatus, InsurancePaymentStatus } from '@/types';
import { formatCurrency, formatBusinessAge, formatPercentage } from '@/utils/formatters';
import Card from '@/components/common/Card';
import InfoRow from '@/components/common/InfoRow';

interface MyBizDataCardProps {
  data: MyBizData | null;
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
export default function MyBizDataCard({ data }: MyBizDataCardProps) {
  // 마이데이터 미연동 시 안내 메시지 표시
  if (data === null) {
    return (
      <Card title="시스템 수집 정보">
        <p className="py-8 text-center text-sm text-text-disabled">
          마이데이터 미연동
        </p>
      </Card>
    );
  }

  return (
    <Card
      title="시스템 수집 정보"
      titleRight={
        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
          마이데이터 연동
        </span>
      }
    >

      {/* 2열 배치: 재무 현황 | 운영 신뢰도 + 시장 포지션 */}
      <div className="grid grid-cols-2 gap-6 divide-x divide-border-default">
        {/* 왼쪽: 재무 현황 */}
        <div className="pr-6">
          <h4 className="mb-3 text-xs font-semibold text-text-secondary">재무 현황</h4>
          <dl className="space-y-2">
            <InfoRow label="연 소득" value={safeFormatCurrency(data.annualIncome)} />
            <InfoRow
              label="보유 대출 건수"
              value={data.existingLoanCount != null ? `${data.existingLoanCount}건` : '-'}
            />
            <InfoRow label="월 매출액" value={safeFormatCurrency(data.monthlyRevenue)} />
            <InfoRow
              label="전월 대비 증감률"
              value={
                data.monthlyRevenueGrowthRate != null
                  ? formatPercentage(data.monthlyRevenueGrowthRate)
                  : '-'
              }
              valueClassName={
                data.monthlyRevenueGrowthRate != null
                  ? data.monthlyRevenueGrowthRate >= 0
                    ? 'text-blue-600'
                    : 'text-red-600'
                  : 'text-text-primary'
              }
            />
            <InfoRow label="현금흐름" value={safeFormatCurrency(data.cashFlow)} />
            <InfoRow label="계좌 잔액" value={safeFormatCurrency(data.accountBalance)} />
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
                  data.businessAgeMonths != null
                    ? formatBusinessAge(data.businessAgeMonths)
                    : '-'
                }
              />
              <div className="flex items-center justify-between">
                <dt className="text-xs text-text-secondary">부가세 신고</dt>
                <dd>
                  {data.vatFilingStatus != null ? (
                    <StatusBadge {...VAT_STATUS_CONFIG[data.vatFilingStatus]} />
                  ) : (
                    <span className="text-sm font-medium text-text-primary">-</span>
                  )}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-xs text-text-secondary">세금 체납</dt>
                <dd>
                  {data.taxOverdue != null ? (
                    data.taxOverdue ? (
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
                  {data.insurancePaymentStatus != null ? (
                    <StatusBadge {...INSURANCE_STATUS_CONFIG[data.insurancePaymentStatus]} />
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
                  data.industrySalesRank != null
                    ? `상위 ${data.industrySalesRank.toFixed(1)}%`
                    : '-'
                }
              />
              <InfoRow
                label="업종 내 수익성 순위"
                value={
                  data.industryProfitRank != null
                    ? `상위 ${data.industryProfitRank.toFixed(1)}%`
                    : '-'
                }
              />
            </dl>
          </div>
        </div>
      </div>
    </Card>
  );
}
