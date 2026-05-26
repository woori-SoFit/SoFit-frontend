import { create } from "zustand";
import type { BizDataCollectStep } from "@/types/bizData";

interface BizDataCollectState {
  /** 현재 수집 step */
  currentStep: BizDataCollectStep;

  // Actions
  setStep: (step: BizDataCollectStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
}

const STEP_ORDER: BizDataCollectStep[] = [
  "CERT_INFO",
  "TERMS",
  "LOADING",
];

const initialState = {
  currentStep: "CERT_INFO" as BizDataCollectStep,
};

export const useBizDataCollectStore = create<BizDataCollectState>(
  (set, get) => ({
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

    reset: () => set(initialState),
  })
);
