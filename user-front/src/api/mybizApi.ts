import axiosInstance from "./axiosInstance";
import type { BizDashboardData } from "@/types/bizData";
import type { MyBizApiResponse, LoanExecutionResult } from "@/types/mybizApi";

// ─── 공개 API 함수 ────────────────────────────────────────────────

/** 마이비즈 데이터 연동 완료 처리. POST /api/businesses/me/mybiz-connect */
export async function connectMyBiz(): Promise<void> {
  await axiosInstance.post("/businesses/me/mybiz-connect");
}

/** 마이비즈 대시보드 조회. month 미지정 시 최신 월 데이터 반환 */
export async function fetchMyBizDashboard(month?: string): Promise<BizDashboardData> {
  const params = month ? { month } : {};
  const res = await axiosInstance.get<MyBizApiResponse<BizDashboardData>>(
    "/mybiz/dashboard",
    { params }
  );
  return res.data.result;
}

/**
 * 마이비즈 데이터 연결 여부 확인.
 * GET /api/report/mybiz-status
 *
 * @throws 네트워크 오류 시 예외를 그대로 throw (호출부에서 처리)
 */
export async function checkMyBizConnected(): Promise<boolean> {
  const res = await axiosInstance.get<MyBizApiResponse<{ isMybizConnected: boolean }>>(
    "/report/mybiz-status"
  );
  return res.data.result.isMybizConnected;
}

/**
 * 실행된 대출 잔액 조회.
 * 완료 목록에서 EXECUTED 상태 대출의 실행 금액을 가져옴.
 */
export async function fetchLoanBalance(): Promise<{
  loanBalance: number;
  loanRepaymentDate: string;
}> {
  try {
    const listRes = await axiosInstance.get<
      MyBizApiResponse<{
        loanApplications: Array<{ applicationId: number; status: string }>;
      }>
    >("/loan-applications/completed");

    const executedLoan = listRes.data.result.loanApplications.find(
      (l) => l.status === "EXECUTED"
    );
    if (!executedLoan) return { loanBalance: 0, loanRepaymentDate: "-" };

    const execRes = await axiosInstance.get<MyBizApiResponse<LoanExecutionResult>>(
      `/loan-applications/${executedLoan.applicationId}/execution`
    );
    return {
      loanBalance: execRes.data.result.executedAmount,
      loanRepaymentDate: "-",
    };
  } catch {
    return { loanBalance: 0, loanRepaymentDate: "-" };
  }
}
