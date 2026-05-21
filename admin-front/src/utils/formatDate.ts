/**
 * ISO 8601 날짜 문자열("YYYY-MM-DD")을 "YYYY.MM.DD" 형식으로 변환한다.
 * 유효하지 않은 날짜 형식 입력 시 원본 문자열을 그대로 반환한다 (graceful degradation).
 */
export function formatDate(isoDate: string): string {
  const isoPattern = /^\d{4}-\d{2}-\d{2}$/;

  if (!isoPattern.test(isoDate)) {
    return isoDate;
  }

  return isoDate.replace(/-/g, '.');
}
