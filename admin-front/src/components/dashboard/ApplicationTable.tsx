import { Link } from 'react-router-dom';

import StatusBadge from '@/components/common/StatusBadge';
import type { LoanApplication } from '@/types';
import { formatDate } from '@/utils/formatDate';

interface ApplicationTableProps {
  applications: LoanApplication[];
}

const TABLE_HEADERS = ['신청일', '신청자명', '사업자명', '상품명', '담당자', '심사 상태', '상세 정보'];

/**
 * 대출 신청 목록을 테이블로 렌더링하는 컴포넌트.
 * 서버에서 정렬된 데이터를 그대로 표시합니다.
 */
export function ApplicationTable({ applications }: ApplicationTableProps) {

  return (
    <div className="bg-white rounded-lg border border-border-default overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-border-default">
          <tr>
            {TABLE_HEADERS.map((header) => (
              <th
                key={header}
                className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {applications.length === 0 ? (
            <tr>
              <td
                colSpan={TABLE_HEADERS.length}
                className="px-4 py-12 text-center text-sm text-text-disabled"
              >
                조회된 대출 신청 내역이 없습니다.
              </td>
            </tr>
          ) : (
            applications.map((application) => (
              <tr
                key={application.id}
                className="border-b border-border-default last:border-b-0 hover:bg-gray-50"
              >
                <td className="px-4 py-3 text-sm text-text-primary">
                  {formatDate(application.applicationDate)}
                </td>
                <td className="px-4 py-3 text-sm text-text-primary">
                  {application.applicantName}
                </td>
                <td className="px-4 py-3 text-sm text-text-primary">
                  {application.businessName}
                </td>
                <td className="px-4 py-3 text-sm text-text-primary">
                  {application.productName}
                </td>
                <td className="px-4 py-3 text-sm text-text-primary">
                  {application.assigneeName}
                </td>
                <td className="px-4 py-3 text-sm">
                  <StatusBadge status={application.reviewStatus} />
                </td>
                <td className="px-4 py-3 text-sm">
                  <Link
                    to={`/loan/${application.id}`}
                    aria-label={`${application.applicantName} 신청 건 상세보기`}
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    상세보기
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
