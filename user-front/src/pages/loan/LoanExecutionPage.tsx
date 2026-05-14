/**
 * 대출 실행 완료 페이지
 * Route: /loan/execution/:applicationId
 * Layout: MainLayout
 *
 * - 계좌 인증 (1원 송금 → 인증번호 확인) 완료 후 진입
 * - StatusCard(success) 사용
 */
export default function LoanExecutionPage() {
  // TODO: useParams로 applicationId 추출
  // TODO: StatusCard로 완료 화면 구현
  return <div data-testid="loan-execution-page" />;
}
