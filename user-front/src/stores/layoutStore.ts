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
  /** 커스텀 홈 버튼 핸들러 — null이면 기본 "/" 이동 */
  onHome: (() => void) | null;
  setOnHome: (handler: (() => void) | null) => void;
  /**
   * 오버레이 헤더 모드
   */
  overlayHeader: boolean;
  setOverlayHeader: (value: boolean) => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
  stepTitle: "",
  setStepTitle: (title) => set({ stepTitle: title }),
  onBack: null,
  setOnBack: (handler) => set({ onBack: handler }),
  onHome: null,
  setOnHome: (handler) => set({ onHome: handler }),
  overlayHeader: false,
  setOverlayHeader: (value) => set({ overlayHeader: value }),
}));
