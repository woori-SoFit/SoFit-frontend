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
 * 대출 신청 상태별 건수(통계)를 조회합니다.
 * GET /api/admin/loan-applications/statistics
 */
export async function fetchLoanStatusCounts(): Promise<LoanStatusCounts> {
  const { data } = await axiosInstance.get<LoanStatusCounts>(
    '/api/admin/loan-applications/statistics'
  );
  return data;
}
