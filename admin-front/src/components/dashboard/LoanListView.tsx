import { Link } from 'react-router-dom';

import StatusBadge from '@/components/common/StatusBadge';
import DataTable from '@/components/common/DataTable';
import type { Column } from '@/components/common/DataTable';
import type { LoanApplicationItem, ReviewStatus } from '@/types/loan';
import { formatDate, formatCurrency } from '@/utils/formatters';
import { useAuthStore } from '@/stores/authStore';
import type { StatusFilterValue } from '@/hooks/useLoanApplications';

function getActionLabel(status: ReviewStatus | string, canAct: boolean): string {
  if (!canAct) return '조회';
  switch (status) {
    case 'SYSTEM_APPROVED':
    case 'SYSTEM_REJECTED':
      return '심사';
    case 'MANAGER_REVIEW':
      return '최종 심사';
    default:
      return '조회';
  }
}

function isActionable(status: ReviewStatus | string, canAct: boolean): boolean {
  if (!canAct) return false;
  return status === 'SYSTEM_APPROVED' || status === 'SYSTEM_REJECTED' || status === 'MANAGER_REVIEW';
}

interface LoanListViewProps {
  applications: LoanApplicationItem[];
  statusFilter?: StatusFilterValue;
  /** 필터 초기화 콜백 — 전달되면 빈 상태에서 "전체 보기" 버튼 표시 */
  onResetFilter?: () => void;
}

/**
 * 리스트(표) 보기 — 기존 DataTable 스타일 + 업무 컬럼.
 */
export function LoanListView({ applications, statusFilter, onResetFilter }: LoanListViewProps) {
  const user = useAuthStore((s) => s.user);
  const currentUserId = user?.userId;
  const isManager = user?.role === 'ADMIN_BANK_MANAGER';
  const isExecutedFilter = statusFilter === 'EXECUTED';

  const columns: Column<LoanApplicationItem>[] = [
    { header: '신청일', render: (row) => formatDate(row.appliedAt) },
    { header: '사업자(신청자)', render: (row) => `${row.businessName}(${row.applicantName})` },
    { header: '상품명', render: (row) => row.productName, width: '20%' },
    isExecutedFilter
      ? { header: '승인 금액', render: (row) => row.approvedAmount != null ? formatCurrency(row.approvedAmount) : '-' }
      : { header: '신청 금액', render: (row) => row.requestedAmount != null ? formatCurrency(row.requestedAmount) : '-' },
    { header: '담당자', render: (row) => row.assigneeName },
    { header: '심사 상태', render: (row) => <StatusBadge status={row.status} /> },
    {
      header: '업무',
      render: (row) => {
        // 지점장: MANAGER_REVIEW 건은 항상 결재 가능
        // 은행원: 본인 담당 + SYSTEM_APPROVED/SYSTEM_REJECTED 건만 심사 가능
        const canAct = isManager
          ? row.status === 'MANAGER_REVIEW'
          : (currentUserId != null && row.assignedBankerId === currentUserId
            && (row.status === 'SYSTEM_APPROVED' || row.status === 'SYSTEM_REJECTED'));
        const label = getActionLabel(row.status, canAct);
        return (
          <Link
            to={`/loan/${row.applicationId}`}
            aria-label={`${row.applicantName} 건 ${label}`}
            className={
              isActionable(row.status, canAct)
                ? 'inline-block w-20 text-center text-xs font-medium px-3 py-1.5 rounded-md bg-primary text-white hover:bg-primary-dark transition-all'
                : 'inline-block w-20 text-center text-xs font-medium px-3 py-1.5 rounded-md border border-border-default bg-white text-text-primary hover:bg-gray-50 transition-all'
            }
          >
            {label}
          </Link>
        );
      },
    },
  ];

  const emptyContent = onResetFilter ? (
    <div className="flex flex-col items-center gap-3">
      <span className="text-sm text-text-disabled">해당 상태의 신청 건이 없습니다.</span>
      <button
        type="button"
        onClick={onResetFilter}
        className="px-4 py-1.5 text-xs font-medium rounded-md bg-primary text-white hover:bg-primary-dark transition-all"
      >
        전체 보기
      </button>
    </div>
  ) : "조회된 대출 신청 내역이 없습니다.";

  return (
    <DataTable
      columns={columns}
      data={applications}
      rowKey={(row) => row.applicationId}
      emptyMessage={emptyContent}
    />
  );
}
