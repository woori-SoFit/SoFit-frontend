/**
 * 공통 포맷 유틸리티 함수
 */

/** 금액 포맷 (원 → 만원/억원 표시) */
export function formatAmount(won: number): string {
  const man = won / 10_000;
  if (man >= 10_000) return `${(man / 10_000).toFixed(0)}억원`;
  return `${man.toLocaleString()}만원`;
}

/** 금액 포맷 — "최대" 접두사 포함 */
export function formatMaxAmount(amount: number): string {
  const man = amount / 10_000;
  if (man >= 10_000) return `최대 ${(man / 10_000).toFixed(0)}억원`;
  return `최대 ${man.toLocaleString()}만원`;
}

/** 기간 포맷 (개월 → "N개월 이내") */
export function formatMaxTerm(maxTerm: number): string {
  return `${maxTerm}개월 이내`;
}

/** 날짜 포맷 (YYYY-MM-DD → YYYY.MM.DD) */
export function formatDate(dateStr: string): string {
  return dateStr.replace(/-/g, ".");
}
