import axiosInstance from './axiosInstance';
import type {
  LoanApplicationListRequest,
  LoanApplicationListResponse,
} from '@/types/loan';
import type { LoanStatusCounts } from '@/types';

/**
 * 대출 신청 목록을 페이징으로 조회합니다.
 * GET /api/admin/loan-applications
 */
export async function fetchLoanApplications(
  params: LoanApplicationListRequest
): Promise<LoanApplicationListResponse> {
  const { data } = await axiosInstance.get<LoanApplicationListResponse>(
    '/api/admin/loan-applications',
    { params }
  );
  return data;
}

/**
 * 대출 신청 상태별 건수를 조회합니다.
 * TODO: API 구현 완료 후 실제 호출로 교체
 */
export async function fetchLoanStatusCounts(): Promise<LoanStatusCounts> {
  return {
    pending: 0,
    managerReview: 0,
    approved: 0,
    rejected: 0,
  };
}
