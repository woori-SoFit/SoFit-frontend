import { formatScore } from '@/utils/formatters';
import Card from '@/components/common/Card';

interface CBScoreCardProps {
  score: number | null;
}

const MAX_SCORE = 1000;

/**
 * CB 신용점수 카드 컴포넌트.
 * 점수를 "N점/1000점" 형식으로 표시하고, 0~1000 범위 기준 게이지 바를 렌더링한다.
 * score가 null이면 "점수 정보 없음"을 표시하고 게이지를 0% 상태로 표시한다.
 */
export default function CBScoreCard({ score }: CBScoreCardProps) {
  const percentage = score !== null ? Math.round((score / MAX_SCORE) * 100) : 0;

  return (
    <Card title="CB 신용점수">
      <div className="mb-3 text-center">
        {score !== null ? (
          <span className="text-lg font-bold text-primary">
            {formatScore(score, MAX_SCORE)}
          </span>
        ) : (
          <span className="text-sm text-text-secondary">점수 정보 없음</span>
        )}
      </div>

      {/* 게이지 바 */}
      <div className="h-3 w-full rounded-full bg-gray-200">
        <div
          className="h-3 rounded-full bg-primary transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </Card>
  );
}
