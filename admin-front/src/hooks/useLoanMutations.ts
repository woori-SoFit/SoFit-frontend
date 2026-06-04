import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LOAN_KEYS } from '@/constants/queryKeys';
import {
  approveLoan,
  rejectLoan,
} from '@/api/loanDetailApi';
import type { ApprovalPayload, RejectionPayload, ReviewDecisionResponse } from '@/types';

export interface UseLoanMutationsOptions {
  /** mutation 성공 시 호출할 외부 콜백 */
  onSuccess?: () => void;
}

export interface UseLoanMutationsReturn {
  /** 대출 승인 mutation (은행원 → MANAGER_REVIEW, 지점장 → APPROVED) */
  approve: ReturnType<typeof useMutation<ReviewDecisionResponse, Error, ApprovalPayload>>;
  /** 대출 거절 mutation (은행원 → MANAGER_REVIEW, 지점장 → REJECTED) */
  reject: ReturnType<typeof useMutation<ReviewDecisionResponse, Error, RejectionPayload>>;
}

/**
 * 대출 심사 처리 관련 mutation 훅.
 * 승인, 거절을 처리하며,
 * 성공 시 관련 queryKey를 invalidate하여 UI를 갱신합니다.
 * BE에서 세션 역할 + 건 상태로 은행원/지점장 처리를 내부 분기합니다.
 */
export function useLoanMutations(id: number, options?: UseLoanMutationsOptions): UseLoanMutationsReturn {
  const queryClient = useQueryClient();

  /** 성공 시 관련 쿼리 캐시를 무효화하고, 외부 콜백을 실행합니다. */
  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: LOAN_KEYS.summary(id) });
    queryClient.invalidateQueries({ queryKey: LOAN_KEYS.detail(id) });
    queryClient.invalidateQueries({ queryKey: LOAN_KEYS.reviewTab(id) });
    queryClient.invalidateQueries({ queryKey: LOAN_KEYS.managerApprovals() });
    queryClient.invalidateQueries({ queryKey: LOAN_KEYS.applications() });
    options?.onSuccess?.();
  };

  const approve = useMutation<ReviewDecisionResponse, Error, ApprovalPayload>({
    mutationFn: (payload) => approveLoan(id, payload),
    onSuccess: handleSuccess,
  });

  const reject = useMutation<ReviewDecisionResponse, Error, RejectionPayload>({
    mutationFn: (payload) => rejectLoan(id, payload),
    onSuccess: handleSuccess,
  });

  return {
    approve,
    reject,
  };
}
