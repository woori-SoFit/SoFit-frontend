/**
 * 약관 동의 공통 컴포넌트
 *
 * 사용처:
 * - 대출 신청 약관 동의
 * - My Biz Data 약관 동의
 * - 회원가입 약관 동의
 */
import type { TermsItem } from "@/types/common";

interface TermsAgreementProps {
  terms: TermsItem[];
  agreedIds: number[];
  onChange: (agreedIds: number[]) => void;
  onViewDetail: (term: TermsItem) => void;
}

export function TermsAgreement(_props: TermsAgreementProps) {
  // TODO: UI 구현
  return <div data-testid="terms-agreement" />;
}
