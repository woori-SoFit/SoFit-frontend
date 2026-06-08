/**
 * 대출 사전 입력 페이지
 * Route: /loan/pre-apply/:productId
 * Layout: StepLayout
 */
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation, Navigate } from "react-router-dom";
import { AxiosError } from "axios";
import { useLayoutStore } from "@/stores/layoutStore";
import { useEligibilityStore } from "@/stores/eligibilityStore";
import { useCreateLoanApplication } from "@/hooks/useCreateLoanApplication";
import { useSlideStep } from "@/hooks/useSlideStep";
import { SlideTransition } from "@/components/common/SlideTransition";
import { AlertModal } from "@/components/common/AlertModal";
import { PRE_APPLY_QUESTIONS } from "@/constants/eligibilityOptions";
import preApplyIcon from "@/assets/icons/loan-pre-apply.svg";
import type { ProductFilterConditions } from "@/types/loan";
import type {
  LoanEligibilityInput,
  AnnualIncome,
  CreditScore,
  IncomeType,
  ExistingLoanAmount,
} from "@/types/eligibility";

const TOTAL = PRE_APPLY_QUESTIONS.length;
/** 선택 피드백 후 자동 전환까지 딜레이 (ms) */
const AUTO_ADVANCE_DELAY = 220;

export default function LoanPreApplyPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const filterConditions = (location.state as { filterConditions?: ProductFilterConditions } | null)
    ?.filterConditions;

  const { step, displayStep, phase, slideDir, goToStep, isTransitioning } = useSlideStep(0);

  const [errorModal, setErrorModal] = useState<{ isOpen: boolean; message: string }>({
    isOpen: false,
    message: "",
  });

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    userInput,
    setFilterConditions,
    setAnnualIncome,
    setCreditScore,
    setIncomeType,
    setExistingLoanAmount,
    reset,
  } = useEligibilityStore();

  const createMutation = useCreateLoanApplication({
    onSuccess: (data) => {
      navigate("/loan/apply", {
        state: {
          productId: Number(productId),
          applicationId: data.result.applicationId,
        },
      });
    },
    onError: (error: AxiosError) => {
      const responseData = error.response?.data as { message?: string } | undefined;
      const message = responseData?.message || "네트워크 오류가 발생했습니다. 다시 시도해 주세요.";
      setErrorModal({ isOpen: true, message });
    },
  });

  useEffect(() => {
    useLayoutStore.getState().setStepTitle("신청 가능 확인");
    useLayoutStore.getState().setOnBack(() => {
      if (step === 0) {
        navigate(-1);
      } else {
        goToStep(step - 1, "back");
      }
    });

    if (filterConditions) {
      setFilterConditions(filterConditions);
    }

    return () => {
      reset();
      useLayoutStore.getState().setOnBack(null);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (!filterConditions) {
    return <Navigate to="/loan" replace />;
  }

  const currentQuestion = PRE_APPLY_QUESTIONS[displayStep];
  const currentValue = userInput[currentQuestion.id] ?? null;
  const isLastStep = step === TOTAL - 1;

  /** 필드 값 저장 */
  const saveValue = (id: keyof LoanEligibilityInput, value: string) => {
    switch (id) {
      case "annualIncome": setAnnualIncome(value as AnnualIncome); break;
      case "creditScore": setCreditScore(value as CreditScore); break;
      case "incomeType": setIncomeType(value as IncomeType); break;
      case "existingLoanAmount": setExistingLoanAmount(value as ExistingLoanAmount); break;
    }
  };

  /** 옵션 선택 → 저장 후 자동 전환 */
  const handleSelect = (value: string) => {
    if (isTransitioning || createMutation.isPending) return;
    saveValue(currentQuestion.id, value);

    if (isLastStep) {
      // 마지막 스텝: 피드백 후 API 호출
      timerRef.current = setTimeout(() => {
        const input: LoanEligibilityInput = {
          annualIncome: (currentQuestion.id === "annualIncome" ? value : userInput.annualIncome) as AnnualIncome,
          creditScore: (currentQuestion.id === "creditScore" ? value : userInput.creditScore) as CreditScore,
          incomeType: (currentQuestion.id === "incomeType" ? value : userInput.incomeType) as IncomeType,
          existingLoanAmount: (currentQuestion.id === "existingLoanAmount" ? value : userInput.existingLoanAmount) as ExistingLoanAmount,
        };
        createMutation.mutate({
          productId: Number(productId),
          annualIncome: input.annualIncome,
          creditScore: input.creditScore,
          incomeType: input.incomeType,
          existingLoanAmt: input.existingLoanAmount,
        });
      }, AUTO_ADVANCE_DELAY);
    } else {
      timerRef.current = setTimeout(() => {
        goToStep(step + 1, "forward");
      }, AUTO_ADVANCE_DELAY);
    }
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* 상단 안내 배너 */}
      <div className="mx-5 mt-5 p-5 rounded-2xl bg-blue-50 flex items-center justify-between">
        <div>
          {/* 스텝 인디케이터 */}
          <div className="flex items-center gap-1.5 mb-3">
            {PRE_APPLY_QUESTIONS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i <= displayStep ? "bg-primary w-5" : "bg-primary/20 w-3"
                }`}
              />
            ))}
          </div>
          <h2 className="text-lg font-bold text-text-primary mb-1">
            몇 가지 <span className="text-primary">정보를</span> 확인할게요
          </h2>
          <p className="text-sm text-text-secondary">
            간단한 질문을 통해 신청 정보를 입력해요.
          </p>
        </div>
        <img src={preApplyIcon} alt="" className="w-16 h-16 shrink-0 ml-3" />
      </div>

      {/* 질문 + 옵션 — 슬라이드 영역 */}
      <div className="flex-1 px-5 pt-8 pb-4 overflow-hidden">
        <SlideTransition phase={phase} slideDir={slideDir}>
          <p className="text-base font-semibold text-text-primary mb-4 ml-1">
            {currentQuestion.label}
          </p>
          <ul className="flex flex-col gap-3">
            {currentQuestion.options.map((option) => {
              const isSelected = currentValue === option.value;
              return (
                <li key={option.value}>
                  <button
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    disabled={isTransitioning || createMutation.isPending}
                    className={`w-full px-5 py-4 rounded-xl border text-left text-sm font-medium transition-colors ${
                      isSelected
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border-default bg-white text-text-primary hover:border-primary/50"
                    }`}
                  >
                    {option.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </SlideTransition>
      </div>

      {/* API 호출 중 로딩 */}
      {createMutation.isPending && (
        <div className="px-5 pb-4 text-center">
          <p className="text-sm text-text-secondary">신청 정보를 처리 중이에요...</p>
        </div>
      )}

      {/* 에러 모달 */}
      <AlertModal
        isOpen={errorModal.isOpen}
        message={errorModal.message}
        buttonLabel="홈으로 이동"
        onConfirm={() => {
          setErrorModal({ isOpen: false, message: "" });
          navigate("/");
        }}
      />
    </div>
  );
}
