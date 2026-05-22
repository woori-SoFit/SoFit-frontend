import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { createLoanApplication } from "@/api/loanApi";
import { LOAN_KEYS } from "@/constants/queryKeys";
import type {
  CreateLoanApplicationRequest,
  CreateLoanApplicationResponse,
} from "@/types/eligibility";

interface UseCreateLoanApplicationOptions {
  onSuccess?: (data: CreateLoanApplicationResponse) => void;
  onError?: (error: AxiosError) => void;
}

/**
 * 대출 신청 생성 API 호출을 위한 커스텀 훅
 * 적격 판정 후 대출 신청을 생성합니다.
 */
export function useCreateLoanApplication(options?: UseCreateLoanApplicationOptions) {
  const queryClient = useQueryClient();

  return useMutation<CreateLoanApplicationResponse, AxiosError, CreateLoanApplicationRequest>({
    mutationFn: createLoanApplication,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: LOAN_KEYS.applications() });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
}
