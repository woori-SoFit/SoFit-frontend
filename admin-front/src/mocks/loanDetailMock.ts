import type { ManagerApprovalItem } from '@/types';

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

// ─── 공개 함수 ────────────────────────────────────────────────────

/**
 * MANAGER_REVIEW 상태인 건 목록을 반환합니다.
 * 향후 실제 API 연동 시 교체 예정.
 */
export function getMockManagerApprovals(): ManagerApprovalItem[] {
  return MOCK_MANAGER_APPROVALS;
}
