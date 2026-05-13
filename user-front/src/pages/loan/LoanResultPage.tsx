/**
 * 심사 결과 페이지
 * Route: /loan/result/:applicationId
 * Layout: MainLayout
 *
 * - 승인 시: 확정 금리 제안, 한도 직접 입력 → 약정 체결 버튼
 * - 거절 시: 거절 사유 표시
 */
export default function LoanResultPage() {
  // TODO: useParams로 applicationId 추출
  // TODO: useQuery로 심사 결과 조회
  return <div data-testid="loan-result-page" />;
}
