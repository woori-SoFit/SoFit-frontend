/**
 * 약관 상세 보기 공통 컴포넌트 (Bottom Sheet / Modal)
 *
 * 사용처:
 * - 대출 약관 상세
 * - My Biz Data 약관 상세
 * - 회원가입 약관 상세
 */
import type { TermsItem } from "@/types/common";

interface TermsDetailSheetProps {
  term: TermsItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TermsDetailSheet(_props: TermsDetailSheetProps) {
  // TODO: UI 구현
  return <div data-testid="terms-detail-sheet" />;
}
