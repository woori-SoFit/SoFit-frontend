import axiosInstance from './axiosInstance';
import type {
  LoanDetailData,
  LoanInfoTabResponse,
  LoanSummary,
  MyBizData,
  ShapResult,
  RecommendationData,
  ReviewTabData,
  ApprovalPayload,
  RejectionPayload,
  EscalationPayload,
  ManagerApprovalItem,
} from '@/types';
import {
  getMockShapResult,
  getMockRecommendation,
  getMockReviewTabData,
  getMockManagerApprovals,
  mockApproveLoan,
  mockRejectLoan,
  mockEscalateLoan,
} from '@/mocks/loanDetailMock';

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
 * 대출 신청 정보 탭 데이터를 조회합니다.
 * GET /api/admin/loan-applications/{id}/info
 */
export async function fetchLoanDetail(id: number): Promise<LoanDetailData> {
  const { data } = await axiosInstance.get<LoanInfoTabResponse>(
    `/api/admin/loan-applications/${id}/info`
  );

  return {
    id,
    applicationDate: '',
    reviewStatus: 'SUBMITTED',
    assigneeName: '',
    productInfo: {
      productName: '',
      minAmount: 0,
      maxAmount: 0,
      minInterestRate: 0,
      maxInterestRate: 0,
      minTermMonths: 0,
      maxTermMonths: 0,
      availableRepaymentMethods: [],
      availablePurposes: [],
    },
    customerInfo: data.applicantInfo,
    businessInfo: data.businessInfo,
    applicationInfo: data.applicationInfo,
    userInputInfo: data.userInputInfo,
    consentHistories: data.consentHistories,
    myBizData: null,
    cbScore: null,
    sGrade: null,
    scbScore: null,
    bonusPoints: null,
    shapResult: null,
  };
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
 * SHAP 분석 결과를 조회합니다.
 * 향후 실제 API 연동 시 axiosInstance.get(`/api/admin/loan-applications/${id}?section=sgrade`)로 교체합니다.
 */
export async function fetchShapResult(id: number): Promise<ShapResult | undefined> {
  return Promise.resolve(getMockShapResult(id));
}

/**
 * 시스템 추천값(승인 금액, 금리, 기간, 상환 방식)을 조회합니다.
 * 향후 실제 API 연동 시 axiosInstance.get(`/api/admin/loan-applications/${id}/recommendation`)로 교체합니다.
 */
export async function fetchRecommendation(id: number): Promise<RecommendationData> {
  return Promise.resolve(getMockRecommendation(id));
}

/**
 * 심사 결과 탭 전용 데이터를 조회합니다.
 * productInfo + applicationInfo + recommendation + decision 을 포함합니다.
 * 향후 실제 API 연동 시 axiosInstance.get(`/api/admin/loan-applications/${id}/review`)로 교체합니다.
 */
export async function fetchReviewTabData(id: number): Promise<ReviewTabData | undefined> {
  return Promise.resolve(getMockReviewTabData(id));
}

/**
 * 지점장 결재 대기 목록을 조회합니다.
 * 향후 실제 API 연동 시 axiosInstance.get('/api/admin/loan-applications/manager-approvals')로 교체합니다.
 */
export async function fetchManagerApprovals(): Promise<ManagerApprovalItem[]> {
  return Promise.resolve(getMockManagerApprovals());
}

// ─── 심사 처리 API (은행원/지점장 공용) ─────────────────────────────

/**
 * 대출 승인 처리를 요청합니다. (은행원/지점장 공용)
 * BE에서 세션 역할 + 건 상태로 내부 분기합니다.
 * 향후 실제 API 연동 시 axiosInstance.post(`/api/admin/loan-applications/${id}/approve`, payload)로 교체합니다.
 */
export async function approveLoan(id: number, payload: ApprovalPayload): Promise<void> {
  if (import.meta.env.DEV) console.log(`[Mock] approveLoan id=${id}`, payload);
  mockApproveLoan(id, payload);
  return Promise.resolve();
}

/**
 * 대출 거절 처리를 요청합니다. (은행원/지점장 공용)
 * BE에서 세션 역할 + 건 상태로 내부 분기합니다.
 * 향후 실제 API 연동 시 axiosInstance.post(`/api/admin/loan-applications/${id}/reject`, payload)로 교체합니다.
 */
export async function rejectLoan(id: number, payload: RejectionPayload): Promise<void> {
  if (import.meta.env.DEV) console.log(`[Mock] rejectLoan id=${id}`, payload);
  mockRejectLoan(id, payload);
  return Promise.resolve();
}

/**
 * 추가 결재 요청을 전송합니다.
 * 향후 실제 API 연동 시 axiosInstance.post(`/api/admin/loan-applications/${id}/escalate`, payload)로 교체합니다.
 */
export async function requestEscalation(id: number, payload: EscalationPayload): Promise<void> {
  if (import.meta.env.DEV) console.log(`[Mock] requestEscalation id=${id}`, payload);
  mockEscalateLoan(id, payload);
  return Promise.resolve();
}
