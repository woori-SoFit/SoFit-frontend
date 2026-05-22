import { useNavigate } from 'react-router-dom';
import { useManagerApprovals } from '@/hooks/useManagerApprovals';
import { formatCurrency, formatDate } from '@/utils/formatters';
import LoadingState from '@/components/common/LoadingState';
import ErrorState from '@/components/common/ErrorState';
import Button from '@/components/common/Button';

/**
 * 지점장 결재 페이지.
 * MANAGER_REVIEW 상태인 대출 신청 건 목록을 테이블로 표시하고,
 * 각 건의 상세보기 버튼으로 대출 상세 페이지로 이동할 수 있다.
 */
export default function ManagerApprovalPage() {
  const navigate = useNavigate();
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

      {/* 빈 목록 */}
      {!isLoading && !isError && data && data.length === 0 && (
        <div className="flex items-center justify-center py-16">
          <p className="text-sm text-text-secondary">결재 대기 중인 건이 없습니다.</p>
        </div>
      )}

      {/* 테이블 */}
      {!isLoading && !isError && data && data.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-border-default bg-bg-surface shadow-card">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border-default bg-gray-50">
                <th className="px-4 py-3 font-medium text-text-secondary">신청일</th>
                <th className="px-4 py-3 font-medium text-text-secondary">신청자명</th>
                <th className="px-4 py-3 font-medium text-text-secondary">사업자명</th>
                <th className="px-4 py-3 font-medium text-text-secondary">요청 은행원</th>
                <th className="px-4 py-3 font-medium text-text-secondary text-right">신청 금액</th>
                <th className="px-4 py-3 font-medium text-text-secondary text-center">상세</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-border-default last:border-b-0 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 text-text-primary">{formatDate(item.applicationDate)}</td>
                  <td className="px-4 py-3 text-text-primary">{item.applicantName}</td>
                  <td className="px-4 py-3 text-text-primary">{item.businessName}</td>
                  <td className="px-4 py-3 text-text-primary">{item.requestedByName}</td>
                  <td className="px-4 py-3 text-text-primary text-right">
                    {formatCurrency(item.requestedAmount)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/loan/${item.id}`)}
                    >
                      상세보기
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
