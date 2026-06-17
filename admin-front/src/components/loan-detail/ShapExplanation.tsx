import type { ShapResult } from '@/types';
import ShapBarChart from './ShapBarChart';
import AiAdvice from './AiAdvice';
import Card from '@/components/common/Card';

interface ShapExplanationProps {
  /** SHAP 분석 결과 데이터 */
  shapResult: ShapResult | null | undefined;
}

/**
 * SHAP 기반 설명 영역 컴포넌트.
 * - 왼쪽: 강점/개선 키워드 태그, AI 분석 요약
 * - 오른쪽: ShapBarChart
 * - SHAP 데이터 미존재 시 안내 메시지
 */
export default function ShapExplanation({ shapResult }: ShapExplanationProps) {
  // SHAP 데이터 미존재
  if (!shapResult) {
    return (
      <Card>
        <p className="py-8 text-center text-sm text-text-secondary">
          SHAP 분석 데이터가 아직 생성되지 않았습니다.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="grid grid-cols-1 gap-0 md:grid-cols-2 md:divide-x md:divide-border-default">
        {/* 왼쪽 영역: 키워드 + AI 분석 요약 */}
        <div className="space-y-5 md:pr-6">
          {/* 강점 키워드 태그 */}
          {shapResult.strengthKeywords.length > 0 && (
            <div>
              <span className="mb-2 block text-sm font-medium text-text-secondary">강점</span>
              <div className="flex flex-wrap gap-2">
                {shapResult.strengthKeywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full bg-info/10 px-3 py-1 text-sm font-medium text-info"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 개선 키워드 태그 */}
          {shapResult.improvementKeywords.length > 0 && (
            <div>
              <span className="mb-2 block text-sm font-medium text-text-secondary">개선</span>
              <div className="flex flex-wrap gap-2">
                {shapResult.improvementKeywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full bg-error/10 px-3 py-1 text-sm font-medium text-error"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* AI 분석 요약 */}
          <AiAdvice advice={shapResult.advice} />
        </div>

        {/* 오른쪽 영역: 특성 영향력 TOP 10 */}
        <div className="mt-6 md:mt-0 md:pl-6">
          <ShapBarChart
            title="특성 영향력 TOP 10"
            details={{ ...shapResult.strengthDetails, ...shapResult.improvementDetails }}
            maxItems={10}
          />
        </div>
      </div>
    </Card>
  );
}
