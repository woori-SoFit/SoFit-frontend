import type { LoanApplication, LoanApplicationParams, LoanStatusCounts, PaginatedResponse } from '@/types';
import { getMockLoanApplications, getMockLoanStatusCounts } from '@/mocks/loanApplications';

/**
 * 대출 신청 목록을 페이징으로 조회합니다.
 * 현재는 Mock 데이터를 반환하며, 향후 axiosInstance를 통한 실제 API 호출로 교체합니다.
 */
export async function fetchLoanApplications(
  params: LoanApplicationParams
): Promise<PaginatedResponse<LoanApplication>> {
  // TODO: 실제 API 연동 시 아래 Mock 호출을 axiosInstance 요청으로 교체
  return getMockLoanApplications(params);
}

/**
 * 대출 신청 상태별 건수를 조회합니다.
 * 현재는 Mock 데이터를 반환하며, 향후 실제 API 호출로 교체합니다.
 */
export async function fetchLoanStatusCounts(): Promise<LoanStatusCounts> {
  // TODO: 실제 API 연동 시 axiosInstance 요청으로 교체
  return getMockLoanStatusCounts();
}
