/**
 * SSE(Server-Sent Events) 클라이언트 모듈
 *
 * EventSource 기반 실시간 알림 수신을 위한 연결 관리 모듈.
 * - 연결 수립, 이벤트 처리, 자동 재연결 로직을 캡슐화
 * - 브라우저 네이티브 EventSource API 사용 (별도 라이브러리 불필요)
 */
import type { NotificationItem } from "@/types/notification";

/** SSE 클라이언트 옵션 */
export interface SSEClientOptions {
  /** SSE 엔드포인트 URL */
  url: string;
  /** 연결 성공 시 호출되는 콜백 */
  onConnect: () => void;
  /** 알림 이벤트 수신 시 호출되는 콜백 */
  onNotification: (data: NotificationItem) => void;
  /** 에러 발생 시 호출되는 콜백 */
  onError: (error: Event) => void;
  /** 최대 재연결 시도 횟수 (기본값: 5) */
  maxRetries?: number;
  /** 재연결 간격 ms (기본값: 3000) */
  retryInterval?: number;
}

/** SSE 클라이언트 반환 인터페이스 */
export interface SSEClientReturn {
  /** SSE 연결 수립 */
  connect: () => void;
  /** SSE 연결 종료 및 타이머 정리 */
  disconnect: () => void;
  /** 현재 연결 상태 */
  isConnected: boolean;
}

/**
 * SSE 클라이언트 생성 함수
 *
 * @param options - SSE 클라이언트 설정 옵션
 * @returns SSE 클라이언트 제어 인터페이스
 */
export function createSSEClient(options: SSEClientOptions): SSEClientReturn {
  const {
    url,
    onConnect,
    onNotification,
    onError,
    maxRetries = 5,
    retryInterval = 3000,
  } = options;

  let eventSource: EventSource | null = null;
  let retryCount = 0;
  let retryTimer: ReturnType<typeof setTimeout> | null = null;
  let isConnected = false;
  let isDisconnected = false;

  /** 재연결 타이머 정리 */
  function clearRetryTimer(): void {
    if (retryTimer !== null) {
      clearTimeout(retryTimer);
      retryTimer = null;
    }
  }

  /** 재연결 시도 */
  function attemptReconnect(): void {
    if (isDisconnected) return;

    if (retryCount >= maxRetries) {
      // 재연결 최대 횟수 초과 → 에러 콜백 호출 및 재연결 중단
      onError(new Event("error"));
      return;
    }

    retryCount++;
    retryTimer = setTimeout(() => {
      if (!isDisconnected) {
        connect();
      }
    }, retryInterval);
  }

  /** SSE 연결 수립 */
  function connect(): void {
    // 기존 연결이 있으면 정리
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }

    isDisconnected = false;

    // EventSource 생성 (withCredentials: true로 세션 쿠키 인증 유지)
    eventSource = new EventSource(url, { withCredentials: true });

    // connect 이벤트 수신 시 연결 확인 콜백 호출
    eventSource.addEventListener("connect", () => {
      isConnected = true;
      retryCount = 0;
      clearRetryTimer();
      onConnect();
    });

    // notification 이벤트 수신 시 JSON 파싱 후 알림 데이터 콜백 호출
    eventSource.addEventListener("notification", (event: MessageEvent) => {
      try {
        const data: NotificationItem = JSON.parse(event.data);
        onNotification(data);
      } catch {
        // JSON 파싱 실패 시 해당 이벤트 무시, 연결 유지
      }
    });

    // 연결 에러 발생 시 재연결 로직 실행
    eventSource.onerror = () => {
      isConnected = false;

      if (eventSource) {
        eventSource.close();
        eventSource = null;
      }

      // 수동 disconnect가 아닌 경우에만 재연결 시도
      if (!isDisconnected) {
        attemptReconnect();
      }
    };
  }

  /** SSE 연결 종료 및 타이머 정리 */
  function disconnect(): void {
    isDisconnected = true;
    isConnected = false;
    retryCount = 0;
    clearRetryTimer();

    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }
  }

  return {
    connect,
    disconnect,
    get isConnected() {
      return isConnected;
    },
  };
}
