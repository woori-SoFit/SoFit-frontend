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

/** 날짜 포맷 (YYYY-MM-DD 또는 ISO datetime → YYYY년 M월 D일) */
export function formatDate(dateStr: string): string {
  const dateOnly = dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
  const [y, m, d] = dateOnly.split("-");
  if (!y || !m || !d) return dateStr;
  return `${y}년 ${parseInt(m, 10)}월 ${parseInt(d, 10)}일`;
}

/** 날짜+시간 포맷 (ISO datetime → YYYY년 M월 D일 HH:MM) */
export function formatDateTime(dateStr: string): string {
  const [datePart, timePart] = dateStr.includes("T") ? dateStr.split("T") : [dateStr, ""];
  const [y, m, d] = datePart.split("-");
  if (!y || !m || !d) return dateStr;
  const dateFormatted = `${y}년 ${parseInt(m, 10)}월 ${parseInt(d, 10)}일`;
  if (!timePart) return dateFormatted;
  const [hh, mm] = timePart.split(":");
  return `${dateFormatted} ${hh}:${mm}`;
}

/** 연월 포맷 (YYYY-MM → YYYY년 M월) */
export function formatYearMonth(yyyyMM: string): string {
  if (!yyyyMM) return "";
  const [y, m] = yyyyMM.split("-");
  if (!y || !m) return yyyyMM;
  return `${y}년 ${parseInt(m, 10)}월`;
}

/** 금액 포맷 — 원화 단순 콤마 구분 (예: 1,234,567) */
export function formatCurrency(amount: number): string {
  return amount.toLocaleString("ko-KR");
}

/** 전월 대비 변화율 포맷 */
export function formatChangeRate(rate: number | null): { text: string; isPositive: boolean | null } {
  if (rate === null || rate === undefined) {
    return { text: "—", isPositive: null };
  }
  const isPositive = rate >= 0;
  return { text: `${isPositive ? "+" : ""}${rate.toFixed(1)}%`, isPositive };
}
