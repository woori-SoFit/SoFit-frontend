/**
 * 대출 사전 입력 선택지 상수
 * LoanPreApplyPage에서 사용하는 질문 항목 및 옵션 매핑
 */
import type {
  LoanEligibilityInput,
  AnnualIncome,
  CreditScore,
  IncomeType,
  ExistingLoanAmount,
} from "@/types/eligibility";

/** 질문 항목 타입 */
export interface PreApplyQuestion {
  id: keyof LoanEligibilityInput;
  label: string;
  options: { label: string; value: string }[];
}

/** 연소득 선택지 */
export const ANNUAL_INCOME_OPTIONS: { label: string; value: AnnualIncome }[] = [
  { label: "3천만원 이하", value: "AMT_0_30M" },
  { label: "3천만원 초과 ~ 5천만원 이하", value: "AMT_30_50M" },
  { label: "5천만원 초과 ~ 1억 이하", value: "AMT_50_100M" },
  { label: "1억 초과", value: "AMT_100M_OVER" },
];

/** 신용점수 선택지 */
export const CREDIT_SCORE_OPTIONS: { label: string; value: CreditScore }[] = [
  { label: "850점 이하", value: "CS_0_850" },
  { label: "850점 초과", value: "CS_850_OVER" },
  { label: "모름", value: "CS_UNKNOWN" },
];

/** 소득유형 선택지 */
export const INCOME_TYPE_OPTIONS: { label: string; value: IncomeType }[] = [
  { label: "급여 소득", value: "SALARY" },
  { label: "사업 소득", value: "BUSINESS" },
  { label: "기타 소득", value: "OTHER" },
];

/** 기존대출 선택지 */
export const EXISTING_LOAN_OPTIONS: { label: string; value: ExistingLoanAmount }[] = [
  { label: "1억 이하", value: "LOAN_0_100M" },
  { label: "1억 초과", value: "LOAN_100M_OVER" },
  { label: "없음", value: "LOAN_NONE" },
];

/** 질문 목록 */
export const PRE_APPLY_QUESTIONS: PreApplyQuestion[] = [
  {
    id: "annualIncome",
    label: "연 소득은 얼마인가요?",
    options: ANNUAL_INCOME_OPTIONS,
  },
  {
    id: "creditScore",
    label: "신용점수는 몇 점인가요?",
    options: CREDIT_SCORE_OPTIONS,
  },
  {
    id: "incomeType",
    label: "어떤 소득으로 갚을 예정인가요?",
    options: INCOME_TYPE_OPTIONS,
  },
  {
    id: "existingLoanAmount",
    label: "가지고 있는 대출이 있나요?",
    options: EXISTING_LOAN_OPTIONS,
  },
];
