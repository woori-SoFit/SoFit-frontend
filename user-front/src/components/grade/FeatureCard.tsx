/**
 * 서비스 특징 카드 컴포넌트
 *
 * S분석 리포트 진입 화면에서 서비스의 주요 특징을 개별 카드로 표시합니다.
 * 아이콘, 제목, 설명 텍스트를 세로 방향으로 배치합니다.
 *
 * 사용처:
 * - GradeReportIntroPage 내 Feature_Section
 */

interface FeatureCardProps {
  /** 카드에 표시할 아이콘 (ReactNode) */
  icon: React.ReactNode;
  /** 아이콘 대체 텍스트 (접근성용) */
  iconAlt: string;
  /** 카드 제목 */
  title: string;
  /** 카드 설명 텍스트 */
  description: string;
  /** 제목에 추가할 CSS 클래스 (선택) */
  titleClassName?: string;
}

export function FeatureCard({ icon, iconAlt, title, description, titleClassName }: FeatureCardProps) {
  return (
    <div className="flex items-center rounded-lg bg-white p-4 gap-5">
      {/* 아이콘 영역 */}
      <div className="shrink-0 bg-blue-50 rounded-lg p-2" role="img" aria-label={iconAlt}>
        {icon}
      </div>

      {/* 텍스트 영역 */}
      <div className="text-left">
        {/* 제목 */}
        <h3 className={`mb-1 text-base font-semibold whitespace-pre-line ${titleClassName ?? "text-text-primary"}`}>
          {title}
        </h3>

        {/* 설명 텍스트 */}
        <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">
          {description}
        </p>
      </div>
    </div>
  );
}
