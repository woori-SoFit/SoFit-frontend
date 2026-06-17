import Spinner from '@/components/common/Spinner';

interface LoadingStateProps {
  /** 로딩 메시지 (기본: "데이터를 불러오는 중입니다") */
  message?: string;
}

/**
 * 공통 로딩 상태 컴포넌트.
 * 중앙 정렬된 스피너 + 메시지를 표시한다.
 */
export default function LoadingState({ message = '데이터를 불러오는 중입니다' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[540px]">
      <Spinner className="mb-4" />
      <p className="text-sm text-text-secondary">{message}</p>
    </div>
  );
}
