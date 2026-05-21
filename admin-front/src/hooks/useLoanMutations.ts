import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LOAN_KEYS } from '@/constants/queryKeys';
import {
  approveLoan,
  rejectLoan,
  requestEscalation,
  managerApproveLoan,
  managerRejectLoan,
} from '@/api/loanDetailApi';
import type { ApprovalPayload, RejectionPayload, EscalationPayload } from '@/types';

export interface UseLoanMutationsReturn {
  /** 대출 승인 mutation */
  approve: ReturnType<typeof useMutation<void, Error, ApprovalPayload>>;
  /** 대출 거절 mutation */
  reject: ReturnType<typeof useMutation<void, Error, RejectionPayload>>;
  /** 추가 결재 요청 mutation */
  escalate: ReturnType<typeof useMutation<void, Error, EscalationPayload>>;
  /** 지점장 결재 승인 mutation */
  managerApprove: ReturnType<typeof useMutation<void, Error, ApprovalPayload>>;
  /** 지점장 결재 거절 mutation */
  managerReject: ReturnType<typeof useMutation<void, Error, RejectionPayload>>;
}

/**
 * 대출 심사 처리 관련 mutation 훅.
 * 승인, 거절, 추가 결재 요청, 지점장 승인/거절을 처리하며,
 * 성공 시 관련 queryKey를 invalidate하여 UI를 갱신합니다.
 */
export function useLoanMutations(id: number): UseLoanMutationsReturn {
  const queryClient = useQueryClient();

  /** 성공 시 관련 쿼리 캐시를 무효화합니다. */
  const invalidateRelatedQueries = () => {
    queryClient.invalidateQueries({ queryKey: LOAN_KEYS.detail(id) });
    queryClient.invalidateQueries({ queryKey: LOAN_KEYS.managerApprovals() });
    queryClient.invalidateQueries({ queryKey: LOAN_KEYS.applications() });
  };

  const approve = useMutation<void, Error, ApprovalPayload>({
    mutationFn: (payload) => approveLoan(id, payload),
    onSuccess: invalidateRelatedQueries,
  });

  const reject = useMutation<void, Error, RejectionPayload>({
    mutationFn: (payload) => rejectLoan(id, payload),
    onSuccess: invalidateRelatedQueries,
  });

  const escalate = useMutation<void, Error, EscalationPayload>({
    mutationFn: (payload) => requestEscalation(id, payload),
    onSuccess: invalidateRelatedQueries,
  });

  const managerApprove = useMutation<void, Error, ApprovalPayload>({
    mutationFn: (payload) => managerApproveLoan(id, payload),
    onSuccess: invalidateRelatedQueries,
  });

  const managerReject = useMutation<void, Error, RejectionPayload>({
    mutationFn: (payload) => managerRejectLoan(id, payload),
    onSuccess: invalidateRelatedQueries,
  });

  return {
    approve,
    reject,
    escalate,
    managerApprove,
    managerReject,
  };
}
