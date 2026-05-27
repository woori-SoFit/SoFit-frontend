import type { ReactNode } from 'react';
import type { UserStatistics } from '@/types/user';
import { calculatePercentage } from '@/utils/userUtils';
import Card from '@/components/common/Card';
import { Users, Landmark, User, UserX } from 'lucide-react';

interface StatisticsCardsProps {
  data?: UserStatistics;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

/** 개별 통계 카드 정보 */
interface CardInfo {
  icon: ReactNode;
  iconBg: string;
  title: string;
  count: number;
  subtitle: string;
}

/**
 * 통계 데이터를 기반으로 4개 카드 정보를 생성한다.
 */
function buildCards(data: UserStatistics): CardInfo[] {
  const { totalCount, activeCount, bankerCount, userCount, inactiveCount } = data;

  return [
    {
      icon: <Users className="h-5 w-5 text-blue-600" />,
      iconBg: 'bg-blue-100',
      title: '전체 사용자',
      count: totalCount,
      subtitle: `활성 사용자 ${activeCount}명`,
    },
    {
      icon: <Landmark className="h-5 w-5 text-green-600" />,
      iconBg: 'bg-green-100',
      title: '은행원',
      count: bankerCount,
      subtitle: `전체의 ${calculatePercentage(bankerCount, totalCount)}`,
    },
    {
      icon: <User className="h-5 w-5 text-amber-600" />,
      iconBg: 'bg-orange-100',
      title: '고객',
      count: userCount,
      subtitle: `전체의 ${calculatePercentage(userCount, totalCount)}`,
    },
    {
      icon: <UserX className="h-5 w-5 text-red-600" />,
      iconBg: 'bg-red-100',
      title: '비활성 사용자',
      count: inactiveCount,
      subtitle: `전체의 ${calculatePercentage(inactiveCount, totalCount)}`,
    },
  ];
}

/** 로딩 스켈레톤 카드 */
function SkeletonCard() {
  return (
    <Card>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-16 animate-pulse rounded bg-gray-200" />
          <div className="h-5 w-12 animate-pulse rounded bg-gray-200" />
          <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    </Card>
  );
}

/**
 * 사용자 통계 카드 컴포넌트.
 * 4개 통계 카드(전체, 은행원, 고객, 비활성)를 가로 균등 배치한다.
 * 로딩 중에는 스켈레톤, 에러 시에는 에러 메시지 + 재시도 버튼을 표시한다.
 */
export default function StatisticsCards({ data, isLoading, isError, onRetry }: StatisticsCardsProps) {
  // 로딩 상태
  if (isLoading) {
    return (
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  // 에러 상태
  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="mb-3 text-sm text-red-600">통계 데이터를 불러올 수 없습니다.</p>
        <button
          type="button"
          onClick={onRetry}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          다시 시도
        </button>
      </div>
    );
  }

  // 데이터 없음
  if (!data) {
    return null;
  }

  const cards = buildCards(data);

  return (
    <div className="grid grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${card.iconBg}`}
            >
              {card.icon}
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500">{card.title}</p>
              <p className="text-lg font-semibold text-gray-900">{card.count}명</p>
              <p className="text-xs text-gray-400">{card.subtitle}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
