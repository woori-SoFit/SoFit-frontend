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
import { useEffect, useCallback, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLayoutStore } from "@/stores/layoutStore";
import { useGradeReportStore } from "@/stores/gradeReportStore";
import { useMe } from "@/hooks/useMe";
import { checkMyBizConnected } from "@/api/mybizApi";
import { fetchGradeResult, type GradeResult } from "@/api/gradeApi";
import { GradeIntroStep } from "@/components/grade/GradeIntroStep";
import { BizDataCheckStep } from "@/components/grade/BizDataCheckStep";
import { GradeLoadingStep } from "@/components/grade/GradeLoadingStep";
import { GradeResultStep } from "@/components/grade/GradeResultStep";

export default function GradeReportPage() {
  const currentStep = useGradeReportStore((s) => s.currentStep);
  const setStep = useGradeReportStore((s) => s.setStep);
  const nextStep = useGradeReportStore((s) => s.nextStep);
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useMe();
  const [isLoading, setIsLoading] = useState(false);
  const [gradeResult, setGradeResult] = useState<GradeResult | null>(null);

  // /biz-data/collect 완료 후 돌아왔을 때 LOADING 스텝으로 진입
  useEffect(() => {
    const state = location.state as { startAt?: string } | null;
    if (state?.startAt === "LOADING") {
      setStep("LOADING");
      // state 정리 (뒤로가기 시 재진입 방지)
      window.history.replaceState({}, "");
    }
  }, [location.state, setStep]);

  // RESULT 스텝인데 gradeResult가 없으면 (뒤로가기로 돌아온 경우) API 재조회
  useEffect(() => {
    if (currentStep === "RESULT" && !gradeResult) {
      const refetch = async () => {
        try {
          const result = await fetchGradeResult();
          setGradeResult(result);
        } catch {
          // 조회 실패 시 INTRO로 리셋
          setStep("INTRO");
        }
      };
      refetch();
    }
  }, [currentStep, gradeResult, setStep]);

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

  /** INTRO 스텝에서 "S분석 리포트 시작하기" 클릭 시 인증 확인 후 다음 스텝 */
  const handleIntroNext = useCallback(() => {
    if (!isLoggedIn) {
      navigate(`/login?returnUrl=${encodeURIComponent("/grade-report")}`, { replace: true });
      return;
    }
    nextStep();
  }, [isLoggedIn, navigate, nextStep]);

  /** BIZ_CHECK 스텝에서 "불러오기" 클릭 시 마이비즈 연동 여부 확인 후 S등급 조회 */
  const handleBizCheck = useCallback(async () => {
    setIsLoading(true);
    try {
      const isConnected = await checkMyBizConnected();
      if (isConnected) {
        // 마이비즈 연동 완료 → S등급 결과 조회
        const result = await fetchGradeResult();
        setGradeResult(result);
        setStep("RESULT");
      } else {
        // 마이비즈 미연동 → bizData IntroSection 페이지로 이동
        navigate("/biz-data", {
          state: { returnTo: "/grade-report" },
        });
      }
    } catch {
      // API 호출 실패 시 안전하게 bizData IntroSection 페이지로 이동
      navigate("/biz-data", {
        state: { returnTo: "/grade-report" },
      });
    } finally {
      setIsLoading(false);
    }
  }, [setStep, navigate]);

  switch (currentStep) {
    case "INTRO":
      return <GradeIntroStep onNext={handleIntroNext} />;

    case "BIZ_CHECK":
      return <BizDataCheckStep onNext={handleBizCheck} isLoading={isLoading} />;

    case "LOADING":
      return <GradeLoadingStep onComplete={nextStep} />;

    case "RESULT":
      return <GradeResultStep gradeResult={gradeResult} />;

    default:
      return null;
  }
}
