import { create } from "zustand";

interface MenuHubState {
  /** 현재 선택된 조회 월 (형식: "YYYY-MM") */
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  reset: () => void;
}

const initialState = {
  selectedMonth: "",
};

export const useMenuHubStore = create<MenuHubState>((set) => ({
  ...initialState,
  setSelectedMonth: (month) => set({ selectedMonth: month }),
  reset: () => set(initialState),
}));
