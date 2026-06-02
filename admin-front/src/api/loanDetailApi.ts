import axiosInstance from './axiosInstance';
import type {
  LoanInfoTabResponse,
  LoanSummary,
  MyBizData,
  SGradeTabResponse,
  ReviewTabData,
  ApprovalPayload,
  RejectionPayload,
  ReviewDecisionResponse,
  ManagerApprovalItem,
} from '@/types';

// ─── 조회 API ───────────────────────────────────────────────────

/**
 * 대출 신청 공통 정보(헤더용)를 조회합니다.
 * GET /api/admin/loan-applications/{id}
 */
export async function fetchLoanSummary(id: number): Promise<LoanSummary> {
  const { data } = await axiosInstance.get<LoanSummary>(
    `/api/admin/loan-applications/${id}`
  );
  return data;
}

/**
 * 정보 탭 데이터를 조회합니다.
 * GET /api/admin/loan-applications/{id}/info
 */
export async function fetchInfoTab(id: number): Promise<LoanInfoTabResponse> {
  const { data } = await axiosInstance.get<LoanInfoTabResponse>(
    `/api/admin/loan-applications/${id}/info`
  );
  return data;
}

/**
 * My Biz Data 탭 데이터를 조회합니다.
 * GET /api/admin/loan-applications/{id}/mybiz-data
 */
export async function fetchMyBizData(id: number): Promise<MyBizData> {
  const { data } = await axiosInstance.get<MyBizData>(
    `/api/admin/loan-applications/${id}/mybiz-data`
  );
  return data;
}

/**
 * S등급 분석 탭 데이터를 조회합니다.
 * GET /api/admin/loan-applications/{id}/grade
 */
export async function fetchSGradeTab(id: number): Promise<SGradeTabResponse> {
  const { data } = await axiosInstance.get<SGradeTabResponse>(
    `/api/admin/loan-applications/${id}/grade`
  );
  return data;
}

/**
 * 심사 결과 탭 전용 데이터를 조회합니다.
 * GET /api/admin/loan-applications/{id}/review
 */
export async function fetchReviewTabData(id: number): Promise<ReviewTabData> {
  const { data } = await axiosInstance.get<ReviewTabData>(
    `/api/admin/loan-applications/${id}/review`
  );
  return data;
}

/**
 * 지점장 결재 대기 목록을 조회합니다.
 * GET /api/admin/manager/loan-applications
 */
export async function fetchManagerApprovals(): Promise<ManagerApprovalItem[]> {
  const { data } = await axiosInstance.get<{ applications: ManagerApprovalItem[] }>(
    '/api/admin/manager/loan-applications'
  );
  return data.applications ?? [];
}

// ─── 심사 처리 API (은행원/지점장 공용) ─────────────────────────────

/**
 * 대출 승인 처리를 요청합니다. (은행원/지점장 공용)
 * BE에서 세션 역할 + 건 상태로 내부 분기합니다.
 * POST /api/admin/loan-applications/{id}/approve
 */
export async function approveLoan(id: number, payload: ApprovalPayload): Promise<ReviewDecisionResponse> {
  const { data } = await axiosInstance.post<ReviewDecisionResponse>(
    `/api/admin/loan-applications/${id}/approve`,
    payload
  );
  return data;
}

/**
 * 대출 거절 처리를 요청합니다. (은행원/지점장 공용)
 * BE에서 세션 역할 + 건 상태로 내부 분기합니다.
 * POST /api/admin/loan-applications/{id}/reject
 */
export async function rejectLoan(id: number, payload: RejectionPayload): Promise<ReviewDecisionResponse> {
  const { data } = await axiosInstance.post<ReviewDecisionResponse>(
    `/api/admin/loan-applications/${id}/reject`,
    payload
  );
  return data;
}
