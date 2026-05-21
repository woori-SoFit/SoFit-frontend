import type { LoanApplication, LoanApplicationParams, PaginatedResponse } from '@/types';
import { getMockLoanApplications } from '@/mocks/loanApplications';

/**
 * 대출 신청 목록을 페이징으로 조회합니다.
 * 현재는 Mock 데이터를 반환하며, 향후 axiosInstance를 통한 실제 API 호출로 교체합니다.
 */
export async function fetchLoanApplications(
  params: LoanApplicationParams
): Promise<PaginatedResponse<LoanApplication>> {
  // TODO: 실제 API 연동 시 아래 Mock 호출을 axiosInstance 요청으로 교체
  // const response = await axiosInstance.get<PaginatedResponse<LoanApplication>>(
  //   '/api/loan-applications',
  //   { params }
  // );
  // return response.data;

  return getMockLoanApplications(params);
}
