/**
 * 대출 실행 완료 페이지
 * Route: /loan/execution/:applicationId
 * Layout: StepLayout
 */
import { useEffect } from "react";
import { useLayoutStore } from "@/stores/layoutStore";

export default function LoanExecutionPage() {
  useEffect(() => {
    useLayoutStore.getState().setStepTitle("대출 실행");
  }, []);

  // TODO: 대출 실행 완료 화면 구현
  return <div data-testid="loan-execution-page" />;
}
