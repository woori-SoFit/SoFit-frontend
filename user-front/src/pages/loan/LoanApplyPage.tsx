/**
 * 대출 신청 페이지 — step 기반 흐름
 * Route: /loan/apply
 * Layout: StepLayout (하단 네비 없음)
 *
 * Step 순서:
 *   TERMS          → 약관 동의
 *   CERT_INFO      → 고객 정보 입력 + PIN 인증 (CustomerVerifyPage가 내부에서 PIN까지 처리)
 *   PIN            → (CustomerVerifyPage 내부에서 처리, 외부에서 직접 진입 안 함)
 *   BIZ_CONFIRM    → 사업자 정보 확인
 *   MYDATA_TERMS   → MyData 동의
 *   MYDATA_LOADING → 데이터 로딩
 *   LOAN_CONDITIONS→ 대출 조건 입력
 *   RESULT         → 신청 완료/실패
 *
 * step 상태: useLoanApplyStore (Zustand)
 */
import { useEffect, useState } from "react";
import { useLayoutStore } from "@/stores/layoutStore";
import { useLoanApplyStore } from "@/stores/loanApplyStore";
import { TermsPage } from "@/components/terms/TermsPage";
import { CustomerVerifyPage } from "@/components/auth/CustomerVerifyPage";
import { BizInfoConfirm } from "@/components/loan/BizInfoConfirm";
import { MydataLoadingStep } from "@/components/loan/MydataLoadingStep";
import { LoanConditionsStep } from "@/components/loan/LoanConditionsStep";
import { CharacterLoadingSpinner } from "@/components/common/CharacterLoadingSpinner";
import { LoanApplyResult } from "@/components/loan/LoanApplyResult";
import { BizDataCheckStep } from "@/components/grade/BizDataCheckStep";
import { IntroSection } from "@/components/bizData/IntroSection";
import { ExitConfirmModal } from "@/components/loan/ExitConfirmModal";
import { StepProgress } from "@/components/common/StepProgress";
import { useNavigate, useLocation } from "react-router-dom";
import { formatBusinessNumber } from "@/utils/signupValidation";
import { checkMyBizConnected } from "@/api/mybizApi";
import { submitLoanConsents, fetchLoanBizInfo, submitLoanMydata } from "@/api/loanApi";
import { useTerms } from "@/hooks/useTerms";
import { REPAYMENT_LABELS } from "@/constants/loanLabels";
import { formatAmount, formatDateTime } from "@/utils/format";
import type { LoanApplyStep } from "@/types/loan";

