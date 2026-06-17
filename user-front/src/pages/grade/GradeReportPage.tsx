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
import { fetchGradeResult, fetchGradeDetail } from "@/api/gradeApi";
import { GradeIntroStep } from "@/components/grade/GradeIntroStep";
import { BizDataCheckStep } from "@/components/grade/BizDataCheckStep";
import { GradeLoadingStep } from "@/components/grade/GradeLoadingStep";

export default function GradeReportPage() {
  const currentStep = useGradeReportStore((s) => s.currentStep);
  const setStep = useGradeReportStore((s) => s.setStep);
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useMe();
  const [isLoading, setIsLoading] = useState(false);

  // 페이지 진입 시 항상 INTRO부터 시작 (로그아웃 후 재진입 대비)
  useEffect(() => {
    useGradeReportStore.getState().reset();
  }, []);

  // /biz-data/collect 완료 후 돌아왔을 때 LOADING 스텝으로 진입
  useEffect(() => {
    const state = location.state as { startAt?: string } | null;
    if (state?.startAt === "LOADING") {
      setStep("LOADING");
      window.history.replaceState({}, "");
    }
  }, [location.state, setStep]);

  useEffect(() => {
    useLayoutStore.getState().setStepTitle(currentStep === "INTRO" ? "" : "성장 S등급 분석 리포트");

    // 커스텀 뒤로가기: RESULT이면 홈으로, INTRO이면 실제 뒤로가기, 그 외는 이전 step
    useLayoutStore.getState().setOnBack(() => {
      const current = useGradeReportStore.getState().currentStep;
      if (current === "RESULT") {
        navigate("/");
      } else if (current === "INTRO") {
        navigate(-1);
      } else {
        useGradeReportStore.getState().prevStep();
      }
    });

    return () => {
      useLayoutStore.getState().setOnBack(null);
    };
  }, [navigate, currentStep]);

  /** INTRO 스텝에서 "S분석 리포트 시작하기" 클릭 시 로그인 확인 + 마이비즈 연동 확인 */
  const handleIntroNext = useCallback(async () => {
    if (!isLoggedIn) {
      navigate(`/login?returnUrl=${encodeURIComponent("/grade-report")}`, { replace: true });
      return;
    }

    setIsLoading(true);
    try {
      const isConnected = await checkMyBizConnected();
      if (isConnected) {
        // 마이비즈 연동 완료 → S등급 + 상세 조회 후 리포트 페이지로 이동
        const [gradeRes, detail] = await Promise.all([
          fetchGradeResult().catch(() => ({ result: null, message: "" })),
          fetchGradeDetail().catch(() => null),
        ]);

        if (detail) {
          // comment/commentDetail을 detail에 병합해서 전달
          const mergedDetail = {
            ...detail,
            comment: gradeRes.result?.comment ?? "",
            commentDetail: gradeRes.result?.commentDetail ?? "",
          };
          navigate("/grade-report/detail", { state: { detail: mergedDetail } });
        } else {
          // 등급 미산출
          navigate("/grade-report/detail");
        }
      } else {
        setStep("BIZ_CHECK");
      }
    } catch {
      setStep("BIZ_CHECK");
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn, navigate, setStep]);

  /** BIZ_CHECK 스텝에서 "불러오기" 클릭 시 → 마이비즈 연동 페이지로 이동 */
  const handleBizCheck = useCallback(() => {
    navigate("/biz-data", {
      state: { returnTo: "/grade-report" },
    });
  }, [navigate]);

  switch (currentStep) {
    case "INTRO":
      return <GradeIntroStep onNext={handleIntroNext} isLoading={isLoading} />;

    case "BIZ_CHECK":
      return <BizDataCheckStep onNext={handleBizCheck} />;

    case "LOADING":
      return (
        <GradeLoadingStep
          onComplete={async () => {
            // 로딩 완료 → detail 페이지로 이동
            try {
              const [gradeRes, detail] = await Promise.all([
                fetchGradeResult().catch(() => ({ result: null, message: "" })),
                fetchGradeDetail().catch(() => null),
              ]);
              if (detail) {
                const mergedDetail = {
                  ...detail,
                  comment: gradeRes.result?.comment ?? "",
                  commentDetail: gradeRes.result?.commentDetail ?? "",
                };
                navigate("/grade-report/detail", { state: { detail: mergedDetail } });
              } else {
                navigate("/grade-report/detail");
              }
            } catch {
              navigate("/grade-report/detail");
            }
          }}
        />
      );

    default:
      return null;
  }
}
