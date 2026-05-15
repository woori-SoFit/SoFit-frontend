/**
 * 대출 사전 입력(신청 가능 확인) 페이지
 * Route: /loan/pre-apply/:productId
 * Layout: StepLayout
 *
 * 간단한 질문을 통해 신청 가능 여부를 사전 확인
 * 확인하기 버튼 클릭 시 승인/거절 분기 처리
 *
 * TODO: API 연동 시 사전 심사 API 호출로 교체
 */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useLayoutStore } from "@/stores/layoutStore";
import { BottomButton } from "@/components/common/BottomButton";
import preApplyIcon from "@/assets/icons/loan-pre-apply.svg";

/** 질문 항목 타입 */
interface PreApplyQuestion {
  id: string;
  label: string;
  options: string[];
}

/** 사전 입력 질문 목록 */
const QUESTIONS: PreApplyQuestion[] = [
  {
    id: "income",
    label: "연 소득은 얼마인가요?",
    options: ["3천만원 이하", "3천만원 초과 ~ 5천만원 이하", "5천만원 초과 ~ 1억 이하", "1억 초과"],
  },
  {
    id: "creditScore",
    label: "신용점수는 몇 점인가요?",
    options: ["850점 이하", "850점 초과", "모름"],
  },
  {
    id: "incomeType",
    label: "어떤 소득으로 갚을 예정인가요?",
    options: ["급여 소득", "사업 소득", "기타 소득"],
  },
  {
    id: "existingLoan",
    label: "가지고 있는 대출이 있나요?",
    options: ["1억 이하", "1억 초과", "없음"],
  },
];

export default function LoanPreApplyPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    useLayoutStore.getState().setStepTitle("신청 가능 확인");
  }, []);

  const handleSelect = (questionId: string, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const allAnswered = QUESTIONS.every((q) => answers[q.id]);

  const handleSubmit = () => {
    if (!allAnswered) return;

    // TODO: API 연동 시 사전 심사 API 호출
    // 임시로 항상 승인 → 대출 신청 페이지로 이동
    navigate("/loan/apply", { state: { productId: Number(productId) } });
  };

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
          {QUESTIONS.map((question) => (
            <li key={question.id}>
              <p className="text-base font-semibold text-text-primary mb-3">
                {question.label}
              </p>
              <SelectButton
                options={question.options}
                selected={answers[question.id] || null}
                onSelect={(option) => handleSelect(question.id, option)}
              />
            </li>
          ))}
        </ul>
      </div>

      {/* 확인하기 버튼 */}
      <BottomButton
        label="확인하기"
        onClick={handleSubmit}
        disabled={!allAnswered}
      />
    </div>
  );
}

/** 선택 버튼 컴포넌트 — 드롭다운이 다른 요소 위에 열림 */
function SelectButton({
  options,
  selected,
  onSelect,
}: {
  options: string[];
  selected: string | null;
  onSelect: (option: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* 트리거 버튼 */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl border border-border-default bg-white text-left transition-colors hover:border-primary"
      >
        <span className={`text-sm ${selected ? "font-medium" : "text-text-disabled"}`}>
          {selected || "선택해 주세요"}
        </span>
        <ChevronRight size={18} className={`transition-transform ${isOpen ? "rotate-90" : ""}`} />
      </button>

      {/* 드롭다운 옵션 — absolute로 다른 요소 위에 표시 */}
      {isOpen && (
        <>
          {/* 배경 클릭 시 닫기 */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          <div className="absolute top-full left-0 right-0 mt-2 z-50 flex flex-col gap-2 bg-white rounded-xl shadow-modal p-2">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onSelect(option);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center px-4 py-3 rounded-lg text-left text-sm transition-colors ${
                  selected === option
                    ? "bg-blue-50 text-primary font-medium"
                    : "text-text-primary hover:bg-gray-50"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
