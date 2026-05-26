import type { ErrorLogItem, ErrorLogListParams, PaginatedErrorLogResponse } from '@/types/errorLog';

const MOCK_ERROR_LOGS: ErrorLogItem[] = [
  {
    id: 1,
    level: 'ERROR',
    serverName: 'user_back',
    errorCode: 'LOAN4001',
    errorClass: 'NullPointerException',
    message: '신용점수 응답값이 null입니다',
    endpoint: '/api/loans/submit',
    httpMethod: 'POST',
    statusCode: 500,
    loanApplicationId: 'LOAN-2041',
    stackTrace:
      'java.lang.NullPointerException: 신용점수 응답값이 null입니다\n\tat com.sofit.loan.service.LoanService.validateCreditScore(LoanService.java:84)\n\tat com.sofit.loan.service.LoanService.submitApplication(LoanService.java:67)\n\tat com.sofit.loan.controller.LoanController.submit(LoanController.java:52)\n\tat com.sofit.external.client.ScoreClient.getScore(ScoreClient.java:31)\n\tat sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)\n\tat org.springframework.web.servlet.FrameworkServlet.service(FrameworkServlet.java:897)\n\t... 19 more',
    occurredAt: '2026-05-26T14:23:07',
  },
  {
    id: 2,
    level: 'ERROR',
    serverName: 'admin_back',
    errorCode: 'USER4002',
    errorClass: 'DataIntegrityViolationException',
    message: '중복된 사업자등록번호로 인한 제약 조건 위반',
    endpoint: '/api/admin/users',
    httpMethod: 'POST',
    statusCode: 409,
    loanApplicationId: null,
    stackTrace:
      'org.springframework.dao.DataIntegrityViolationException: could not execute statement\n\tat com.sofit.user.service.UserService.registerUser(UserService.java:112)\n\tat com.sofit.user.controller.UserController.createUser(UserController.java:45)\n\tat org.hibernate.exception.ConstraintViolationException\n\t... 12 more',
    occurredAt: '2026-05-26T13:45:22',
  },
  {
    id: 3,
    level: 'WARN',
    serverName: 'user_back',
    errorCode: 'EXT5001',
    errorClass: 'HttpClientErrorException',
    message: '외부 CB사 API 타임아웃 (3000ms 초과)',
    endpoint: '/api/credit/score',
    httpMethod: 'GET',
    statusCode: 504,
    loanApplicationId: 'LOAN-2038',
    stackTrace:
      'org.springframework.web.client.HttpClientErrorException: 504 Gateway Timeout\n\tat com.sofit.external.client.CbClient.requestScore(CbClient.java:67)\n\tat com.sofit.credit.service.CreditService.getCbScore(CreditService.java:29)\n\tat java.net.SocketTimeoutException: Read timed out\n\t... 8 more',
    occurredAt: '2026-05-26T12:10:55',
  },
  {
    id: 4,
    level: 'ERROR',
    serverName: 'user_back',
    errorCode: 'LOAN4003',
    errorClass: 'IllegalStateException',
    message: '이미 처리된 대출 신청에 대한 중복 심사 요청',
    endpoint: '/api/loans/review',
    httpMethod: 'POST',
    statusCode: 400,
    loanApplicationId: 'LOAN-2035',
    stackTrace:
      'java.lang.IllegalStateException: 이미 처리된 대출 신청에 대한 중복 심사 요청\n\tat com.sofit.loan.service.ReviewService.validateStatus(ReviewService.java:56)\n\tat com.sofit.loan.controller.ReviewController.submitReview(ReviewController.java:33)\n\t... 10 more',
    occurredAt: '2026-05-26T11:30:18',
  },
  {
    id: 5,
    level: 'ERROR',
    serverName: 'admin_back',
    errorCode: 'AUTH4001',
    errorClass: 'AccessDeniedException',
    message: '권한 없는 사용자의 관리자 API 접근 시도',
    endpoint: '/api/admin/loans/approve',
    httpMethod: 'POST',
    statusCode: 403,
    loanApplicationId: 'LOAN-2040',
    stackTrace:
      'org.springframework.security.access.AccessDeniedException: Access is denied\n\tat com.sofit.common.security.SecurityFilter.doFilterInternal(SecurityFilter.java:88)\n\tat com.sofit.admin.loan.controller.AdminLoanController.approve(AdminLoanController.java:61)\n\t... 15 more',
    occurredAt: '2026-05-26T10:55:33',
  },
  {
    id: 6,
    level: 'WARN',
    serverName: 'user_back',
    errorCode: 'LOAN4004',
    errorClass: 'MethodArgumentNotValidException',
    message: '대출 신청 금액이 허용 범위를 초과 (최대 5억원)',
    endpoint: '/api/loans/submit',
    httpMethod: 'POST',
    statusCode: 422,
    loanApplicationId: null,
    stackTrace:
      'org.springframework.web.bind.MethodArgumentNotValidException: Validation failed\n\tat com.sofit.loan.validator.LoanValidator.validateAmount(LoanValidator.java:42)\n\tat com.sofit.loan.controller.LoanController.submit(LoanController.java:48)\n\t... 7 more',
    occurredAt: '2026-05-26T09:20:11',
  },
  {
    id: 7,
    level: 'ERROR',
    serverName: 'admin_back',
    errorCode: 'INFRA5001',
    errorClass: 'RedisConnectionFailureException',
    message: 'Redis 세션 저장소 연결 실패',
    endpoint: '/api/admin/auth/login',
    httpMethod: 'POST',
    statusCode: 503,
    loanApplicationId: null,
    stackTrace:
      'org.springframework.data.redis.RedisConnectionFailureException: Unable to connect to Redis\n\tat com.sofit.common.session.SessionRepository.save(SessionRepository.java:23)\n\tat com.sofit.auth.service.AuthService.login(AuthService.java:67)\n\tat io.lettuce.core.RedisConnectionException: Unable to connect\n\t... 11 more',
    occurredAt: '2026-05-25T22:15:44',
  },
  {
    id: 8,
    level: 'ERROR',
    serverName: 'user_back',
    errorCode: 'AI5001',
    errorClass: 'JsonParseException',
    message: 'AI 서버 응답 JSON 파싱 실패',
    endpoint: '/api/batch/s-grade',
    httpMethod: 'POST',
    statusCode: 502,
    loanApplicationId: null,
    stackTrace:
      'com.fasterxml.jackson.core.JsonParseException: Unexpected character\n\tat com.sofit.external.client.AiClient.parseResponse(AiClient.java:55)\n\tat com.sofit.batch.service.BatchService.calculateSGrade(BatchService.java:91)\n\tat com.fasterxml.jackson.core.JsonParser._reportError(JsonParser.java:1234)\n\t... 14 more',
    occurredAt: '2026-05-25T20:00:30',
  },
  {
    id: 9,
    level: 'WARN',
    serverName: 'admin_back',
    errorCode: 'LOAN4005',
    errorClass: 'OptimisticLockingFailureException',
    message: '동시 심사 처리로 인한 낙관적 잠금 충돌',
    endpoint: '/api/admin/loans/review',
    httpMethod: 'PUT',
    statusCode: 409,
    loanApplicationId: 'LOAN-2033',
    stackTrace:
      'org.springframework.orm.ObjectOptimisticLockingFailureException: Row was updated or deleted\n\tat com.sofit.admin.loan.service.LoanReviewService.updateDecision(LoanReviewService.java:78)\n\tat com.sofit.admin.loan.controller.ReviewController.decide(ReviewController.java:41)\n\t... 9 more',
    occurredAt: '2026-05-25T17:45:12',
  },
  {
    id: 10,
    level: 'ERROR',
    serverName: 'user_back',
    errorCode: 'EXT5002',
    errorClass: 'SocketTimeoutException',
    message: '국세청 Mock API 응답 지연으로 인한 타임아웃',
    endpoint: '/api/kyc/verify',
    httpMethod: 'POST',
    statusCode: 504,
    loanApplicationId: null,
    stackTrace:
      'java.net.SocketTimeoutException: Read timed out\n\tat com.sofit.external.client.KycClient.verifyBusiness(KycClient.java:34)\n\tat com.sofit.kyc.service.KycService.verify(KycService.java:52)\n\tat java.net.SocketInputStream.socketRead0(Native Method)\n\t... 6 more',
    occurredAt: '2026-05-25T15:30:08',
  },
];

