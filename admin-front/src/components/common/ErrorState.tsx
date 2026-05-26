import Button from '@/components/common/Button';

interface ErrorStateProps {
  /** 에러 메시지 (기본: "데이터를 불러오는 중 오류가 발생했습니다.") */
  message?: string;
  /** 재시도 콜백 */
  onRetry: () => void;
  /** 재시도 버튼 텍스트 (기본: "다시 시도") */
  retryLabel?: string;
}

/**
 * 공통 에러 상태 컴포넌트.
 * 중앙 정렬된 에러 메시지 + 재시도 버튼을 표시한다.
 */
export default function ErrorState({
  message = '데이터를 불러오는 중 오류가 발생했습니다.',
  onRetry,
  retryLabel = '다시 시도',
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <p className="mb-4 text-sm text-text-secondary">{message}</p>
      <Button onClick={onRetry}>{retryLabel}</Button>
    </div>
  );
}
