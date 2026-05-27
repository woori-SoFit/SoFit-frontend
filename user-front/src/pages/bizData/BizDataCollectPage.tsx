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
import { MOCK_BIZ_DATA_TERMS, MOCK_BIZ_DATA_COLLECT_STEPS } from "@/mocks/bizData";
import { connectMyBiz } from "@/api/mybizApi";

export default function BizDataCollectPage() {
  const currentStep = useBizDataCollectStore((s) => s.currentStep);
  const nextStep = useBizDataCollectStore((s) => s.nextStep);
  const reset = useBizDataCollectStore((s) => s.reset);
  const navigate = useNavigate();

  useEffect(() => {
    useLayoutStore.getState().setStepTitle("마이 비즈 데이터");

    // 커스텀 뒤로가기: CERT_INFO면 실제 뒤로가기, 아니면 이전 step
    useLayoutStore.getState().setOnBack(() => {
      const current = useBizDataCollectStore.getState().currentStep;
      if (current === "CERT_INFO") {
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
      // TODO: API 연동 시 onVerify로 verifyFinancialCertificate 주입 (LoanApplyPage 참고)
      return (
        <CustomerVerifyPage
          onSuccess={() => nextStep()}
        />
      );

    case "TERMS":
      return (
        <TermsPage
          title="마이 비즈니스 데이터 약관 동의"
          description="S분석 리포트 생성을 위해 마이 비즈니스 데이터를 수집 분석합니다. 아래 약관에 동의해주세요."
          terms={MOCK_BIZ_DATA_TERMS}
          submitLabel="동의하고 계속하기"
          onSubmit={() => nextStep()}
        />
      );

    case "LOADING":
      return (
        <LoadingScreen
          title="사업 데이터를 분석하고 있어요"
          description="AI가 다양한 데이터를 안전하게 수집 분석합니다."
          steps={MOCK_BIZ_DATA_COLLECT_STEPS}
          onComplete={() => {
            connectMyBiz().finally(() => {
              reset();
              navigate("/biz-data");
            });
          }}
        />
      );

    default:
      return null;
  }
}
