import Card from '@/components/common/Card';

interface SGradeCardProps {
  grade: string | null;
}

/** S1~S10 전체 등급 배열 (왼쪽 S1 = 최고, 오른쪽 S10 = 최저) */
const GRADES = Array.from({ length: 10 }, (_, i) => `S${i + 1}`);

/**
 * 성장S등급 카드 컴포넌트.
 * S1~S10 수평 스케일을 표시하고, 현재 등급 위치를 강조한다.
 * grade가 null이면 "성장S등급이 아직 산출되지 않았습니다" 안내 메시지를 표시한다.
 */
export default function SGradeCard({ grade }: SGradeCardProps) {
  return (
    <Card title="성장S등급">
      {grade !== null ? (
        <>
          {/* 현재 등급 텍스트 */}
          <div className="mb-3 text-center">
            <span className="text-lg font-bold text-primary">{grade}</span>
          </div>

          {/* S1~S10 수평 스케일 */}
          <div className="flex items-center gap-1">
            {GRADES.map((g) => (
              <div
                key={g}
                className={`flex flex-1 items-center justify-center rounded py-1 text-xs font-medium ${
                  g === grade
                    ? 'bg-primary text-text-inverse'
                    : 'bg-gray-200 text-text-secondary'
                }`}
              >
                {g}
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-center text-sm text-text-secondary">
          성장S등급이 아직 산출되지 않았습니다
        </p>
      )}
    </Card>
  );
}
