/**
 * 대출 상품 Mock 데이터
 *
 * TODO: API 연동 완료 후 이 파일 삭제
 */
import type { LoanProduct } from "@/types/loan";

export const MOCK_LOAN_PRODUCTS: LoanProduct[] = [
  {
    id: 1,
    name: "우리 사장님 대출",
    title: "빠르고 간편한\n사업자 대출",
    minAmount: 5_000_000,
    maxAmount: 30_000_000,
    minRate: 4.5,
    maxRate: 8.9,
    minTerm: 12,
    maxTerm: 60,
    description: "개인사업자 신속·초간편\n비대면 대출상품",
  },
  {
    id: 2,
    name: "성장 사다리 대출",
    title: "성장하는 사업에\n날개를 달아드려요",
    minAmount: 10_000_000,
    maxAmount: 200_000_000,
    minRate: 3.9,
    maxRate: 7.5,
    minTerm: 12,
    maxTerm: 84,
    description: "성장S등급 우대 대출\n사업 확장을 위한 맞춤 상품",
  },
  {
    id: 3,
    name: "긴급 운영자금 대출",
    title: "급할 때 빠르게\n운영자금 지원",
    minAmount: 1_000_000,
    maxAmount: 50_000_000,
    minRate: 5.0,
    maxRate: 9.9,
    minTerm: 6,
    maxTerm: 36,
    description: "빠른 심사 소액 대출\n당일 실행 가능",
  },
];

/** ID로 상품 조회 */
export function getMockLoanProduct(id: number): LoanProduct | undefined {
  return MOCK_LOAN_PRODUCTS.find((p) => p.id === id);
}
