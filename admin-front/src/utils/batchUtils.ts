/** 배치 상태별 배지 스타일 */
export function getBatchStatusBadge(status: string) {
  switch (status) {
    case 'COMPLETED':
      return { className: 'bg-green-100 text-green-700', label: '성공' };
    case 'FAILED':
      return { className: 'bg-red-100 text-red-700', label: '실패' };
    case 'RUNNING':
      return { className: 'bg-blue-100 text-blue-700', label: '실행 중' };
    default:
      return { className: 'bg-gray-100 text-gray-700', label: status };
  }
}
