import type { ApplicationInfo, UserInputInfo, LoanProductInfo, ConsentHistory } from '@/types';
import { formatCurrency, formatMonths, displayValue } from '@/utils/formatters';
import { REPAYMENT_METHOD_LABELS, PURPOSE_LABELS } from '@/constants/loanLabels';

interface ApplicationRequestCardProps {
  applicationInfo: ApplicationInfo;
  userInputInfo: UserInputInfo;
  productInfo: LoanProductInfo;
  consentHistories: ConsentHistory[];
}

/** 연 소득 구간 코드 → 한글 라벨 */
const ANNUAL_INCOME_LABELS: Record<string, string> = {
  AMT_0_30M: '3천만원 미만',
  AMT_30_50M: '3천~5천만원',
  AMT_50_100M: '5천만~1억원',
  AMT_100_200M: '1억~2억원',
  AMT_200M_OVER: '2억원 이상',
};

/** 신용점수 구간 코드 → 한글 라벨 */
const CREDIT_SCORE_LABELS: Record<string, string> = {
  CS_0_600: '600점 미만',
  CS_600_700: '600~700점',
  CS_700_800: '700~800점',
  CS_800_850: '800~850점',
  CS_850_OVER: '850점 이상',
};

/** 소득 종류 코드 → 한글 라벨 */
const INCOME_TYPE_LABELS: Record<string, string> = {
  '01': '근로소득',
  '02': '사업소득',
  '03': '기타소득',
};

/** 보유 대출액 구간 코드 → 한글 라벨 */
const EXISTING_LOAN_LABELS: Record<string, string> = {
  LOAN_0: '없음',
  LOAN_0_100M: '1억원 미만',
  LOAN_100_300M: '1억~3억원',
  LOAN_300M_OVER: '3억원 이상',
};

/**
 * 고객 신청 정보 카드.
 * 신청 조건(희망 금액, 기간, 상환 방식, 자금 용도)과
 * 신청자 직접 입력 정보(연 소득, 신용점수, 소득 종류, 보유 대출액)를 하나의 카드에 표시한다.
 */
export default function ApplicationRequestCard({ applicationInfo, userInputInfo, productInfo, consentHistories }: ApplicationRequestCardProps) {
  const applicationInfoItems = [
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
    <div className="rounded-lg border border-border-default bg-bg-surface p-5 shadow-card min-h-56">
      <h3 className="mb-4 text-sm font-semibold text-text-primary">고객 신청 정보</h3>

      {/* 대출 상품명 */}
      <div className="mb-4 flex items-center gap-2">
        <span className="text-xs text-text-secondary">신청 상품</span>
        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
          {productInfo.productName}
        </span>
      </div>

      <div className="grid grid-cols-3 divide-x divide-border-default">
        {/* 신청 정보 */}
        <div className="pr-4">
          <dl className="space-y-2">
            {applicationInfoItems.map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <dt className="text-xs text-text-secondary">{item.label}</dt>
                <dd className="text-sm font-medium text-text-primary">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* 신청자 입력 */}
        <div className="px-4">
          <dl className="space-y-2">
            {inputItems.map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <dt className="text-xs text-text-secondary">{item.label}</dt>
                <dd className="text-sm font-medium text-text-primary">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* 약관 동의 */}
        <div className="pl-4">
          {consentHistories.length > 0 ? (
            <ul className="space-y-2">
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
      </div>
    </div>
  );
}
