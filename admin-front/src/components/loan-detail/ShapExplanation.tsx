import { useShapResult } from '@/hooks/useShapResult';
import ShapBarChart from './ShapBarChart';
import AiAdvice from './AiAdvice';

interface ShapExplanationProps {
  /** 대출 신청 건 ID */
  loanId: number;
}

/**
 * SHAP 기반 설명 영역 컴포넌트.
 * - 왼쪽: 현재 등급 + 목표 등급, 강점/개선 키워드 태그, ShapBarChart
 * - 오른쪽: AiAdvice
 * - 로딩 스피너, 에러 시 "다시 시도" 버튼
 * - SHAP 데이터 미존재 시 안내 메시지
 */
export default function ShapExplanation({ loanId }: ShapExplanationProps) {
  const { data, isLoading, isError, refetch } = useShapResult(loanId);

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="rounded-lg border border-border-default bg-bg-surface p-6 shadow-card">
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-primary" />
        </div>
      </div>
    );
  }

  // 에러 상태
  if (isError) {
    return (
      <div className="rounded-lg border border-border-default bg-bg-surface p-6 shadow-card">
        <div className="flex flex-col items-center justify-center gap-3 py-12">
          <p className="text-sm text-error">SHAP 데이터를 불러오는 중 오류가 발생했습니다.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-text-inverse hover:bg-primary-dark transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  // SHAP 데이터 미존재
  if (!data) {
    return (
      <div className="rounded-lg border border-border-default bg-bg-surface p-6 shadow-card">
        <p className="py-8 text-center text-sm text-text-secondary">
          SHAP 분석 데이터가 아직 생성되지 않았습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border-default bg-bg-surface p-6 shadow-card">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* 왼쪽 영역: 등급 + 키워드 + 바 차트 */}
        <div className="space-y-5">
          {/* 현재 등급 + 목표 등급 */}
          <div className="flex items-center gap-3">
            <span className="rounded-md bg-primary px-3 py-1 text-sm font-bold text-text-inverse">
              {data.grade}
            </span>
            <span className="text-sm text-text-secondary">
              목표: {data.targetGrade}
            </span>
          </div>

          {/* 강점 키워드 태그 */}
          {data.strengthKeywords.length > 0 && (
            <div>
              <span className="mb-2 block text-xs font-medium text-text-secondary">강점</span>
              <div className="flex flex-wrap gap-1.5">
                {data.strengthKeywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full bg-info/10 px-2.5 py-0.5 text-xs font-medium text-info"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 개선 키워드 태그 */}
          {data.improvementKeywords.length > 0 && (
            <div>
              <span className="mb-2 block text-xs font-medium text-text-secondary">개선</span>
              <div className="flex flex-wrap gap-1.5">
                {data.improvementKeywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full bg-error/10 px-2.5 py-0.5 text-xs font-medium text-error"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 강점 상세 바 차트 */}
          <ShapBarChart
            title="강점 상세"
            details={data.strengthDetails}
            variant="strength"
          />

          {/* 개선 상세 바 차트 */}
          <ShapBarChart
            title="개선 상세"
            details={data.improvementDetails}
            variant="improvement"
          />
        </div>

        {/* 오른쪽 영역: AI 분석 요약 */}
        <div>
          <AiAdvice advice={data.advice} />
        </div>
      </div>
    </div>
  );
}
