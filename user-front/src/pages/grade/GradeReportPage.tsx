/**
 * 성장 S등급 분석 리포트 페이지
 * Route: /grade-report
 * Layout: MainLayout
 *
 * 상태별 분기:
 *   - My Biz Data 미연결 → 연결 유도 화면
 *   - 배치 미실행/미산출 → "아직 성장 S등급이 산출되지 않았어요" 안내
 *   - 배치 완료 → 등급(S1~S10) + LLM 자연어 설명 리포트
 *
 * 주의: SHAP 내부 파생 변수 노출 금지, 친화적 용어만 표시
 */
export default function GradeReportPage() {
  // TODO: useQuery로 성장 S등급 조회
  return <div data-testid="grade-report-page" />;
}
