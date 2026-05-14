/**
 * 사업자 정보 확인 공통 컴포넌트
 *
 * 사용처:
 * - 대출 신청 사업자 정보 확인 step
 * - 마이페이지 사업자 정보 확인
 */

interface BizInfo {
  businessNumber: string;
  businessName: string;
  businessType: string;
  openDate: string;
  ownerName: string;
}

interface BizInfoConfirmProps {
  bizInfo: BizInfo;
  onConfirm: () => void;
}

export function BizInfoConfirm(_props: BizInfoConfirmProps) {
  // TODO: UI 구현
  return <div data-testid="biz-info-confirm" />;
}
