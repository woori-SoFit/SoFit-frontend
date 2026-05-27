/** 에러 로그 레벨 */
export type ErrorLevel = 'ERROR' | 'WARN';

/** 에러 로그 항목 */
export interface ErrorLogItem {
  id: number;
  /** 에러 레벨 */
  level: ErrorLevel;
  /** 발생 서버명 (예: "user_back", "admin_back") */
  serverName: string;
  /** 커스텀 에러 코드 (예: "LOAN4001", "AUTH5001") */
  errorCode: string;
  /** 예외 클래스명 */
  errorClass: string;
  /** 에러 메시지 */
  message: string;
  /** 요청 엔드포인트 */
  endpoint: string;
  /** HTTP 메서드 */
  httpMethod: string;
  /** HTTP 상태 코드 */
  statusCode: number;
  /** 관련 대출 신청 ID (없을 수 있음) */
  loanApplicationId: string | null;
  /** 스택 트레이스 */
  stackTrace: string;
  /** 발생 일시 (ISO 8601) */
  occurredAt: string;
}

/** 에러 로그 목록 페이징 응답 */
export interface PaginatedErrorLogResponse {
  errors: ErrorLogItem[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  size: number;
}

/** 에러 로그 목록 조회 파라미터 */
export interface ErrorLogListParams {
  page: number;
  size: number;
  level?: ErrorLevel;
  serverName?: string;
  keyword?: string;
}
