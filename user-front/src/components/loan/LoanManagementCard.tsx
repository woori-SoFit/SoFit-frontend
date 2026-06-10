/**
 * 대출 관리 카드 컴포넌트
 * 실행 완료된 대출 정보를 카드 형태로 표시
 *
 * - 월 납부 금액: loanCalc 유틸로 상환방식/기간 기반 계산
 * - 다음 상환일: 실행일 기준 매월 동일 일자로 계산
 */
import { formatCurrency, formatDotDate, getDayOfWeek } from "@/utils/format";
import { getFirstMonthPayment } from "@/utils/loanCalc";
import type { RepaymentMethod } from "@/utils/loanCalc";
import type { LoanManagementItem } from "@/types/loan";

/** 상환방식 라벨 변환 */
function getRepaymentLabel(method: string): string {
  switch (method) {
    case "EQUAL_PRINCIPAL_AND_INTEREST":
      return "원리금균등";
    case "EQUAL_PRINCIPAL":
      return "원금균등";
    case "BULLET":
      return "만기일시";
    default:
      return method;
  }
}

/** 실행일 기준으로 다음 상환일(매월 동일 일자) 계산 */
function getNextRepaymentDate(executedAt: string): string {
  const now = new Date();
  const dateOnly = executedAt.includes("T") ? executedAt.split("T")[0] : executedAt;
  const [, , dayStr] = dateOnly.split("-");
  const repayDay = parseInt(dayStr, 10);

  // 이번 달 상환일
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), repayDay);

  // 이번 달 상환일이 오늘 이후면 이번 달, 아니면 다음 달
  if (thisMonth > now) {
    return toISODate(thisMonth);
  }
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, repayDay);
  return toISODate(nextMonth);
}

/** Date → YYYY-MM-DD 문자열 */
function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

interface LoanManagementCardProps {
  item: LoanManagementItem;
}

export function LoanManagementCard({ item }: LoanManagementCardProps) {
  const cardBase = "rounded-xl px-5 py-3 bg-gradient-to-br from-white to-[#f0f4f8] border border-gray-200";

  // 월 납부 금액 계산
  const monthlyPayment = getFirstMonthPayment(
    item.executedAmount,
    item.approvedRate,
    item.approvedTerm,
    item.repaymentMethod as RepaymentMethod
  );

  // 다음 상환일 계산
  const nextRepaymentDate = getNextRepaymentDate(item.executedAt);

  return (
    <div className={cardBase}>
      {/* 상단: 상품명 + 아이콘 */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="mt-2 text-base font-bold text-text-primary">
            {item.productName}
          </h3>
          <p className="text-xs text-text-secondary mt-0.5">
            실행일 {formatDotDate(item.executedAt)}
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gray-100">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 21H21M4 18H20M5 18V10M19 18V10M9 18V10M15 18V10M12 3L21 10H3L12 3Z"
              stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <hr className="border-gray-200 my-3" />

      {/* 실행 금액 + 다음 상환일 */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <p className="text-sm text-text-secondary">남은 원금</p>
          <p className="text-lg font-bold text-text-primary">
            {formatCurrency(item.executedAmount)}
            <span className="text-sm font-medium">원</span>
          </p>
          <p className="text-xs text-text-secondary font-semibold mt-1">
            원금 {formatCurrency(item.executedAmount)}원
          </p>
        </div>
        <div>
          <p className="text-sm text-text-secondary">다음 상환일</p>
          <p className="text-lg font-bold text-text-primary">
            {formatDotDate(nextRepaymentDate)}
            <span className="text-sm font-medium ml-1">({getDayOfWeek(nextRepaymentDate)})</span>
          </p>
          <p className="text-xs text-text-secondary font-semibold mt-1">
            연 {item.approvedRate}% · {getRepaymentLabel(item.repaymentMethod)}
          </p>
        </div>
      </div>

      {/* 매월 납부 금액 */}
      <div className="flex items-center justify-between px-4 py-3 rounded-xl border bg-gray-50 border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md flex items-center justify-center bg-primary/10">
            <span className="text-xs font-bold text-primary">₩</span>
          </div>
          <span className="text-sm font-medium text-text-primary">매월 납부 금액</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-base font-bold text-primary">
            {formatCurrency(monthlyPayment)}원
          </span>
        </div>
      </div>
    </div>
  );
}
