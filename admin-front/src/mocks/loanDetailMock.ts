import type {
  ManagerApprovalItem,
  ReviewDecision,
  ApprovalPayload,
  RejectionPayload,
  EscalationPayload,
} from '@/types';

// ─── Mock 지점장 결재 목록 데이터 ───────────────────────────────────

const MOCK_MANAGER_APPROVALS: ManagerApprovalItem[] = [
  {
    id: 2,
    applicationDate: '2024-05-23',
    applicantName: '박지은',
    businessName: '지은테크',
    productName: '소상공인 성장 대출',
    requestedByName: '이담당',
    requestedAmount: 100_000_000,
  },
  {
    id: 4,
    applicationDate: '2024-05-23',
    applicantName: '장유진',
    businessName: '유진상사',
    productName: '소상공인 운전자금 대출',
    requestedByName: '김은행',
    requestedAmount: 70_000_000,
  },
  {
    id: 10,
    applicationDate: '2024-05-20',
    applicantName: '장미영',
    businessName: '미영식품',
    productName: '소상공인 성장 대출',
    requestedByName: '김은행',
    requestedAmount: 45_000_000,
  },
];

// ─── Mock 심사 이력 저장소 ───────────────────────────────────────

const MOCK_DECISIONS: Record<number, ReviewDecision[]> = {};

// ─── 공개 함수 (조회) ────────────────────────────────────────────

/**
 * MANAGER_REVIEW 상태인 건 목록을 반환합니다.
 */
export function getMockManagerApprovals(): ManagerApprovalItem[] {
  return MOCK_MANAGER_APPROVALS;
}

// ─── 공개 함수 (뮤테이션) ────────────────────────────────────────

/**
 * Mock 승인 처리: 지점장 결재 목록에서 제거하고 심사 이력을 기록합니다.
 */
export function mockApproveLoan(id: number, payload: ApprovalPayload): void {
  // 심사 이력 추가
  if (!MOCK_DECISIONS[id]) MOCK_DECISIONS[id] = [];
  MOCK_DECISIONS[id].push({
    status: 'APPROVED',
    comment: payload.comment ?? '',
    reviewerName: '담당자',
    reviewerRole: 'ADMIN_BANK_TELLER',
    decidedAt: new Date().toISOString(),
  });

  // 지점장 결재 목록에서 제거
  const approvalIdx = MOCK_MANAGER_APPROVALS.findIndex((item) => item.id === id);
  if (approvalIdx !== -1) {
    MOCK_MANAGER_APPROVALS.splice(approvalIdx, 1);
  }
}

/**
 * Mock 거절 처리: 지점장 결재 목록에서 제거하고 심사 이력을 기록합니다.
 */
export function mockRejectLoan(id: number, payload: RejectionPayload): void {
  // 심사 이력 추가
  if (!MOCK_DECISIONS[id]) MOCK_DECISIONS[id] = [];
  MOCK_DECISIONS[id].push({
    status: 'REJECTED',
    comment: payload.comment,
    reviewerName: '담당자',
    reviewerRole: 'ADMIN_BANK_TELLER',
    decidedAt: new Date().toISOString(),
  });

  // 지점장 결재 목록에서 제거
  const approvalIdx = MOCK_MANAGER_APPROVALS.findIndex((item) => item.id === id);
  if (approvalIdx !== -1) {
    MOCK_MANAGER_APPROVALS.splice(approvalIdx, 1);
  }
}

/**
 * Mock 에스컬레이션 처리: MANAGER_REVIEW 상태로 변경하고 결재 목록에 추가합니다.
 */
export function mockEscalateLoan(id: number, payload: EscalationPayload): void {
  // 심사 이력 추가
  if (!MOCK_DECISIONS[id]) MOCK_DECISIONS[id] = [];
  MOCK_DECISIONS[id].push({
    status: 'MANAGER_REVIEW',
    comment: payload.comment,
    reviewerName: '담당자',
    reviewerRole: 'ADMIN_BANK_TELLER',
    decidedAt: new Date().toISOString(),
  });

  // 이미 결재 목록에 있으면 중복 추가하지 않음
  const alreadyExists = MOCK_MANAGER_APPROVALS.some((item) => item.id === id);
  if (!alreadyExists) {
    MOCK_MANAGER_APPROVALS.push({
      id,
      applicationDate: new Date().toISOString().slice(0, 10),
      applicantName: '-',
      businessName: '-',
      productName: '-',
      requestedByName: '담당자',
      requestedAmount: 0,
    });
  }
}
