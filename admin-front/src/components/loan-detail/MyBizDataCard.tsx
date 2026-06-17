import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import type { MyBizData } from '@/types';
import { formatCurrency, formatBusinessAge } from '@/utils/formatters';
import Card from '@/components/common/Card';

interface MyBizDataCardProps {
  data: MyBizData | null;
  businessName?: string;
}

/** DSR 게이지 차트 (반원형) */
function DsrGauge({ dsrRate, dsrLimit }: { dsrRate: number; dsrLimit: number }) {
  const radius = 70;
  const strokeWidth = 14;
  const cx = 100;
  const cy = 90;
  // 반원: 180도 → π
  const circumference = Math.PI * radius;
  // DSR 비율을 0~dsrLimit 범위 기준으로 게이지에 매핑 (최대 100%)
  const ratio = Math.min(dsrRate / dsrLimit, 1);
  const offset = circumference * (1 - ratio);

  return (
    <div className="flex flex-col items-center">
      <svg width="200" height="110" viewBox="0 0 200 110">
        {/* 배경 호 */}
        <path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* 채워진 호 */}
        <path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          fill="none"
          stroke={dsrRate > dsrLimit ? '#ef4444' : '#22c55e'}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={offset}
        />
        {/* 중앙 텍스트 */}
        <text x={cx} y={cy - 16} textAnchor="middle" className="text-2xl font-bold" fill="#0f172a" fontSize="22">
          {dsrRate.toFixed(1)}%
        </text>
        <text x={cx} y={cy + 2} textAnchor="middle" fill="#64748b" fontSize="11">
          DSR 추정
        </text>
        {/* 0% / 한도% 라벨 */}
        <text x={cx - radius} y={cy + 20} textAnchor="middle" fill="#94a3b8" fontSize="10">
          0%
        </text>
        <text x={cx + radius} y={cy + 20} textAnchor="middle" fill="#94a3b8" fontSize="10">
          {dsrLimit}%
        </text>
      </svg>
    </div>
  );
}

/** 신뢰도 아이템 (아이콘 + 라벨 + 값 + 뱃지) */
function TrustItem({
  icon,
  iconBg,
  label,
  value,
  badge,
  sub,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
  badge?: { text: string; color: string };
  sub?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 text-center">
      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${iconBg}`}>
        {icon}
      </div>
      <p className="text-xs text-text-secondary">{label}</p>
      <p className="text-sm font-bold text-text-primary">{value}</p>
      {badge && (
        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${badge.color}`}>
          {badge.text}
        </span>
      )}
      {sub && <p className="text-[10px] text-text-disabled">{sub}</p>}
    </div>
  );
}

/**
 * 차이값 표시 뱃지. 양수면 파란색, 음수면 빨간색.
 */
function DiffBadge({ myVal, avgVal, unit, isCurrency }: { myVal: number; avgVal: number; unit: string; isCurrency?: boolean }) {
  const diff = myVal - avgVal;
  if (diff === 0) return null;
  const sign = diff > 0 ? '+' : '';
  const display = isCurrency
    ? `${sign}${formatCurrency(Math.abs(diff))}`
    : `${sign}${diff.toFixed(1)}${unit}`;
  const color = diff > 0 ? 'text-blue-600' : 'text-red-600';
  return <span className={`ml-1 text-[10px] font-medium ${color}`}>({display})</span>;
}

/** 매출 추이 차트 포맷터 */
function formatYAxis(value: number): string {
  const man = Math.round(value / 10000);
  return `${man.toLocaleString()}`;
}

function formatMonth(month: string): string {
  // "2025-01" → "2025.01"
  return month.replace('-', '.');
}

