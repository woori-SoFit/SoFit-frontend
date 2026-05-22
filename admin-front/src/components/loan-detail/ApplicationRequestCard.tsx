import type { ApplicationCondition, ApplicantInput, IncomeType, LoanProductInfo, TermsAgreement } from '@/types';
import { formatCurrency, formatMonths, displayValue } from '@/utils/formatters';
import { REPAYMENT_METHOD_LABELS, PURPOSE_LABELS } from '@/constants/loanLabels';

interface ApplicationRequestCardProps {
  condition: ApplicationCondition;
  applicantInput: ApplicantInput;
  productInfo: LoanProductInfo;
  termsAgreements: TermsAgreement[];
}

const INCOME_TYPE_LABELS: Record<IncomeType, string> = {
  SALARY: '근로소득',
  BUSINESS: '사업소득',
  OTHER: '기타소득',
};

/**
 * 고객 신청 정보 카드.
 * 신청 조건(희망 금액, 기간, 상환 방식, 자금 용도)과
 * 신청자 직접 입력 정보(연 소득, 신용점수, 소득 종류, 보유 대출액)를 하나의 카드에 표시한다.
 */
export default function ApplicationRequestCard({ condition, applicantInput, productInfo, termsAgreements }: ApplicationRequestCardProps) {
  const conditionItems = [
    {
      label: '희망 대출 금액',
      value: condition.desiredAmount != null ? formatCurrency(condition.desiredAmount) : '-',
    },
    {
      label: '대출 기간',
      value: condition.loanTermMonths != null ? formatMonths(condition.loanTermMonths) : '-',
    },
    {
      label: '상환 방식',
      value: condition.repaymentMethod
        ? REPAYMENT_METHOD_LABELS[condition.repaymentMethod] ?? displayValue(condition.repaymentMethod)
        : '-',
    },
    {
      label: '자금 용도',
      value: condition.purpose ? PURPOSE_LABELS[condition.purpose] ?? displayValue(condition.purpose) : '-',
    },
  ];

  const inputItems = [
    {
      label: '연 소득',
      value: applicantInput.annualIncome != null ? formatCurrency(applicantInput.annualIncome) : '-',
    },
    {
      label: '신용점수',
      value: applicantInput.creditScore != null ? `${applicantInput.creditScore}점` : '-',
    },
    {
      label: '소득 종류',
      value: applicantInput.incomeType ? (INCOME_TYPE_LABELS[applicantInput.incomeType] ?? '-') : '-',
    },
    {
      label: '보유 대출액',
      value: applicantInput.existingLoanAmount != null ? formatCurrency(applicantInput.existingLoanAmount) : '-',
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
            {conditionItems.map((item) => (
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
          {termsAgreements.length > 0 ? (
            <ul className="space-y-2">
              {termsAgreements.map((term) => (
                <li key={term.termName} className="flex items-center justify-between gap-2">
                  <span className="text-xs text-text-secondary">{term.termName}</span>
                  <div className="flex shrink-0 items-center gap-1.5">
                    {term.agreed && term.agreedAt && (
                      <span className="text-xs text-text-disabled">
                        {new Date(term.agreedAt).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                        })}
                      </span>
                    )}
                    <span className={`text-xs font-medium ${term.agreed ? 'text-success' : 'text-text-disabled'}`}>
                      {term.agreed ? '동의' : '미동의'}
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
