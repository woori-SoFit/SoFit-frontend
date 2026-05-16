/**
 * 레이아웃 UI 상태 관리 (Zustand)
 *
 * StepLayout의 타이틀, 뒤로가기 등 레이아웃 수준 UI 상태를 관리
 */
import { create } from "zustand";

interface LayoutState {
  /** StepLayout 상단 헤더 타이틀 */
  stepTitle: string;
  setStepTitle: (title: string) => void;
  /** 커스텀 뒤로가기 핸들러 — null이면 기본 navigate(-1) 동작 */
  onBack: (() => void) | null;
  setOnBack: (handler: (() => void) | null) => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
  stepTitle: "",
  setStepTitle: (title) => set({ stepTitle: title }),
  onBack: null,
  setOnBack: (handler) => set({ onBack: handler }),
}));
