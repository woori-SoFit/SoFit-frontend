import { useServerHealth } from '@/hooks/useServerHealth';
import LoadingState from '@/components/common/LoadingState';
import ErrorState from '@/components/common/ErrorState';
import DashboardHeader from '@/components/server-status/DashboardHeader';
import SummaryCards from '@/components/server-status/SummaryCards';
import ApplicationStatusSection from '@/components/server-status/ApplicationStatusSection';
import InfraStatusSection from '@/components/server-status/InfraStatusSection';
import ConnectionPoolSection from '@/components/server-status/ConnectionPoolSection';

/**
 * 서버 상태 확인 대시보드 페이지.
 * useServerHealth 훅으로 데이터를 조회하고,
 * 로딩/에러/정상 상태에 따라 적절한 UI를 렌더링한다.
 */
export default function ServerStatusPage() {
  const { data, isLoading, isError, refetch, isFetching, dataUpdatedAt, failureCount } =
    useServerHealth();

  if (isLoading) return <LoadingState message="서버 상태를 확인하는 중입니다" />;
  if (isError && !data) return <ErrorState onRetry={refetch} />;

  return (
    <div className="flex flex-col h-full p-6">
      <div className="mb-6">
        <DashboardHeader
          dataUpdatedAt={dataUpdatedAt}
          isFetching={isFetching}
          onRefresh={refetch}
          failureCount={failureCount}
        />
      </div>
      <div className="mb-6">
        <SummaryCards data={data} isLoading={isFetching && !data} />
      </div>
      <div className="grid grid-cols-2 gap-6 mb-6">
        <ApplicationStatusSection servers={data?.servers.applications} />
        <InfraStatusSection servers={data?.servers.infrastructure} />
      </div>
      <ConnectionPoolSection pools={data?.dbConnectionPool} />
    </div>
  );
}
