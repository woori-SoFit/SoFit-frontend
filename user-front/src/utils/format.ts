/**
 * 공통 포맷 유틸리티 함수
 */

/** 금액 포맷 (원 → 만원/억원 표시) */
export function formatAmount(won: number): string {
  const man = won / 10_000;
  if (man >= 10_000) return `${(man / 10_000).toFixed(0)}억원`;
  return `${man.toLocaleString()}만원`;
}

/** 날짜 포맷 (YYYY-MM-DD → YYYY.MM.DD) */
export function formatDate(dateStr: string): string {
  return dateStr.replace(/-/g, ".");
}
