/**
 * 레이아웃 UI 상태 관리 (Zustand)
 *
 * StepLayout의 타이틀, 진행 바 등 레이아웃 수준 UI 상태를 관리
 */
import { create } from "zustand";

interface LayoutState {
  /** StepLayout 상단 헤더 타이틀 */
  stepTitle: string;
  setStepTitle: (title: string) => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
  stepTitle: "",
  setStepTitle: (title) => set({ stepTitle: title }),
}));
