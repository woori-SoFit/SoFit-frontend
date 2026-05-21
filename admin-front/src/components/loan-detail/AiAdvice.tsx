interface AiAdviceProps {
  /** AI 조언 텍스트 ("•" 구분 항목) */
  advice: string | undefined | null;
}

/**
 * AI 분석 요약 컴포넌트.
 * - "AI 분석 요약" 라벨 표시
 * - advice 텍스트를 "•" 구분 항목별로 표시
 * - 데이터 없을 시 안내 메시지 표시
 */
export default function AiAdvice({ advice }: AiAdviceProps) {
  // advice가 없거나 빈 문자열인 경우
  if (!advice || advice.trim() === '') {
    return (
      <div>
        <h4 className="mb-3 text-sm font-semibold text-text-primary">AI 분석 요약</h4>
        <p className="text-sm text-text-secondary">
          AI 분석 요약이 아직 준비되지 않았습니다.
        </p>
      </div>
    );
  }

  // "•" 또는 줄바꿈+• 기준으로 항목 분리
  const items = advice
    .split('\n')
    .map((line) => line.replace(/^•\s*/, '').trim())
    .filter((line) => line.length > 0);

  return (
    <div>
      <h4 className="mb-3 text-sm font-semibold text-text-primary">AI 분석 요약</h4>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2 text-sm text-text-secondary">
            <span className="shrink-0 text-primary">•</span>
            <p>{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
