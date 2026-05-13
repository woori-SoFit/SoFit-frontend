/**
 * 공동인증 PIN 입력 공통 컴포넌트
 *
 * 사용처:
 * - 대출 신청 PIN 인증
 * - My Biz Data PIN 인증
 * - 대출 약정 전자서명 PIN 인증
 * - 회원가입 PIN 인증
 *
 * 보안 규칙: 검증 요청 후 입력값 즉시 초기화
 */

interface PinInputProps {
  /** PIN 입력 완료 시 호출 (검증 요청 후 내부에서 즉시 초기화) */
  onSubmit: (pin: string) => void;
  isLoading?: boolean;
  errorMessage?: string;
}

export function PinInput(_props: PinInputProps) {
  // TODO: UI 구현 — 숫자 키패드, 입력값 마스킹, 제출 후 즉시 초기화
  return <div data-testid="pin-input" />;
}
