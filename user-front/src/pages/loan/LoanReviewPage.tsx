/**
 * 심사 진행 중 페이지
 * Route: /loan/review/:applicationId
 * Layout: MainLayout
 *
 * - 폴링 방식으로 심사 상태 조회
 * - 완료/실패 상태 도달 시 폴링 중단 (컨벤션 필수)
 * - 상태 변경 시 /loan/result/:applicationId 로 이동
 */
export default function LoanReviewPage() {
  // TODO: useParams로 applicationId 추출
  // TODO: useQuery + refetchInterval로 폴링 구현
  // TODO: APPROVED/REJECTED 상태 도달 시 폴링 중단 후 result 페이지 이동
  return <div data-testid="loan-review-page" />;
}
