import { formatDateTime } from '@/types/serverHealth';

interface DashboardHeaderProps {
  /** 마지막 성공 시각 (timestamp) */
  dataUpdatedAt: number;
  /** 현재 요청 진행 중 여부 */
  isFetching: boolean;
  /** 수동 새로고침 콜백 */
  onRefresh: () => void;
  /** 연속 실패 횟수 */
  failureCount: number;
}

/** 환경변수에서 환경 이름을 가져온다 */
const ENV_NAME = import.meta.env.VITE_ENV_NAME as string | undefined;

/**
 * 서버 상태 대시보드 헤더 컴포넌트.
 * 페이지 제목, 환경 뱃지, 마지막 갱신 시간, 새로고침 버튼을 표시한다.
 */
export default function DashboardHeader({
  dataUpdatedAt,
  isFetching,
  onRefresh,
  failureCount,
}: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      {/* 좌측: 제목 + 환경 뱃지 */}
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-text-primary">서버 통신 상태</h1>
        {ENV_NAME && (
          <span className="rounded-full bg-green-100 px-3 py-0.5 text-xs font-medium text-green-800">
            {ENV_NAME}
          </span>
        )}
      </div>

      {/* 우측: 경고 아이콘 + 갱신 시간 + 새로고침 버튼 */}
      <div className="flex items-center gap-3">
        {/* 연속 실패 경고 */}
        {failureCount >= 3 && (
          <span
            className="text-amber-500"
            title={`연속 ${failureCount}회 새로고침 실패`}
            aria-label={`연속 ${failureCount}회 새로고침 실패 경고`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        )}

        {/* 마지막 갱신 시간 */}
        {dataUpdatedAt > 0 && (
          <span className="text-sm text-text-secondary">
            {formatDateTime(dataUpdatedAt)}
          </span>
        )}

        {/* 새로고침 버튼 */}
        <button
          type="button"
          onClick={onRefresh}
          disabled={isFetching}
          className="inline-flex items-center gap-1.5 rounded-md border border-border-default bg-white px-3 py-1.5 text-sm font-medium text-text-primary transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="새로고침"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
              clipRule="evenodd"
            />
          </svg>
          새로고침
        </button>
      </div>
    </div>
  );
}
