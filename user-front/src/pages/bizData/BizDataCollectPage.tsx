/**
 * My Biz Data 수집 페이지 — step 기반 흐름
 * Route: /biz-data/collect
 * Layout: StepLayout (하단 네비 없음)
 *
 * Step 순서:
 *   CERT_INFO → 고객 정보 입력 (CustomerVerifyPage 내부에서 처리)
 *   PIN       → PIN 인증 (CustomerVerifyPage 내부에서 처리)
 *   TERMS     → 마이 비즈니스 데이터 약관 동의
 *   LOADING   → 데이터 수집 중 (LoadingScreen)
 *
 * step 상태: useBizDataCollectStore (Zustand)
 */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLayoutStore } from "@/stores/layoutStore";
import { useBizDataCollectStore } from "@/stores/bizDataCollectStore";
import { CustomerVerifyPage } from "@/components/auth/CustomerVerifyPage";
import { TermsPage } from "@/components/terms/TermsPage";
import { LoadingScreen } from "@/components/bizData/LoadingScreen";
import { MOCK_BIZ_DATA_COLLECT_STEPS } from "@/mocks/bizData";
import { connectMyBiz } from "@/api/mybizApi";
import { completeLoanMybizData } from "@/api/loanApi";
import { submitTermsConsents } from "@/api/termsApi";
import { useTerms } from "@/hooks/useTerms";

export default function BizDataCollectPage() {
  const currentStep = useBizDataCollectStore((s) => s.currentStep);
  const nextStep = useBizDataCollectStore((s) => s.nextStep);
  const setStep = useBizDataCollectStore((s) => s.setStep);
  const reset = useBizDataCollectStore((s) => s.reset);
  const navigate = useNavigate();
  const { terms: mybizTerms } = useTerms("MYBIZDATA");

  // 대출 신청 흐름에서 진입한 경우 완료 후 돌아갈 경로
  const locationState = history.state?.usr as { returnTo?: string; startAt?: string; buttonLabel?: string; applicationId?: number } | null;
  const returnTo = locationState?.returnTo;
  const loanApplicationId = locationState?.applicationId;

  // grade-report에서 진입한 경우 커스텀 버튼 라벨 사용
  const isFromGradeReport = returnTo === "/grade-report";
  const loadingButtonLabel = isFromGradeReport
    ? "성장 S등급 분석하러 가기"
    : (locationState?.buttonLabel ?? "분석 결과 보기");

  // startAt이 지정되면 해당 step부터 시작
  useEffect(() => {
    const startAt = locationState?.startAt;
    if (startAt === "LOADING") {
      setStep("LOADING");
    } else if (startAt === "TERMS") {
      setStep("TERMS");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    useLayoutStore.getState().setStepTitle("마이 비즈 데이터");

    // 커스텀 뒤로가기: CERT_INFO면 실제 뒤로가기, 아니면 이전 step
    useLayoutStore.getState().setOnBack(() => {
      const current = useBizDataCollectStore.getState().currentStep;
      if (current === "CERT_INFO" || current === "TERMS") {
        navigate(-1);
      } else {
        useBizDataCollectStore.getState().prevStep();
      }
    });

    return () => {
      // 페이지 떠날 때 onBack 초기화
      useLayoutStore.getState().setOnBack(null);
    };
  }, [navigate]);

  switch (currentStep) {
    case "CERT_INFO":
      return (
        <CustomerVerifyPage
          description="본인 확인을 위해 정보를 입력해 주세요."
          onSuccess={() => nextStep()}
        />
      );

    case "TERMS":
      return (
        <TermsPage
          termType="MYBIZDATA"
          title="마이 비즈니스 데이터 약관 동의"
          description="S분석 리포트 생성을 위해 마이 비즈니스 데이터를 수집 분석합니다. 아래 약관에 동의해주세요."
          submitLabel="동의하고 계속하기"
          onSubmit={async (agreedIds) => {
            const consents = mybizTerms.map((term) => ({
              termId: term.id,
              isConsented: agreedIds.includes(term.id),
            }));
            await submitTermsConsents({
              termType: "MYBIZDATA",
              consents,
            });
            nextStep();
          }}
        />
      );

    case "LOADING":
      return (
        <LoadingScreen
          title="사업 데이터를 수집하고 있어요"
          description="수집된 사업 데이터는 S등급 분석 및 대출 심사에 활용됩니다."
          steps={MOCK_BIZ_DATA_COLLECT_STEPS}
          buttonLabel={loadingButtonLabel}
          onAllDone={async () => {
            if (loanApplicationId) {
              await completeLoanMybizData(loanApplicationId);
            } else {
              await connectMyBiz();
            }
          }}
          onComplete={() => {
            reset();
            if (isFromGradeReport) {
              navigate(returnTo, { state: { startAt: "LOADING" } });
            } else if (returnTo) {
              navigate(returnTo);
            } else {
              navigate("/biz-data");
            }
          }}
        />
      );

    default:
      return null;
  }
}
