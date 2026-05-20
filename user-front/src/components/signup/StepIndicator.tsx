/**
 * StepIndicator — 회원가입 5단계 진행 상태 표시 컴포넌트
 *
 * - 완료된 스텝: 채워진 원 (클릭 시 해당 스텝으로 이동 가능)
 * - 현재 스텝: 강조된 원
 * - 미완료 스텝: 비활성 원 (클릭 무시)
 * - 현재 스텝 번호 / 총 스텝 수 표시
 */
import { useSignupStore, SIGNUP_STEP_ORDER } from '../../stores/signupStore';
import type { SignupStep } from '../../stores/signupStore';

/** 각 스텝의 한글 라벨 */
const STEP_LABELS: Record<SignupStep, string> = {
  KYC: '사업자 확인',
  CUSTOMER_VERIFY: '본인인증',
  CREDENTIALS: '계정설정',
  TERMS: '약관동의',
  CONFIRM: '완료',
};

export function StepIndicator() {
  const currentStep = useSignupStore((s) => s.currentStep);
  const setStep = useSignupStore((s) => s.setStep);

  const currentIndex = SIGNUP_STEP_ORDER.indexOf(currentStep);

  const handleStepClick = (step: SignupStep, stepIndex: number) => {
    // 미완료 스텝(현재보다 뒤) 클릭 무시
    if (stepIndex > currentIndex) return;
    // 완료된 스텝 클릭 시 해당 스텝으로 이동
    setStep(step);
  };

  return (
    <div className="w-full px-5 py-2">
      {/* 스텝 인디케이터 */}
      <div className="relative flex items-start">
        {/* 연결선 — 원형 중앙 높이에 배치 */}
        <div className="absolute top-2.5 left-0 right-0 flex px-[10%]">
          {SIGNUP_STEP_ORDER.slice(0, -1).map((_, index) => (
            <div
              key={index}
              className={`flex-1 h-0.5 ${index < currentIndex ? 'bg-primary' : 'bg-gray-200'}`}
              aria-hidden="true"
            />
          ))}
        </div>

        {SIGNUP_STEP_ORDER.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isIncomplete = index > currentIndex;

          return (
            <div key={step} className="flex-1 flex flex-col items-center relative z-10">
              <button
                type="button"
                onClick={() => handleStepClick(step, index)}
                disabled={isIncomplete}
                aria-label={`${STEP_LABELS[step]} 단계${isCompleted ? ' (완료)' : isCurrent ? ' (현재)' : ' (미완료)'}`}
                aria-current={isCurrent ? 'step' : undefined}
                className={`
                  w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium
                  transition-colors duration-200
                  ${isCompleted
                    ? 'bg-primary text-white cursor-pointer hover:bg-primary/90'
                    : isCurrent
                      ? 'bg-primary text-white ring-2 ring-primary/30 ring-offset-2'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                {isCompleted ? (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  index + 1
                )}
              </button>
              <span
                className={`
                  mt-1.5 text-[10px] whitespace-nowrap
                  ${isCompleted || isCurrent ? 'text-primary font-medium' : 'text-gray-400'}
                `}
              >
                {STEP_LABELS[step]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
