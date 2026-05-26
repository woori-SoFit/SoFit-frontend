/**
 * 대출 사전 입력(신청 가능 확인) 페이지
 * Route: /loan/pre-apply/:productId
 * Layout: StepLayout
 *
 * 간단한 질문을 통해 신청 가능 여부를 사전 확인
 * 확인하기 버튼 클릭 시 적격/부적격 분기 처리
 */
import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation, Navigate } from "react-router-dom";
import { ChevronRight, XCircle } from "lucide-react";
import { AxiosError } from "axios";
import { useLayoutStore } from "@/stores/layoutStore";
import { useEligibilityStore } from "@/stores/eligibilityStore";
import { useCreateLoanApplication } from "@/hooks/useCreateLoanApplication";
import { checkLoanAvailable } from "@/utils/checkLoanAvailable";
import { BottomButton } from "@/components/common/BottomButton";
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

/** 페이지 상태 */
type PageState = "INPUT" | "REJECTED";

export default function LoanPreApplyPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // navigation state에서 filterConditions 수신
  const filterConditions = (location.state as { filterConditions?: ProductFilterConditions } | null)
    ?.filterConditions;

  // 페이지 상태 관리
  const [pageState, setPageState] = useState<PageState>("INPUT");

  // Zustand 스토어
  const {
    userInput,
    setFilterConditions,
    setAnnualIncome,
    setCreditScore,
    setIncomeType,
    setExistingLoanAmount,
    reset,
  } = useEligibilityStore();

  // 대출 신청 생성 mutation
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
      alert(message);
    },
  });

  // 마운트 시 filterConditions 스토어에 저장
  useEffect(() => {
    useLayoutStore.getState().setStepTitle("신청 가능 확인");

    if (filterConditions) {
      setFilterConditions(filterConditions);
    }

    return () => {
      reset();
    };
  }, []);

  // filterConditions 미전달 시 상품 목록으로 리다이렉트
  if (!filterConditions) {
    return <Navigate to="/loan" replace />;
  }

  // 4개 항목 모두 선택되었는지 확인
  const allAnswered =
    userInput.annualIncome !== undefined &&
    userInput.creditScore !== undefined &&
    userInput.incomeType !== undefined &&
    userInput.existingLoanAmount !== undefined;

  /** 필드별 선택 핸들러 */
  const handleSelect = (fieldId: keyof LoanEligibilityInput, value: string) => {
    switch (fieldId) {
      case "annualIncome":
        setAnnualIncome(value as AnnualIncome);
        break;
      case "creditScore":
        setCreditScore(value as CreditScore);
        break;
      case "incomeType":
        setIncomeType(value as IncomeType);
        break;
      case "existingLoanAmount":
        setExistingLoanAmount(value as ExistingLoanAmount);
        break;
    }
  };

  /** 확인하기 버튼 클릭 핸들러 */
  const handleSubmit = () => {
    if (!allAnswered || createMutation.isPending) return;

    const input: LoanEligibilityInput = {
      annualIncome: userInput.annualIncome!,
      creditScore: userInput.creditScore!,
      incomeType: userInput.incomeType!,
      existingLoanAmount: userInput.existingLoanAmount!,
    };

    // 적격 검증
    const result = checkLoanAvailable(input, filterConditions);

    if (result.eligible === false) {
      setPageState("REJECTED");
      return;
    }

    // 적격: 대출 신청 생성 API 호출
    createMutation.mutate({
      productId: Number(productId),
      annualIncome: input.annualIncome,
      creditScore: input.creditScore,
      incomeType: input.incomeType,
      existingLoanAmt: input.existingLoanAmount,
    });
  };

  // 부적격 거절 안내 UI
  if (pageState === "REJECTED") {
    return (
      <div className="flex flex-col min-h-full">
        <div className="flex-1 px-5 pt-20">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-10 rounded-full bg-red-50 flex items-center justify-center">
              <XCircle size={40} className="text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-text-primary mb-3">
              대출 신청이 어려워요
            </h2>
            <p className="text-sm text-text-secondary">
              내부 대출 신청 기준에 부합하지 않습니다.<br />
              다른 상품을 확인해 보세요.
            </p>
          </div>
        </div>

        <BottomButton
          label="돌아가기"
          onClick={() => navigate(`/loan`)}
        />
      </div>
    );
  }

  // 입력 화면
  return (
    <div className="flex flex-col min-h-full">
      {/* 상단 안내 배너 */}
      <div className="mx-5 mt-6 p-5 rounded-2xl bg-blue-50 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-text-primary mb-1">
            몇 가지 <span className="text-primary">정보를</span> 확인할게요
          </h2>
          <p className="text-sm text-text-secondary">
            간단한 질문을 통해 신청 가능 여부를<br />먼저 확인해요.
          </p>
        </div>
        <img src={preApplyIcon} alt="" className="w-16 h-16 shrink-0 ml-3" />
      </div>

      {/* 질문 목록 */}
      <div className="flex-1 px-5 pt-6 pb-4">
        <ul className="flex flex-col gap-8">
          {PRE_APPLY_QUESTIONS.map((question) => (
            <li key={question.id}>
              <p className="text-base font-semibold text-text-primary mb-3">
                {question.label}
              </p>
              <SelectButton
                options={question.options}
                selectedValue={userInput[question.id] ?? null}
                onSelect={(value) => handleSelect(question.id, value)}
              />
            </li>
          ))}
        </ul>
      </div>

      {/* 확인하기 버튼 */}
      <BottomButton
        label={createMutation.isPending ? "확인 중..." : "확인하기"}
        onClick={handleSubmit}
        disabled={!allAnswered || createMutation.isPending}
      />
    </div>
  );
}

/** 선택 버튼 컴포넌트 — 드롭다운이 다른 요소 위에 열림 */
function SelectButton({
  options,
  selectedValue,
  onSelect,
}: {
  options: { label: string; value: string }[];
  selectedValue: string | null;
  onSelect: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedLabel = options.find((opt) => opt.value === selectedValue)?.label ?? null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl border border-border-default bg-white text-left transition-colors hover:border-primary"
      >
        <span className={`text-sm ${selectedLabel ? "font-medium" : "text-text-disabled"}`}>
          {selectedLabel || "선택해 주세요"}
        </span>
        <ChevronRight size={18} className={`transition-transform ${isOpen ? "rotate-90" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 right-0 mt-2 z-50 flex flex-col gap-2 bg-white rounded-xl shadow-modal p-2">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onSelect(option.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center px-4 py-3 rounded-lg text-left text-sm transition-colors ${
                  selectedValue === option.value
                    ? "bg-blue-50 text-primary font-medium"
                    : "text-text-primary hover:bg-gray-50"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
