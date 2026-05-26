import { formatScore } from '@/utils/formatters';
import Card from '@/components/common/Card';

interface SCBScoreCardProps {
  scbScore: number | null;
  cbScore: number | null;
  sGrade: string | null;
  bonusPoints: number | null;
}

const MAX_SCORE = 1000;

/**
 * SCB 점수 카드 컴포넌트.
 * CB 점수에 성장S등급 가산점이 반영된 SCB 점수를 게이지 바 형태로 시각화한다.
 * 게이지 바에서 CB 점수 영역(primary)과 가산점 영역(success)을 서로 다른 색상으로 구분한다.
 * scbScore가 null이면 "점수 정보 없음"을 표시하고 게이지를 0% 상태로 표시한다.
 */
export default function SCBScoreCard({
  scbScore,
  cbScore,
  sGrade,
  bonusPoints,
}: SCBScoreCardProps) {
  const cbPercentage =
    cbScore !== null ? Math.min((cbScore / MAX_SCORE) * 100, 100) : 0;
  const bonusPercentage =
    bonusPoints !== null ? Math.min((bonusPoints / MAX_SCORE) * 100, 100) : 0;

  return (
    <Card
      title="SCB 점수"
      titleRight={
        <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
          가산 반영
        </span>
      }
    >
      {/* 점수 표시 */}
      <div className="mb-3 text-center">
        {scbScore !== null ? (
          <span className="text-lg font-bold text-primary">
            {formatScore(scbScore, MAX_SCORE)}
          </span>
        ) : (
          <span className="text-sm text-text-secondary">점수 정보 없음</span>
        )}
      </div>

      {/* 게이지 바: CB 영역 + 가산점 영역 */}
      <div className="h-3 w-full rounded-full bg-gray-200">
        <div className="flex h-3 overflow-hidden rounded-full">
          <div
            className="h-3 bg-primary transition-all"
            style={{ width: `${cbPercentage}%` }}
          />
          <div
            className="h-3 bg-success transition-all"
            style={{ width: `${bonusPercentage}%` }}
          />
        </div>
      </div>

      {/* 주석: 성장S등급 가산점 정보 */}
      {sGrade && bonusPoints !== null && (
        <p className="mt-2 text-xs text-text-secondary">
          {sGrade} 등급 가산 +{bonusPoints}점 반영
        </p>
      )}
    </Card>
  );
}
