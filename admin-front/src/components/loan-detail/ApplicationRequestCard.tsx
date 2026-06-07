import type { ApplicationInfo, UserInputInfo, ConsentHistory } from '@/types';
import { formatCurrency, formatMonths, displayValue } from '@/utils/formatters';
import { REPAYMENT_METHOD_LABELS, PURPOSE_LABELS } from '@/constants/loanLabels';
import { FileText } from 'lucide-react';
import Card from '@/components/common/Card';
import InfoRow from '@/components/common/InfoRow';

interface ApplicationRequestCardProps {
  applicationInfo: ApplicationInfo;
  userInputInfo: UserInputInfo;
  productName?: string;
  consentHistories: ConsentHistory[];
}

/** 연 소득 구간 코드 → 한글 라벨 */
const ANNUAL_INCOME_LABELS: Record<string, string> = {
  AMT_0_30M: '3천만원 미만',
  AMT_30_50M: '3천~5천만원',
  AMT_50_100M: '5천만~1억원',
  AMT_100M_OVER: '1억 이상'
};

/** 신용점수 구간 코드 → 한글 라벨 */
const CREDIT_SCORE_LABELS: Record<string, string> = {
  CS_0_850: '850점 미만',
  CS_850_OVER: '850점 이상',
  CS_UNKNOWN: '모름'
};

/** 소득 종류 코드 → 한글 라벨 */
const INCOME_TYPE_LABELS: Record<string, string> = {
  '01': '근로소득',
  '02': '사업소득',
  '03': '기타소득',
};

/** 보유 대출액 구간 코드 → 한글 라벨 */
const EXISTING_LOAN_LABELS: Record<string, string> = {
  LOAN_NONE: '없음',
  LOAN_100M_OVER: '1억원 초과',
  LOAN_0_100M: '1억 이하'
};

/**
 * 고객 신청 정보 카드.
 * 신청 조건(희망 금액, 기간, 상환 방식, 자금 용도)과
 * 신청자 직접 입력 정보(연 소득, 신용점수, 소득 종류, 보유 대출액)를 하나의 카드에 표시한다.
 */
export default function ApplicationRequestCard({ applicationInfo, userInputInfo, productName, consentHistories }: ApplicationRequestCardProps) {
  const applicationInfoItems = [
    {
      label: '신청 상품',
      value: productName ?? '-',
    },
    {
      label: '희망 대출 금액',
      value: applicationInfo.requestedAmount != null ? formatCurrency(applicationInfo.requestedAmount) : '-',
    },
    {
      label: '대출 기간',
      value: applicationInfo.requestedTerm != null ? formatMonths(applicationInfo.requestedTerm) : '-',
    },
    {
      label: '상환 방식',
      value: applicationInfo.repaymentMethod
        ? REPAYMENT_METHOD_LABELS[applicationInfo.repaymentMethod] ?? displayValue(applicationInfo.repaymentMethod)
        : '-',
    },
    {
      label: '자금 용도',
      value: applicationInfo.purpose ? PURPOSE_LABELS[applicationInfo.purpose] ?? displayValue(applicationInfo.purpose) : '-',
    },
  ];

  const inputItems = [
    {
      label: '연 소득',
      value: ANNUAL_INCOME_LABELS[userInputInfo.annualIncome] ?? userInputInfo.annualIncome,
    },
    {
      label: '신용점수',
      value: CREDIT_SCORE_LABELS[userInputInfo.creditScore] ?? userInputInfo.creditScore,
    },
    {
      label: '소득 종류',
      value: INCOME_TYPE_LABELS[userInputInfo.incomeType] ?? userInputInfo.incomeType,
    },
    {
      label: '보유 대출액',
      value: EXISTING_LOAN_LABELS[userInputInfo.existingLoanAmount] ?? userInputInfo.existingLoanAmount,
    },
  ];

  return (
    <Card title="고객 신청 정보" titleIcon={<FileText size={16} className="text-text-primary" />} className="h-full flex flex-col">

      <div className="grid grid-cols-2 divide-x divide-border-default">
        {/* 신청 정보 */}
        <div className="pr-4">
          <dl className="space-y-2">
            {applicationInfoItems.map((item) => (
              <InfoRow key={item.label} label={item.label} value={item.value} />
            ))}
          </dl>
        </div>

        {/* 신청자 입력 */}
        <div className="pl-4">
          <dl className="space-y-2">
            {inputItems.map((item) => (
              <InfoRow key={item.label} label={item.label} value={item.value} />
            ))}
          </dl>
        </div>
      </div>

      {/* 약관 동의 (하단 별도 섹션) */}
      <div className="mt-auto border-t border-border-default pt-4">
        <h4 className="mb-2 text-xs font-semibold text-text-secondary">약관 동의</h4>
        {consentHistories.length > 0 ? (
          <ul className="grid grid-cols-2 gap-x-6 gap-y-1.5">
            {consentHistories.map((consent) => (
              <li key={consent.title} className="flex items-center justify-between gap-2">
                <span className="text-xs text-text-secondary">
                  {consent.title}
                  {consent.isRequired ? '' : ' (선택)'}
                </span>
                <div className="flex shrink-0 items-center gap-1.5">
                  {consent.isConsented && consent.consentedAt && (
                    <span className="text-xs text-text-disabled">
                      {new Date(consent.consentedAt).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      })}
                    </span>
                  )}
                  <span className={`text-xs font-medium ${consent.isConsented ? 'text-success' : 'text-text-disabled'}`}>
                    {consent.isConsented ? '동의' : '미동의'}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-text-disabled">약관 동의 내역 없음</p>
        )}
      </div>
    </Card>
  );
}
