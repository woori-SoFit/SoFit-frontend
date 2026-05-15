const TABLE_COLUMNS = [
  "신청번호",
  "사업자명",
  "상품명",
  "신청금액",
  "신청일",
  "상태",
];

export default function DashboardPage() {
  // TODO: React Query로 대출 신청 목록 조회
  const applications: unknown[] = [];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-text-primary mb-6">
        대출 현황 대시보드
      </h1>

      <div className="bg-white rounded-lg border border-border-default overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-border-default">
            <tr>
              {TABLE_COLUMNS.map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 && (
              <tr>
                <td
                  colSpan={TABLE_COLUMNS.length}
                  className="px-4 py-12 text-center text-sm text-text-disabled"
                >
                  조회된 대출 신청 내역이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
