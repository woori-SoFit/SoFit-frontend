/**
 * 대출 신청 상세 페이지에서 사용하는 포맷팅 유틸리티 함수 모음
 */

/**
 * 주민번호 마스킹 처리
 * 앞 6자리와 뒷자리 첫 1자리만 노출하고 나머지를 "******"으로 마스킹
 * @param value - 13자리 숫자 또는 "NNNNNN-NNNNNNN" 형식의 주민번호
 * @returns "YYMMDD-N******" 형식의 마스킹된 주민번호
 */
export function maskResidentNumber(value: string): string {
  // 하이픈 제거 후 순수 숫자만 추출
  const digits = value.replace(/-/g, '');
  const front = digits.slice(0, 6);
  const firstBack = digits.slice(6, 7);
  return `${front}-${firstBack}******`;
}

/**
 * 전화번호 포맷팅
 * @param value - 11자리 숫자 문자열
 * @returns "NNN-NNNN-NNNN" 형식의 전화번호
 */
export function formatPhoneNumber(value: string): string {
  const part1 = value.slice(0, 3);
  const part2 = value.slice(3, 7);
  const part3 = value.slice(7, 11);
  return `${part1}-${part2}-${part3}`;
}

/**
 * 통화 포맷팅 (만원 단위)
 * @param value - 양의 정수 (만원 단위)
 * @returns "N,NNN만원" 형식의 통화 문자열
 */
export function formatCurrency(value: number): string {
  const formatted = value.toLocaleString('ko-KR');
  return `${formatted}만원`;
}

/**
 * 사업자등록번호 포맷팅
 * @param value - 10자리 숫자 문자열
 * @returns "NNN-NN-NNNNN" 형식의 사업자등록번호
 */
export function formatBusinessNumber(value: string): string {
  const part1 = value.slice(0, 3);
  const part2 = value.slice(3, 5);
  const part3 = value.slice(5, 10);
  return `${part1}-${part2}-${part3}`;
}

/**
 * 개월 포맷팅
 * @param months - 양의 정수 (개월)
 * @returns "N개월" 형식의 문자열
 */
export function formatMonths(months: number): string {
  return `${months}개월`;
}

/**
 * 업력 포맷팅 (개월 → 년 + 개월)
 * @param months - 양의 정수 (개월)
 * @returns "N년 N개월" 형식의 문자열 (예: 25개월 → "2년 1개월")
 */
export function formatBusinessAge(months: number): string {
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  return `${years}년 ${remainingMonths}개월`;
}

/**
 * 증감률 포맷팅
 * @param value - 실수 (증감률)
 * @returns 양수면 "+N.N%", 음수면 "-N.N%" 형식 (소수점 1자리)
 */
export function formatPercentage(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}

/**
 * 점수 포맷팅
 * @param score - 현재 점수
 * @param max - 최대 점수
 * @returns "N점/M점" 형식의 문자열 (예: "820점/1000점")
 */
export function formatScore(score: number, max: number): string {
  return `${score}점/${max}점`;
}

/**
 * null, undefined, 빈 문자열이면 "-"을 반환하고, 유효한 값이면 문자열 표현을 반환한다.
 * @param value - 표시할 값
 * @returns 유효한 값의 문자열 표현 또는 "-"
 */
export function displayValue(value: unknown): string {
  if (value === null || value === undefined || value === '') return '-';
  return String(value);
}

/**
 * ISO 8601 날짜 문자열을 "YYYY.MM.DD" 형식으로 변환한다.
 * 유효하지 않은 날짜 형식 입력 시 원본 문자열을 그대로 반환한다 (graceful degradation).
 * @param isoDate - "YYYY-MM-DD" 또는 ISO 8601 형식의 날짜 문자열
 * @returns "YYYY.MM.DD" 형식의 날짜 문자열
 */
export function formatDate(isoDate: string): string {
  const isoPattern = /^\d{4}-\d{2}-\d{2}/;
  if (!isoPattern.test(isoDate)) return isoDate;
  return isoDate.slice(0, 10).replace(/-/g, '.');
}
