import { Link } from 'react-router-dom';
import { useManagerApprovals } from '@/hooks/useManagerApprovals';
import { formatCurrency, formatDate } from '@/utils/formatters';
import LoadingState from '@/components/common/LoadingState';
import ErrorState from '@/components/common/ErrorState';
import DataTable from '@/components/common/DataTable';
import type { Column } from '@/components/common/DataTable';
import type { ManagerApprovalItem } from '@/types';

const columns: Column<ManagerApprovalItem>[] = [
  { header: '신청일', render: (row) => formatDate(row.applicationDate) },
  { header: '신청자명', render: (row) => row.applicantName },
  { header: '사업자명', render: (row) => row.businessName },
  { header: '상품명', render: (row) => row.productName, width: '20%' },
  { header: '요청 은행원', render: (row) => row.requestedByName },
  { header: '신청 금액', render: (row) => formatCurrency(row.requestedAmount) },
  {
    header: '상세 정보',
    render: (row) => (
      <Link
        to={`/loan/${row.id}`}
        aria-label={`${row.applicantName} 결재 건 상세보기`}
        className="text-primary hover:text-primary/80 font-medium"
      >
        상세보기
      </Link>
    ),
  },
];

/**
 * 지점장 결재 페이지.
 * MANAGER_REVIEW 상태인 대출 신청 건 목록을 테이블로 표시하고,
 * 각 건의 상세보기 링크로 대출 상세 페이지로 이동할 수 있다.
 */
export default function ManagerApprovalPage() {
  const { data, isLoading, isError, refetch } = useManagerApprovals();

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-text-primary">지점장 결재</h1>
          {!isLoading && data && (
            <span className="text-sm text-text-secondary">
              총 {data.length}건
            </span>
          )}
        </div>
      </div>

      {/* 로딩 상태 */}
      {isLoading && <LoadingState />}

      {/* 에러 상태 */}
      {isError && <ErrorState onRetry={() => refetch()} />}

      {/* 테이블 */}
      {!isLoading && !isError && data && (
        <DataTable
          columns={columns}
          data={data}
          rowKey={(row) => row.id}
          emptyMessage="결재 대기 중인 건이 없습니다."
        />
      )}
    </div>
  );
}
