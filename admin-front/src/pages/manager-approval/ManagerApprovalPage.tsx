import { useNavigate } from 'react-router-dom';
import { useManagerApprovals } from '@/hooks/useManagerApprovals';
import { formatCurrency } from '@/utils/formatters';

/**
 * 신청일을 "YYYY.MM.DD" 형식으로 변환한다.
 */
function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return isoDate;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

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
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-text-secondary">데이터를 불러오는 중입니다</p>
        </div>
      )}

      {/* 에러 상태 */}
      {isError && (
        <div className="flex flex-col items-center justify-center py-16">
          <p className="mb-4 text-sm text-text-secondary">데이터를 불러오는 중 오류가 발생했습니다.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-text-inverse hover:bg-primary-dark transition-colors"
          >
            다시 시도
          </button>
        </div>
      )}

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
                    {formatCurrency(item.desiredAmount)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => navigate(`/loan/${item.id}`)}
                      className="rounded-md border border-primary px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/5"
                    >
                      상세보기
                    </button>
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