/**
 * Mock 에러 로그 목록을 필터링 + 페이징하여 반환한다.
 */
export function getMockErrorLogs(params: ErrorLogListParams): PaginatedErrorLogResponse {
  let filtered = [...MOCK_ERROR_LOGS];

  // 레벨 필터
  if (params.level) {
    filtered = filtered.filter((e) => e.level === params.level);
  }

  // 서버명 필터
  if (params.serverName) {
    filtered = filtered.filter((e) => e.serverName === params.serverName);
  }

  // 키워드 검색 (메시지, 에러 클래스, 엔드포인트, 에러코드)
  if (params.keyword) {
    const kw = params.keyword.toLowerCase();
    filtered = filtered.filter(
      (e) =>
        e.message.toLowerCase().includes(kw) ||
        e.errorClass.toLowerCase().includes(kw) ||
        e.endpoint.toLowerCase().includes(kw) ||
        e.errorCode.toLowerCase().includes(kw),
    );
  }

  // 최신순 정렬
  filtered.sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());

  const totalCount = filtered.length;
  const totalPages = Math.ceil(totalCount / params.size) || 1;
  const start = (params.page - 1) * params.size;
  const errors = filtered.slice(start, start + params.size);

  return { errors, totalCount, totalPages, currentPage: params.page, size: params.size };
}
