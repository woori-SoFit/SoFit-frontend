/**
 * 대출 납부 금액 계산 유틸리티
 *
 * 상환방식 (백엔드 응답 기준):
 *   - EQUAL_PRINCIPAL: 원금균등 (매월 원금 동일, 이자 감소)
 *   - EQUAL_PAYMENT:   원리금균등 (매월 납부액 동일)
 *   - BULLET:          만기일시 (매월 이자만, 만기 시 원금 상환)
 */

export type RepaymentMethod =
  | "EQUAL_PRINCIPAL"
  | "EQUAL_PAYMENT"
  | "BULLET";

/** 상환방식 코드 → 한글 라벨 변환 */
export function getRepaymentLabel(method: string): string {
  switch (method) {
    case "EQUAL_PAYMENT":
      return "원리금균등";
    case "EQUAL_PRINCIPAL":
      return "원금균등";
    case "BULLET":
      return "만기일시";
    default:
      return method;
  }
}

interface MonthlyPaymentParams {
  /** 대출 원금 (원) */
  principal: number;
  /** 연 이율 (%, 예: 5.74) */
  annualRate: number;
  /** 대출 기간 (개월) */
  termMonths: number;
  /** 상환 방식 */
  repaymentMethod: RepaymentMethod;
}

interface MonthlyPaymentResult {
  /** 해당 월 총 납부액 (원금 + 이자) */
  totalPayment: number;
  /** 해당 월 원금 상환액 */
  principalPayment: number;
  /** 해당 월 이자 */
  interestPayment: number;
}

/**
 * 특정 회차의 월 납부 금액을 계산합니다.
 *
 * @param params 대출 조건
 * @param month 조회할 회차 (1부터 시작, 기본값 1)
 */
export function calculateMonthlyPayment(
  params: MonthlyPaymentParams,
  month = 1
): MonthlyPaymentResult {
  const { principal, annualRate, termMonths, repaymentMethod } = params;
  const monthlyRate = annualRate / 100 / 12;

  switch (repaymentMethod) {
    case "BULLET": {
      // 만기일시: 매월 이자만 납부, 마지막 달에 원금 + 이자
      const interest = Math.round(principal * monthlyRate);
      if (month === termMonths) {
        return {
          totalPayment: principal + interest,
          principalPayment: principal,
          interestPayment: interest,
        };
      }
      return {
        totalPayment: interest,
        principalPayment: 0,
        interestPayment: interest,
      };
    }

    case "EQUAL_PRINCIPAL": {
      // 원금균등: 매월 동일 원금 + 잔여 원금 기준 이자
      const monthlyPrincipal = Math.round(principal / termMonths);
      const remainingPrincipal = principal - monthlyPrincipal * (month - 1);
      const interest = Math.round(remainingPrincipal * monthlyRate);
      return {
        totalPayment: monthlyPrincipal + interest,
        principalPayment: monthlyPrincipal,
        interestPayment: interest,
      };
    }

    case "EQUAL_PAYMENT":
    default: {
      // 원리금균등: 매월 동일 납부액
      if (monthlyRate === 0) {
        const payment = Math.round(principal / termMonths);
        return {
          totalPayment: payment,
          principalPayment: payment,
          interestPayment: 0,
        };
      }
      const payment = Math.round(
        principal *
          (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
          (Math.pow(1 + monthlyRate, termMonths) - 1)
      );
      // 특정 회차의 이자/원금 분리
      let remaining = principal;
      for (let i = 1; i < month; i++) {
        const interest = remaining * monthlyRate;
        remaining -= payment - interest;
      }
      const interest = Math.round(remaining * monthlyRate);
      const principalPayment = payment - interest;
      return {
        totalPayment: payment,
        principalPayment,
        interestPayment: interest,
      };
    }
  }
}

/**
 * 첫 회차 기준 월 납부 총액만 간단히 반환
 */
export function getFirstMonthPayment(
  principal: number,
  annualRate: number,
  termMonths: number,
  repaymentMethod: RepaymentMethod
): number {
  return calculateMonthlyPayment(
    { principal, annualRate, termMonths, repaymentMethod },
    1
  ).totalPayment;
}

/**
 * 전체 상환 스케줄을 반환
 */
export function getRepaymentSchedule(
  params: MonthlyPaymentParams
): MonthlyPaymentResult[] {
  const schedule: MonthlyPaymentResult[] = [];
  for (let month = 1; month <= params.termMonths; month++) {
    schedule.push(calculateMonthlyPayment(params, month));
  }
  return schedule;
}
