interface CardProps {
  /** 카드 제목 (선택) */
  title?: string;
  /** 제목 왼쪽에 표시할 아이콘 (선택) */
  titleIcon?: React.ReactNode;
  /** 제목 우측에 표시할 추가 요소 (뱃지 등) */
  titleRight?: React.ReactNode;
  children: React.ReactNode;
  /** 추가 클래스 (min-h, col-span 등 레이아웃 용도) */
  className?: string;
}

/**
 * 공통 카드 컨테이너 컴포넌트.
 * 프로젝트 전반에서 반복되는 카드 스타일을 통일한다.
 */
export default function Card({ title, titleIcon, titleRight, children, className = '' }: CardProps) {
  return (
    <div className={`rounded-lg border border-border-default bg-bg-surface p-5 shadow-card ${className}`}>
      {title && (
        <div className="mb-4 flex items-center gap-2">
          {titleIcon}
          <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
          {titleRight && <div className="flex flex-1 items-center gap-2">{titleRight}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
