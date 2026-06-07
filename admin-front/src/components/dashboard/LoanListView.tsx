import { Link } from 'react-router-dom';

import StatusBadge from '@/components/common/StatusBadge';
import DataTable from '@/components/common/DataTable';
import type { Column } from '@/components/common/DataTable';
import type { LoanApplicationItem, ReviewStatus } from '@/types/loan';
import { formatDate } from '@/utils/formatters';

function getActionLabel(status: ReviewStatus | string): string {
  switch (status) {
    case 'SYSTEM_APPROVED':
    case 'SYSTEM_REJECTED':
      return '심사';
    case 'MANAGER_REVIEW':
      return '결재';
    default:
      return '조회';
  }
}

function isActionable(status: ReviewStatus | string): boolean {
  return status === 'SYSTEM_APPROVED' || status === 'SYSTEM_REJECTED' || status === 'MANAGER_REVIEW';
}

interface LoanListViewProps {
  applications: LoanApplicationItem[];
}

const columns: Column<LoanApplicationItem>[] = [
  { header: '신청일', render: (row) => formatDate(row.appliedAt) },
  { header: '신청자명', render: (row) => row.applicantName },
  { header: '사업자명', render: (row) => row.businessName },
  { header: '상품명', render: (row) => row.productName },
  { header: '담당자', render: (row) => row.assigneeName },
  { header: '심사 상태', render: (row) => <StatusBadge status={row.status} /> },
  {
    header: '업무',
    render: (row) => (
      <Link
        to={`/loan/${row.applicationId}`}
        aria-label={`${row.applicantName} 건 ${getActionLabel(row.status)}`}
        className={
          isActionable(row.status)
            ? 'inline-block w-20 text-center text-xs font-medium px-3 py-1.5 rounded-md bg-primary text-white hover:bg-primary-dark transition-all'
            : 'inline-block w-20 text-center text-xs font-medium px-3 py-1.5 rounded-md border border-border-default bg-white text-text-primary hover:bg-gray-50 transition-all'
        }
      >
        {getActionLabel(row.status)}
      </Link>
    ),
  },
];

/**
 * 리스트(표) 보기 — 기존 DataTable 스타일 + 업무 컬럼.
 */
export function LoanListView({ applications }: LoanListViewProps) {
  return (
    <DataTable
      columns={columns}
      data={applications}
      rowKey={(row) => row.applicationId}
      emptyMessage="조회된 대출 신청 내역이 없습니다."
    />
  );
}
