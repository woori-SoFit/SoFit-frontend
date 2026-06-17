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

/** 휴대폰 번호 포맷 (숫자만 → 010-0000-0000 형식) */
export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
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

/** 숫자 포맷 — null/undefined/NaN 시 "-" 반환 */
export const formatCount = (value?: number | null, unit = ""): string =>
  value == null || Number.isNaN(value) ? "-" : `${value.toLocaleString()}${unit}`;

/** 퍼센트 포맷 — null/undefined/NaN 시 "-" 반환 */
export const formatPercent = (value?: number | null): string =>
  value == null || Number.isNaN(value) ? "-" : `${value}%`;

/** 계좌번호 마스킹 (예: 1002940540000 → 1002-****-40000) */
export function maskAccountNumber(accountNumber: string): string {
  if (accountNumber.length < 8) return accountNumber;
  return `${accountNumber.slice(0, 4)}-****-${accountNumber.slice(-5)}`;
}

/** 날짜를 YYYY.MM.DD 형식으로 표시 */
export function formatDotDate(dateStr: string): string {
  const dateOnly = dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
  const [y, m, d] = dateOnly.split("-");
  if (!y || !m || !d) return dateStr;
  return `${y}.${m.padStart(2, "0")}.${d.padStart(2, "0")}`;
}

/** 날짜 문자열에서 요일을 반환 (일, 월, 화, ...) */
export function getDayOfWeek(dateStr: string): string {
  const dateOnly = dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
  const date = new Date(dateOnly);
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return days[date.getDay()];
}

/** 실행일 기준으로 다음 상환일(매월 동일 일자)을 YYYY-MM-DD로 반환 */
export function getNextRepaymentDate(executedAt: string): string {
  const now = new Date();
  const dateOnly = executedAt.includes("T") ? executedAt.split("T")[0] : executedAt;
  const [, , dayStr] = dateOnly.split("-");
  const repayDay = parseInt(dayStr, 10);

  const thisMonth = new Date(now.getFullYear(), now.getMonth(), repayDay);
  if (thisMonth > now) {
    return toISODate(thisMonth);
  }
  return toISODate(new Date(now.getFullYear(), now.getMonth() + 1, repayDay));
}

/** Date 객체를 YYYY-MM-DD 문자열로 변환 */
export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** 차트 Y축 만원 단위 포맷 (예: 5000000 → "500만") */
export function formatYAxis(value: number): string {
  const man = Math.round(value / 10000);
  return man === 0 ? "0" : `${man.toLocaleString()}만`;
}

/** "YYYY-MM" → "M월" 형식으로 변환 */
export function toMonthLabel(yyyyMM: string): string {
  const month = parseInt(yyyyMM.split("-")[1], 10);
  return `${month}월`;
}
