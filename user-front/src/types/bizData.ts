/**
 * My Biz Data 관련 타입 정의
 */

/** My Biz Data 연결 상태 응답 */
export interface BizDataStatusResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: BizDataStatus | null;
}

/** My Biz Data 연결 상태 */
export interface BizDataStatus {
  /** My Biz Data 수집 완료 여부 */
  isConnected: boolean;
  /** 수집 완료 일시 (ISO 8601) */
  connectedAt: string | null;
}
