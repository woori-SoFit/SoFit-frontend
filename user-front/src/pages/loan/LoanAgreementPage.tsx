/**
 * 대출 약정 페이지
 * Route: /loan/agreement/:applicationId
 * Layout: StepLayout (하단 네비 없음)
 *
 * Flow:
 *   약관 동의 → PIN 인증 (전자서명) → 계좌 설정 → 대출 실행 완료
 *
 * 공통 컴포넌트 사용:
 *   - TermsAgreement
 *   - PinInput (전자서명용)
 */
export default function LoanAgreementPage() {
  // TODO: useParams로 applicationId 추출
  // TODO: step 기반 약정 흐름 구현
  return <div data-testid="loan-agreement-page" />;
}
