/**
 * 로딩 상태 화면 공통 컴포넌트
 *
 * 사용처:
 * - My Biz Data 수집 중 로딩
 * - 대출 신청 MyData 불러오기 로딩
 * - 성장 S등급 분석 리포트 생성 중
 */

interface LoadingScreenProps {
  title: string;
  description?: string;
  /** 항목별 진행 상태 (My Biz Data 수집 등) */
  steps?: Array<{
    label: string;
    status: "pending" | "loading" | "done";
  }>;
}

export function LoadingScreen(_props: LoadingScreenProps) {
  // TODO: UI 구현
  return <div data-testid="loading-screen" />;
}
