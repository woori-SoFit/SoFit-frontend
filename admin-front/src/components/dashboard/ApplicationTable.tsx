import { Link } from 'react-router-dom';

import StatusBadge from '@/components/common/StatusBadge';
import DataTable from '@/components/common/DataTable';
import type { Column } from '@/components/common/DataTable';
import type { LoanApplicationItem } from '@/types/loan';
import { formatDate, formatCurrency } from '@/utils/formatters';

interface ApplicationTableProps {
  applications: LoanApplicationItem[];
}

const columns: Column<LoanApplicationItem>[] = [
  { header: '신청일', render: (row) => formatDate(row.appliedAt) },
  { header: '사업자(신청자)', render: (row) => `${row.businessName}(${row.applicantName})` },
  { header: '상품명', render: (row) => row.productName, width: '20%' },
  { header: '신청 금액', render: (row) => row.requestedAmount != null ? formatCurrency(row.requestedAmount) : '-' },
  { header: '담당자', render: (row) => row.assigneeName },
  { header: '심사 상태', render: (row) => <StatusBadge status={row.status} /> },
  {
    header: '상세 정보',
    render: (row) => (
      <Link
        to={`/loan/${row.applicationId}`}
        aria-label={`${row.applicantName} 신청 건 상세보기`}
        className="text-primary hover:text-primary/80 font-medium"
      >
        상세보기
      </Link>
    ),
  },
];

/**
 * 대출 신청 목록을 테이블로 렌더링하는 컴포넌트.
 * 서버에서 정렬된 데이터를 그대로 표시합니다.
 */
export function ApplicationTable({ applications }: ApplicationTableProps) {
  return (
    <DataTable
      columns={columns}
      data={applications}
      rowKey={(row) => row.applicationId}
      emptyMessage="조회된 대출 신청 내역이 없습니다."
    />
  );
}
