import { create } from "zustand";
import type { LoanApplyStep, LoanApplyFormData } from "@/types/loan";

interface LoanApplyState {
  /** 현재 신청 step */
  currentStep: LoanApplyStep;
  /** 신청 대상 상품 ID */
  productId: number | null;
  /** 신청 폼 데이터 (step 간 누적) */
  formData: Partial<LoanApplyFormData>;

  // Actions
  setStep: (step: LoanApplyStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  setProductId: (id: number) => void;
  updateFormData: (data: Partial<LoanApplyFormData>) => void;
  reset: () => void;
}

const STEP_ORDER: LoanApplyStep[] = [
  "TERMS",
  "CERT_INFO",
  "PIN",
  "BIZ_CONFIRM",
  "MYDATA_TERMS",
  "MYDATA_LOADING",
  "LOAN_CONDITIONS",
  "RESULT",
];

const initialState = {
  currentStep: "TERMS" as LoanApplyStep,
  productId: null,
  formData: {},
};

export const useLoanApplyStore = create<LoanApplyState>((set, get) => ({
  ...initialState,

  setStep: (step) => set({ currentStep: step }),

  nextStep: () => {
    const { currentStep } = get();
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    const nextIndex = currentIndex + 1;
    if (nextIndex < STEP_ORDER.length) {
      set({ currentStep: STEP_ORDER[nextIndex] });
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      set({ currentStep: STEP_ORDER[prevIndex] });
    }
  },

  setProductId: (id) => set({ productId: id }),

  updateFormData: (data) =>
    set((state) => ({ formData: { ...state.formData, ...data } })),

  reset: () => set(initialState),
}));