export default function MyBizDataCard({ data, businessName }: MyBizDataCardProps) {
  const shopName = businessName || '이 가게';
  if (data === null) {
    return (
      <Card title="MY BIZ DATA">
        <p className="py-8 text-center text-sm text-text-disabled">
          마이데이터 미연동
        </p>
      </Card>
    );
  }

  const chartData = data.revenueTrend.map((item, idx) => ({
    month: formatMonth(item.referenceMonth),
    myRevenue: item.monthlyRevenue,
    myProfit: data.profitTrend?.[idx]?.profit ?? 0,
    industryAvg: data.industryAvgRevenueTrend?.[idx]?.monthlyRevenue ?? 0,
  }));

  const DSR_LIMIT = 40;
  const dsrRate = data.annualIncome > 0
    ? (data.annualRepayment / data.annualIncome) * 100
    : 0;

  return (
    <div className="space-y-6">
      {/* 상단 2열: 부채 상환/DSR + 세무/운영 신뢰도 */}
      <div className="grid grid-cols-2 gap-6">
        {/* 부채 상환 / DSR 상세 */}
        <Card title="부채 상환 / DSR 상세">
          <div className="flex items-center gap-4">
            {/* 좌측: 수치 목록 (컴팩트) */}
            <dl className="space-y-1.5 shrink-0">
              <div className="flex items-center gap-3">
                <dt className="text-xs text-text-secondary w-28">연간 원리금 상환액</dt>
                <dd className="text-sm font-medium text-text-primary">{formatCurrency(data.annualRepayment)}</dd>
              </div>
              <div className="flex items-center gap-3">
                <dt className="text-xs text-text-secondary w-28">월 상환 부담액</dt>
                <dd className="text-sm font-medium text-text-primary">{formatCurrency(data.monthlyRepayment)}</dd>
              </div>
              <div className="flex items-center gap-3">
                <dt className="text-xs text-text-secondary w-28">DSR 추정</dt>
                <dd className="text-sm font-bold text-primary">{dsrRate.toFixed(1)}%</dd>
              </div>
              <div className="flex items-center gap-3">
                <dt className="text-xs text-text-secondary w-28">보유 대출</dt>
                <dd className="text-sm font-medium text-text-primary">{data.existingLoanCount}건</dd>
              </div>
              <div className="flex items-center gap-3">
                <dt className="text-xs text-text-secondary w-28">총 대출 잔액</dt>
                <dd className="text-sm font-medium text-text-primary">{formatCurrency(data.totalLoanBalance)}</dd>
              </div>
            </dl>
            {/* 우측: 법정 한도 라벨 + 게이지 (오른쪽 정렬, 라벨은 차트 가운데) */}
            <div className="flex flex-1 flex-col items-end">
              <div className="flex flex-col items-center">
                <p className="text-xs text-text-secondary">
                  법정한도 <span className="font-medium text-text-primary">{DSR_LIMIT}%</span>
                </p>
                <DsrGauge dsrRate={dsrRate} dsrLimit={DSR_LIMIT} />
              </div>
            </div>
          </div>
        </Card>

        {/* 세무 / 운영 신뢰도 */}
        <Card title="세무 / 운영 신뢰도">
          <div className="grid grid-cols-4 gap-4">
            <TrustItem
              icon={
                <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              }
              iconBg="bg-blue-50"
              label="업력"
              value={formatBusinessAge(data.businessAgeMonths)}
              sub={`(${data.businessAgeMonths}개월)`}
            />
            <TrustItem
              icon={
                <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              iconBg="bg-blue-50"
              label="세금 체납 여부"
              value={data.taxOverdue ? '있음' : '없음'}
              badge={{ text: data.taxOverdue ? '주의' : '양호', color: data.taxOverdue ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700' }}
            />
            <TrustItem
              icon={
                <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
              iconBg="bg-blue-50"
              label="4대보험 납부 상태"
              value={data.insurancePaymentStatus === 'PAID' ? '납부 완료' : data.insurancePaymentStatus === 'PENDING' ? '대기' : '연체'}
              badge={{
                text: data.insurancePaymentStatus === 'PAID' ? '양호' : data.insurancePaymentStatus === 'PENDING' ? '주의' : '위험',
                color: data.insurancePaymentStatus === 'PAID' ? 'bg-green-100 text-green-700' : data.insurancePaymentStatus === 'OVERDUE' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700',
              }}
            />
            <TrustItem
              icon={
                <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              }
              iconBg="bg-blue-50"
              label="부가세 신고"
              value={data.vatFilingStatus === 'FILED' ? '신고 완료' : data.vatFilingStatus === 'PENDING' ? '대기' : '연체'}
              badge={{
                text: data.vatFilingStatus === 'FILED' ? '양호' : data.vatFilingStatus === 'PENDING' ? '주의' : '위험',
                color: data.vatFilingStatus === 'FILED' ? 'bg-green-100 text-green-700' : data.vatFilingStatus === 'OVERDUE' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700',
              }}
              sub={data.vatFilingDate ? `최근 신고일 ${data.vatFilingDate.slice(0, 10).replace(/-/g, '.')}` : undefined}
            />
          </div>
        </Card>
      </div>

      {/* 하단 2열: 매출/수익 추이 차트 + 업종/상권 비교 테이블 */}
      <div className="grid grid-cols-2 gap-6">
        {/* 매출 / 수익 추이 */}
        <Card
          title="매출 / 수익 추이"
          titleRight={
            <>
              <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-text-secondary">
                6개월
              </span>
              <div className="ml-auto flex items-center gap-4">
                <span className="flex items-center gap-1 text-xs text-text-secondary">
                  <span className="inline-block h-0.5 w-4 bg-primary" /> {shopName} 월 매출
                </span>
                <span className="flex items-center gap-1 text-xs text-text-secondary">
                  <span className="inline-block h-0.5 w-4 bg-green-500" /> {shopName} 수익
                </span>
                <span className="flex items-center gap-1 text-xs text-text-secondary">
                  <span className="inline-block h-0.5 w-4 border-t border-dashed border-gray-400" /> 업종 평균 매출
                </span>
              </div>
            </>
          }
        >
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData} margin={{ top: 24, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="4 2" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={formatYAxis}
                tick={{ fontSize: 10, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip
                formatter={(value: number, name: string) => [
                  `${Math.round(value / 10000).toLocaleString()}만원`,
                  name === 'myRevenue' ? `${shopName} 매출` : name === 'myProfit' ? `${shopName} 수익` : '업종 평균',
                ]}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
              />
              <Line
                type="monotone"
                dataKey="myRevenue"
                stroke="#0067ac"
                strokeWidth={2.5}
                dot={{ r: 3.5, fill: '#ffffff', stroke: '#0067ac', strokeWidth: 2 }}
                activeDot={{ r: 5, fill: '#0067ac' }}
              />
              <Line
                type="monotone"
                dataKey="myProfit"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ r: 3, fill: '#ffffff', stroke: '#22c55e', strokeWidth: 2 }}
                activeDot={{ r: 4.5, fill: '#22c55e' }}
              />
              <Line
                type="monotone"
                dataKey="industryAvg"
                stroke="#94a3b8"
                strokeWidth={1.5}
                strokeDasharray="5 3"
                dot={{ r: 2.5, fill: '#ffffff', stroke: '#94a3b8', strokeWidth: 1.5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* 업종 / 상권 비교 */}
        <Card title="업종 / 상권 비교">
          <div className="overflow-hidden rounded-lg border border-border-default">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary">항목</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-text-secondary">{shopName}</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-text-secondary">업종 평균</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-text-secondary">상권 평균</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default">
                <tr>
                  <td className="px-4 py-3 text-xs text-text-secondary">월 매출</td>
                  <td className="px-4 py-3 text-right text-xs font-medium text-text-primary">{formatCurrency(data.industryComparison.myRevenue)}</td>
                  <td className="px-4 py-3 text-right text-xs text-text-secondary">
                    {formatCurrency(data.industryComparison.industryAvgRevenue)}
                    <DiffBadge myVal={data.industryComparison.myRevenue} avgVal={data.industryComparison.industryAvgRevenue} unit="원" isCurrency />
                  </td>
                  <td className="px-4 py-3 text-right text-xs text-text-secondary">
                    {formatCurrency(data.industryComparison.districtAvgRevenue)}
                    <DiffBadge myVal={data.industryComparison.myRevenue} avgVal={data.industryComparison.districtAvgRevenue} unit="원" isCurrency />
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-xs text-text-secondary">순이익률</td>
                  <td className="px-4 py-3 text-right text-xs font-medium text-text-primary">{data.industryComparison.myProfitRate.toFixed(1)}%</td>
                  <td className="px-4 py-3 text-right text-xs text-text-secondary">
                    {data.industryComparison.industryAvgProfitRate.toFixed(1)}%
                    <DiffBadge myVal={data.industryComparison.myProfitRate} avgVal={data.industryComparison.industryAvgProfitRate} unit="%p" />
                  </td>
                  <td className="px-4 py-3 text-right text-xs text-text-secondary">
                    {data.industryComparison.districtAvgProfitRate.toFixed(1)}%
                    <DiffBadge myVal={data.industryComparison.myProfitRate} avgVal={data.industryComparison.districtAvgProfitRate} unit="%p" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 순위 요약 */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-blue-50 px-3 py-2 text-center">
              <p className="text-[10px] text-text-secondary">매출 순위</p>
              <p className="text-xs font-bold text-primary">업종 상위 {data.industryComparison.industrySalesRank.toFixed(1)}%</p>
              <p className="text-[10px] text-text-disabled">상권 상위 {data.industryComparison.districtSalesRank.toFixed(1)}%</p>
            </div>
            <div className="rounded-lg bg-green-50 px-3 py-2 text-center">
              <p className="text-[10px] text-text-secondary">수익성 순위</p>
              <p className="text-xs font-bold text-green-700">업종 상위 {data.industryComparison.industryProfitRank.toFixed(1)}%</p>
              <p className="text-[10px] text-text-disabled">상권 상위 {data.industryComparison.districtProfitRank.toFixed(1)}%</p>
            </div>
            <div className="rounded-lg bg-orange-50 px-3 py-2 text-center">
              <p className="text-[10px] text-text-secondary">고객만족도 순위</p>
              <p className="text-xs font-bold text-orange-700">업종 상위 {data.industryComparison.industrySatisfactionRank.toFixed(1)}%</p>
              <p className="text-[10px] text-text-disabled">상권 상위 {data.industryComparison.districtSatisfactionRank.toFixed(1)}%</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
