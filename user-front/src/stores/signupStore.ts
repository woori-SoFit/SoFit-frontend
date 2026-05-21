import { create } from "zustand";

/** 회원가입 스텝 타입 */
export type SignupStep =
  | "KYC"
  | "CUSTOMER_VERIFY"
  | "CREDENTIALS"
  | "TERMS"
  | "CONFIRM";

/** 회원가입 폼 데이터 인터페이스 */
export interface SignupFormData {
  // Step 1: KYC
  businessRegistrationNumber: string;
  // Step 2: Customer Verify
  name: string;
  residentNumber: string;
  phone: string;
  // Step 3: Credentials
  loginId: string;
  password: string;
  // Step 4: Terms
  agreedTermIds: number[];
}

interface SignupState {
  /** 현재 회원가입 스텝 */
  currentStep: SignupStep;
  /** 회원가입 폼 데이터 (스텝 간 누적) */
  formData: Partial<SignupFormData>;

  // Actions
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: SignupStep) => void;
  updateFormData: (data: Partial<SignupFormData>) => void;
  clearSensitiveData: () => void;
  reset: () => void;
}

/** 회원가입 스텝 순서 상수 */
export const SIGNUP_STEP_ORDER: SignupStep[] = [
  "KYC",
  "CUSTOMER_VERIFY",
  "CREDENTIALS",
  "TERMS",
  "CONFIRM",
];

const initialState = {
  currentStep: "KYC" as SignupStep,
  formData: {} as Partial<SignupFormData>,
};

export const useSignupStore = create<SignupState>((set, get) => ({
  ...initialState,

  nextStep: () => {
    const { currentStep } = get();
    const currentIndex = SIGNUP_STEP_ORDER.indexOf(currentStep);
    // CONFIRM(마지막 스텝)이면 변경 없음
    if (currentStep === "CONFIRM") return;
    const nextIndex = currentIndex + 1;
    if (nextIndex < SIGNUP_STEP_ORDER.length) {
      set({ currentStep: SIGNUP_STEP_ORDER[nextIndex] });
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    // KYC(첫 번째 스텝)이면 변경 없음 — 네비게이션은 컴포넌트에서 처리
    if (currentStep === "KYC") return;
    const currentIndex = SIGNUP_STEP_ORDER.indexOf(currentStep);
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      set({ currentStep: SIGNUP_STEP_ORDER[prevIndex] });
    }
  },

  setStep: (step) => {
    const { currentStep } = get();
    const currentIndex = SIGNUP_STEP_ORDER.indexOf(currentStep);
    const targetIndex = SIGNUP_STEP_ORDER.indexOf(step);
    // 현재 스텝보다 뒤에 있는 미완료 스텝으로의 직접 이동 차단
    if (targetIndex > currentIndex) return;
    set({ currentStep: step });
  },

  updateFormData: (data) =>
    set((state) => ({ formData: { ...state.formData, ...data } })),

  clearSensitiveData: () =>
    set((state) => ({
      formData: {
        ...state.formData,
        password: undefined,
      },
    })),

  reset: () => set({ ...initialState, formData: {} }),
}));
