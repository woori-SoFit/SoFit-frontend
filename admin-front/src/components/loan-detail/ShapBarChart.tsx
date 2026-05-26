interface ShapBarChartProps {
  /** 차트 제목 */
  title: string;
  /** 강점 + 개선 항목을 합친 SHAP 상세 (변수명 → SHAP 값) */
  details: Record<string, number>;
  /** 표시할 최대 항목 수 (기본 10) */
  maxItems?: number;
}

/** 특성명 최대 표시 길이 */
const MAX_FEATURE_NAME_LENGTH = 16;

/**
 * SHAP 통합 수평 바 차트 컴포넌트.
 * 0을 기준으로 양수는 오른쪽(파란색), 음수는 왼쪽(빨간색)으로 바가 뻗는다.
 * 절대값 기준 내림차순 정렬하여 영향력 TOP N을 표시한다.
 */
export default function ShapBarChart({ title, details, maxItems = 10 }: ShapBarChartProps) {
  // Record → 배열 변환 후 절대값 기준 내림차순 정렬
  const sorted = Object.entries(details)
    .map(([featureName, shapValue]) => ({ featureName, shapValue }))
    .sort((a, b) => Math.abs(b.shapValue) - Math.abs(a.shapValue))
    .slice(0, maxItems);

  // 바 너비 계산을 위한 최대 절대값
  const maxAbsValue = sorted.length > 0 ? Math.abs(sorted[0].shapValue) : 1;

  if (sorted.length === 0) {
    return (
      <div>
        <h4 className="mb-3 text-sm font-semibold text-text-primary">{title}</h4>
        <p className="text-sm text-text-secondary">데이터가 없습니다.</p>
      </div>
    );
  }

  return (
    <div>
      <h4 className="mb-4 text-sm font-semibold text-text-primary">{title}</h4>

      <div className="space-y-1.5">
        {sorted.map((item) => {
          const isPositive = item.shapValue >= 0;
          const absValue = Math.abs(item.shapValue);
          // 바 너비: 전체 절반(50%) 중 비율 계산
          const widthPercent = (absValue / maxAbsValue) * 50;
          const isLongName = item.featureName.length > MAX_FEATURE_NAME_LENGTH;
          const displayName = isLongName
            ? `${item.featureName.slice(0, MAX_FEATURE_NAME_LENGTH)}…`
            : item.featureName;

          return (
            <div key={item.featureName} className="flex items-center gap-2">
              {/* 특성명 */}
              <span
                className="w-32 shrink-0 text-right text-xs text-text-secondary"
                title={isLongName ? item.featureName : undefined}
              >
                {displayName}
              </span>

              {/* 바 영역: 왼쪽(음수) | 중앙(0) | 오른쪽(양수) */}
              <div className="relative flex h-5 flex-1 items-center">
                {/* 중앙선 */}
                <div className="absolute left-1/2 top-0 h-full w-px bg-gray-300" />

                {isPositive ? (
                  // 양수: 중앙에서 오른쪽으로
                  <div
                    className="absolute left-1/2 h-4 rounded-r bg-info transition-all"
                    style={{ width: `${widthPercent}%` }}
                  />
                ) : (
                  // 음수: 중앙에서 왼쪽으로
                  <div
                    className="absolute right-1/2 h-4 rounded-l bg-error transition-all"
                    style={{ width: `${widthPercent}%` }}
                  />
                )}
              </div>

              {/* 수치 */}
              <span
                className={`w-14 shrink-0 text-right text-xs font-medium ${
                  isPositive ? 'text-info' : 'text-error'
                }`}
              >
                {isPositive ? '+' : ''}{item.shapValue.toFixed(2)}
              </span>
            </div>
          );
        })}
      </div>

      {/* X축 라벨 */}
      <div className="mt-2 flex items-center gap-2">
        <span className="w-32 shrink-0" />
        <div className="flex flex-1 justify-between text-[10px] text-text-disabled">
          <span>-{maxAbsValue.toFixed(1)}</span>
          <span>0</span>
          <span>+{maxAbsValue.toFixed(1)}</span>
        </div>
        <span className="w-14 shrink-0" />
      </div>
      <div className="mt-0.5 flex items-center gap-2">
        <span className="w-32 shrink-0" />
        <p className="flex-1 text-center text-[10px] text-text-disabled">SHAP 값</p>
        <span className="w-14 shrink-0" />
      </div>
    </div>
  );
}