export default function LoanApplyPage() {
  const currentStep = useLoanApplyStore((s) => s.currentStep);
  const nextStep = useLoanApplyStore((s) => s.nextStep);
  const setStep = useLoanApplyStore((s) => s.setStep);
  const updateFormData = useLoanApplyStore((s) => s.updateFormData);
  const reset = useLoanApplyStore((s) => s.reset);
  const productId = useLoanApplyStore((s) => s.productId);
  const applicationId = useLoanApplyStore((s) => s.applicationId);
  const submitResult = useLoanApplyStore((s) => s.submitResult);
  const navigate = useNavigate();
  const location = useLocation();
  const { terms: loanTerms } = useTerms("LOAN_APPLICATION");
  const { terms: mydataTerms } = useTerms("MYDATA");

  // 이탈 방지 모달 상태
  const [exitModal, setExitModal] = useState<"back" | "home" | null>(null);

  // 대출 전용 사업자 정보 조회 (BIZ_CONFIRM step 진입 시 1회 호출, resumeStep 업데이트)
  const [loanBizInfo, setLoanBizInfo] = useState<Awaited<ReturnType<typeof fetchLoanBizInfo>> | null>(null);

  useEffect(() => {
    if (!applicationId || currentStep !== "BIZ_CONFIRM") return;
    let cancelled = false;

    fetchLoanBizInfo(applicationId).then((result) => {
      if (!cancelled) setLoanBizInfo(result);
    });

    return () => { cancelled = true; };
  }, [applicationId, currentStep]);

  const loanBizInfoRows = loanBizInfo
    ? [
        { label: "사업자등록번호", value: formatBusinessNumber(loanBizInfo.businessNumber) },
        { label: "상호명", value: loanBizInfo.businessName },
        { label: "대표자명", value: loanBizInfo.representativeName },
        { label: "개업일", value: loanBizInfo.openDate },
        { label: "업종/업태", value: `${loanBizInfo.businessCategory}/${loanBizInfo.businessType}` },
        { label: "사업장 주소", value: loanBizInfo.businessAddress },
      ]
    : [];

  // navigation state에서 productId, applicationId 수신 및 스토어 초기화
  useEffect(() => {
    const state = location.state as {
      productId?: number;
      applicationId?: number;
      resumeStep?: string;
    } | null;

    // URL 쿼리에서 step 복원 (BizDataCollectPage에서 돌아온 경우)
    const params = new URLSearchParams(location.search);
    const stepParam = params.get("step");
    if (stepParam === "LOAN_CONDITIONS") {
      // state에서 productId/applicationId가 있으면 설정 (BizDataCollect에서 전달)
      if (state?.productId) {
        useLoanApplyStore.getState().setProductId(state.productId);
      }
      if (state?.applicationId) {
        useLoanApplyStore.getState().setApplicationId(state.applicationId);
      }
      setStep("LOAN_CONDITIONS");
      return;
    }

    reset();

    if (state?.productId) {
      useLoanApplyStore.getState().setProductId(state.productId);
    }
    if (state?.applicationId) {
      useLoanApplyStore.getState().setApplicationId(state.applicationId);
    }

    // 임시저장 이어가기: resumeStep에 따라 해당 step으로 이동
    if (state?.resumeStep) {
      const stepMap: Record<string, LoanApplyStep> = {
        CONSENT: "TERMS",
        BIZ_INFO: "CERT_INFO",
        COLLECT_DATA: "MYDATA_TERMS",
        MYBIZ: "MYDATA_LOADING",
        LOAN_CONDITION: "LOAN_CONDITIONS",
      };
      const targetStep = stepMap[state.resumeStep];
      if (targetStep) {
        setStep(targetStep);
      }
    }
  }, []);

  useEffect(() => {
    // BIZ_INTRO에서는 헤더 타이틀 숨김
    if (currentStep === "BIZ_INTRO") {
      useLayoutStore.getState().setStepTitle("");
    } else {
      useLayoutStore.getState().setStepTitle("대출 신청");
    }

    if (currentStep === "RESULT") {
      // 대출 신청 완료 화면에서는 뒤로가기 비활성, 홈 버튼은 바로 이동
      useLayoutStore.getState().setOnBack(() => {
        // 뒤로가기 무시 (아무 동작 안 함)
      });
      useLayoutStore.getState().setOnHome(() => {
        reset();
        navigate("/");
      });
    } else {
      // 일반 스텝: 이탈 방지 모달 표시
      useLayoutStore.getState().setOnBack(() => {
        setExitModal("back");
      });
      useLayoutStore.getState().setOnHome(() => {
        setExitModal("home");
      });
    }

    return () => {
      useLayoutStore.getState().setOnBack(null);
      useLayoutStore.getState().setOnHome(null);
    };
  }, [currentStep, navigate]);

  // 대출 신청 스텝퍼 정의
  const LOAN_STEP_LABELS = ["약관동의", "본인인증", "사업자확인", "데이터동의", "조건입력"];

  const STEP_TO_PROGRESS_INDEX: Record<string, number> = {
    TERMS: 0,
    CERT_INFO: 1,
    PIN: 1,
    BIZ_CONFIRM: 2,
    MYDATA_TERMS: 3,
    MYDATA_LOADING: 3,
    LOAN_CONDITIONS: 4,
  };

  const progressIndex = STEP_TO_PROGRESS_INDEX[currentStep] ?? -1;
  const showStepper = progressIndex >= 0 && currentStep !== "RESULT";

  const renderStep = () => {
    switch (currentStep) {
    case "TERMS":
      return (
        <TermsPage
          termType="LOAN_APPLICATION"
          title="대출 약관 동의"
          description="대출 신청을 위해 아래 약관에 동의해 주세요."
          submitLabel="동의하고 계속"
          onSubmit={async (agreedIds) => {
            updateFormData({ agreedTermIds: agreedIds });

            // 약관 동의 API 호출
            if (applicationId) {
              const consents = loanTerms.map((term) => ({
                termId: term.id,
                isConsented: agreedIds.includes(term.id),
              }));
              await submitLoanConsents(applicationId, {
                termType: "LOAN_APPLICATION",
                applicationId,
                consents,
              });
            }

            nextStep();
          }}
        />
      );

    case "CERT_INFO":
    case "PIN":
      return (
        <CustomerVerifyPage
          description="본인 확인을 위해 정보를 입력해 주세요."
          onSuccess={() => {
            // PIN 인증 완료 → BIZ_CONFIRM으로 이동
            setStep("BIZ_CONFIRM");
          }}
        />
      );

    case "BIZ_CONFIRM":
      return (
        <BizInfoConfirm
          title={<><span className="text-primary">사업자 정보</span>를 불러왔어요</>}
          description="아래 정보가 맞는지 확인해주세요."
          rows={loanBizInfoRows}
          isLoading={loanBizInfo === null}
          onConfirm={() => nextStep()}
        />
      );

    case "MYDATA_TERMS":
      return (
        <TermsPage
          termType="MYDATA"
          title="마이데이터 정보 동의"
          description="대출 심사를 위해 마이데이터 정보 활용에 동의해 주세요."
          submitLabel="동의하고 계속"
          onSubmit={async (agreedIds) => {
            if (applicationId) {
              const consents = mydataTerms.map((term) => ({
                termId: term.id,
                isConsented: agreedIds.includes(term.id),
              }));
              await submitLoanMydata(applicationId, {
                termType: "MYDATA",
                applicationId,
                consents,
              });
            }
            nextStep();
          }}
        />
      );

    case "MYDATA_LOADING":
      return (
        <MydataLoadingStep onComplete={async () => {
          try {
            const connected = await checkMyBizConnected();
            if (connected) {
              // 이미 연동됨 → BizDataCollectPage LOADING으로 이동 후 LOAN_CONDITIONS로 복귀
              navigate("/biz-data/collect", {
                state: { returnTo: "/loan/apply?step=LOAN_CONDITIONS", startAt: "LOADING", buttonLabel: "대출 조건 입력하기", applicationId },
              });
            } else {
              // 미연동 → BIZ_DATA_CHECK로 이동
              nextStep();
            }
          } catch {
            // 네트워크 오류 시 미연동으로 간주하지 않고 BIZ_DATA_CHECK로 이동
            nextStep();
          }
        }} />
      );

    case "BIZ_DATA_CHECK":
      return (
        <BizDataCheckStep
          heading="대출을 신청하기 위해서는"
          onNext={() => nextStep()}
        />
      );

    case "BIZ_INTRO":
      return (
        <IntroSection
          buttonLabel="데이터 불러오기"
          onButtonClick={() => {
            navigate("/biz-data/collect", {
              state: { returnTo: "/loan/apply?step=LOAN_CONDITIONS", startAt: "TERMS", buttonLabel: "대출 조건 입력하기", applicationId },
            });
          }}
        />
      );

    case "LOAN_CONDITIONS":
      if (!productId) return <CharacterLoadingSpinner text="상품 정보를 불러오는 중..." />;
      return (
        <LoanConditionsStep
          productId={productId}
          applicationId={applicationId ?? 0}
          onSubmit={(data) => {
            updateFormData({
              desiredAmount: data.desiredAmount,
              desiredTerm: data.desiredTerm,
              repaymentMethod: data.repaymentMethod,
              purpose: data.purpose,
            });
            nextStep();
          }}
        />
      );

    case "RESULT": {
      const resultRows = submitResult
        ? [
            { label: "신청 상품", value: submitResult.productName },
            {
              label: "신청 금액",
              value: formatAmount(submitResult.requestedAmount),
            },
            {
              label: "신청 일시",
              value: formatDateTime(submitResult.appliedAt),
            },
            {
              label: "상환 방식",
              value: REPAYMENT_LABELS[submitResult.repaymentMethod] ?? submitResult.repaymentMethod,
            },
          ]
        : [];

      return (
        <LoanApplyResult
          rows={resultRows}
          onViewApplications={() => {
            reset();
            navigate("/loan-applications", { replace: true });
          }}
          onGoHome={() => {
            reset();
            navigate("/", { replace: true });
          }}
        />
      );
    }

    default:
      return null;
  }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {showStepper && <StepProgress steps={LOAN_STEP_LABELS} currentIndex={progressIndex} />}
      <div className="flex-1 overflow-y-auto">
        {renderStep()}
      </div>

      {/* 이탈 방지 모달 */}
      {exitModal && (
        <ExitConfirmModal
          type={exitModal}
          onClose={() => setExitModal(null)}
          onConfirm={() => {
            setExitModal(null);
            navigate("/");
          }}
        />
      )}
    </div>
  );
}