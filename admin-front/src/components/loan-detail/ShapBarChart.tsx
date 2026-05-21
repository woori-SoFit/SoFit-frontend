import type { ShapDetail } from '@/types';

interface ShapBarChartProps {
  /** 차트 제목 (예: "강점 상세", "개선 상세") */
  title: string;
  /** SHAP 상세 항목 배열 */
  details: ShapDetail[];
  /** 바 색상 타입: 'strength'(파란색) | 'improvement'(빨간색) */
  variant: 'strength' | 'improvement';
}

/** 특성명 최대 표시 길이 */
const MAX_FEATURE_NAME_LENGTH = 20;

/**
 * SHAP 수평 바 차트 컴포넌트.
 * - 강점 상세: 양수 SHAP 값 수평 바 (파란색)
 * - 개선 상세: 음수 SHAP 값 수평 바 (빨간색)
 * - 절대값 기준 내림차순 정렬
 * - 특성명 왼쪽, 영향력 수치 소수점 4자리 오른쪽 표시
 * - 20자 초과 특성명 말줄임 + 툴팁
 */
export default function ShapBarChart({ title, details, variant }: ShapBarChartProps) {
  // 절대값 기준 내림차순 정렬
  const sorted = [...details].sort(
    (a, b) => Math.abs(b.shapValue) - Math.abs(a.shapValue),
  );

  // 바 너비 계산을 위한 최대 절대값
  const maxAbsValue = sorted.length > 0 ? Math.abs(sorted[0].shapValue) : 1;

  const barColor =
    variant === 'strength' ? 'bg-info' : 'bg-error';

  return (
    <div>
      <h4 className="mb-3 text-sm font-semibold text-text-primary">{title}</h4>

      {sorted.length === 0 ? (
        <p className="text-sm text-text-secondary">데이터가 없습니다.</p>
      ) : (
        <div className="space-y-2">
          {sorted.map((item) => {
            const absValue = Math.abs(item.shapValue);
            const widthPercent = (absValue / maxAbsValue) * 100;
            const isLongName = item.featureName.length > MAX_FEATURE_NAME_LENGTH;
            const displayName = isLongName
              ? `${item.featureName.slice(0, MAX_FEATURE_NAME_LENGTH)}...`
              : item.featureName;

            return (
              <div key={item.featureName} className="flex items-center gap-2">
                {/* 특성명 */}
                <span
                  className="w-36 shrink-0 truncate text-xs text-text-secondary"
                  title={isLongName ? item.featureName : undefined}
                >
                  {displayName}
                </span>

                {/* 바 */}
                <div className="flex-1">
                  <div className="h-4 w-full rounded bg-gray-100">
                    <div
                      className={`h-4 rounded ${barColor} transition-all`}
                      style={{ width: `${widthPercent}%` }}
                    />
                  </div>
                </div>

                {/* 수치 (소수점 4자리) */}
                <span className="w-16 shrink-0 text-right text-xs font-medium text-text-primary">
                  {item.shapValue.toFixed(4)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
