type SpinnerSize = 'sm' | 'md' | 'lg';

interface SpinnerProps {
  /** 스피너 크기 (기본: "md") */
  size?: SpinnerSize;
  /** 추가 클래스 */
  className?: string;
}

const SIZE_CLASSES: Record<SpinnerSize, string> = {
  sm: 'h-5 w-5 border-2',
  md: 'h-8 w-8 border-4',
  lg: 'h-12 w-12 border-4',
};

/**
 * 공통 로딩 스피너 컴포넌트.
 * 크기별로 통일된 스피너를 제공한다.
 */
export default function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  return (
    <div
      className={`animate-spin rounded-full border-primary border-t-transparent ${SIZE_CLASSES[size]} ${className}`}
      role="status"
      aria-label="로딩 중"
    />
  );
}
