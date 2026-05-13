/**
 * My Biz Data 수집 페이지
 * Route: /biz-data/collect
 * Layout: StepLayout
 *
 * Flow:
 *   PIN 인증 → 약관 동의 → 데이터 수집 중 (LoadingScreen) → 대시보드 이동
 *
 * - 최초 1회만 수집 가능
 * - 공통 컴포넌트: PinInput, TermsAgreement, LoadingScreen
 */
export default function BizDataCollectPage() {
  // TODO: step 기반 수집 흐름 구현
  return <div data-testid="biz-data-collect-page" />;
}
