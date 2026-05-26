/**
 * 성장 S등급 분석 리포트 step 상태 관리 (Zustand)
 *
 * Step 순서:
 *   INTRO       → 서비스 소개
 *   BIZ_CHECK   → My Biz Data 확인
 *   LOADING     → S등급 산출 대기
 *   RESULT      → 등급 결과
 */
import { create } from "zustand";

export type GradeReportStep = "INTRO" | "BIZ_CHECK" | "LOADING" | "RESULT";

interface GradeReportState {
  /** 현재 step */
  currentStep: GradeReportStep;

  // Actions
  setStep: (step: GradeReportStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
}

const STEP_ORDER: GradeReportStep[] = [
  "INTRO",
  "BIZ_CHECK",
  "LOADING",
  "RESULT",
];

const initialState = {
  currentStep: "INTRO" as GradeReportStep,
};

export const useGradeReportStore = create<GradeReportState>((set, get) => ({
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
}));
