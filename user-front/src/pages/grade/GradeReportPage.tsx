/**
 * 성장 S등급 분석 리포트 페이지 — step 기반 흐름
 * Route: /grade-report
 * Layout: StepLayout
 *
 * Step 순서:
 *   INTRO      → 서비스 소개
 *   BIZ_CHECK  → My Biz Data 확인
 *   LOADING    → S등급 산출 대기
 *   RESULT     → 등급 결과
 *
 * step 상태: useGradeReportStore (Zustand)
 *
 * 주의: SHAP 내부 파생 변수 노출 금지, 친화적 용어만 표시
 */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLayoutStore } from "@/stores/layoutStore";
import { useGradeReportStore } from "@/stores/gradeReportStore";
import { GradeIntroStep } from "@/components/grade/GradeIntroStep";
import { BizDataCheckStep } from "@/components/grade/BizDataCheckStep";
import { GradeLoadingStep } from "@/components/grade/GradeLoadingStep";
import { GradeResultStep } from "@/components/grade/GradeResultStep";

export default function GradeReportPage() {
  const currentStep = useGradeReportStore((s) => s.currentStep);
  const nextStep = useGradeReportStore((s) => s.nextStep);
  const navigate = useNavigate();

  useEffect(() => {
    useLayoutStore.getState().setStepTitle("성장 S등급 분석 리포트");

    // 커스텀 뒤로가기: 첫 step이면 실제 뒤로가기, 아니면 이전 step
    useLayoutStore.getState().setOnBack(() => {
      const current = useGradeReportStore.getState().currentStep;
      if (current === "INTRO") {
        navigate(-1);
      } else {
        useGradeReportStore.getState().prevStep();
      }
    });

    return () => {
      useLayoutStore.getState().setOnBack(null);
    };
  }, [navigate]);

  switch (currentStep) {
    case "INTRO":
      return <GradeIntroStep onNext={nextStep} />;

    case "BIZ_CHECK":
      return <BizDataCheckStep onNext={nextStep} />;

    case "LOADING":
      return <GradeLoadingStep onComplete={nextStep} />;

    case "RESULT":
      return <GradeResultStep />;

    default:
      return null;
  }
}
