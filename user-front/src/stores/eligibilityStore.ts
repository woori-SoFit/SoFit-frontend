import { create } from "zustand";
import type { ProductFilterConditions } from "@/types/loan";
import type {
  LoanEligibilityInput,
  AnnualIncome,
  CreditScore,
  IncomeType,
  ExistingLoanAmount,
} from "@/types/eligibility";

interface EligibilityState {
  /** 상품 필터 조건 (상세 페이지에서 전달받음) */
  filterConditions: ProductFilterConditions | null;
  /** 사용자 입력값 */
  userInput: Partial<LoanEligibilityInput>;

  // Actions
  setFilterConditions: (filter: ProductFilterConditions) => void;
  setAnnualIncome: (value: AnnualIncome) => void;
  setCreditScore: (value: CreditScore) => void;
  setIncomeType: (value: IncomeType) => void;
  setExistingLoanAmount: (value: ExistingLoanAmount) => void;
  reset: () => void;
}

const initialState = {
  filterConditions: null as ProductFilterConditions | null,
  userInput: {} as Partial<LoanEligibilityInput>,
};

export const useEligibilityStore = create<EligibilityState>((set) => ({
  ...initialState,

  setFilterConditions: (filter) => set({ filterConditions: filter }),

  setAnnualIncome: (value) =>
    set((state) => ({ userInput: { ...state.userInput, annualIncome: value } })),

  setCreditScore: (value) =>
    set((state) => ({ userInput: { ...state.userInput, creditScore: value } })),

  setIncomeType: (value) =>
    set((state) => ({ userInput: { ...state.userInput, incomeType: value } })),

  setExistingLoanAmount: (value) =>
    set((state) => ({ userInput: { ...state.userInput, existingLoanAmount: value } })),

  reset: () => set(initialState),
}));
