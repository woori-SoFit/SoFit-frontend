/**
 * "실제로 얼마나 남았나요?" 카테고리 상세 화면
 *
 * 표시 데이터:
 * - 추정 순이익 + 현금 흐름 (2열 메인 카드)
 * - 최근 6개월 입출금 흐름 차트 (기존 TransactionBarChart 재활용)
 * - 월 입금액 / 월 출금액 (2열)
 * - 대출 잔액
 */
import { ArrowDownLeft, ArrowUpRight, Landmark } from "lucide-react";
import { TransactionBarChart } from "./TransactionBarChart";
import { formatCurrency, formatChangeRate } from "@/utils/format";
import type { BizDashboardData } from "@/types/bizData";

interface ProfitDashboardProps {
  data: BizDashboardData;
}

export function ProfitDashboard({ data }: ProfitDashboardProps) {
  // 현금 흐름 전월 대비 (매출 증감률을 근사치로 사용)
  const cashFlowChange = formatChangeRate(data.monthOverMonthChange);
  const cashFlowChangeColor =
    cashFlowChange.isPositive === null
      ? "text-text-secondary"
      : cashFlowChange.isPositive
        ? "text-success"
        : "text-error";

  // 최근 월의 입금/출금 (transactionFlow 마지막 항목)
  const latestFlow = data.transactionFlow.length > 0
    ? data.transactionFlow[data.transactionFlow.length - 1]
    : null;

  return (
    <div className="flex flex-col gap-4 px-5 py-4">
      {/* 추정 순이익 + 현금 흐름 2열 */}
      <div className="grid grid-cols-2 gap-3">
        {/* 추정 순이익 */}
        <div className="bg-bg-surface rounded-xl p-4 border border-border-default">
          <p className="text-xs text-text-secondary mb-1">추정 순이익</p>
          <p className="text-xl font-bold text-text-primary">
            {formatCurrency(data.netProfit)}원
          </p>
        </div>

        {/* 현금 흐름 */}
        <div className="bg-bg-surface rounded-xl p-4 border border-border-default">
          <p className="text-xs text-text-secondary mb-1">현금 흐름</p>
          <p className="text-xl font-bold text-text-primary">
            {formatCurrency(data.cashFlow)}원
          </p>
          {cashFlowChange.isPositive !== null && (
            <div className="flex items-center gap-1 mt-1">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${cashFlowChange.isPositive ? "bg-success/10" : "bg-error/10"}`}>
                {cashFlowChange.isPositive
                  ? <ArrowUpRight size={10} className="text-success" />
                  : <ArrowDownLeft size={10} className="text-error" />
                }
              </div>
              <span className={`text-xs font-medium ${cashFlowChangeColor}`}>
                전월 대비 {cashFlowChange.text} 증가
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 최근 6개월 입출금 흐름 차트 (기존 TransactionBarChart 재활용) */}
      {data.transactionFlow.length > 0 && (
        <div className="bg-bg-surface rounded-xl p-4 border border-border-default">
          <TransactionBarChart data={data.transactionFlow} />
        </div>
      )}

      {/* 월 입금액 / 월 출금액 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-bg-surface rounded-xl p-4 border border-border-default flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <ArrowDownLeft size={18} className="text-blue-500" />
          </div>
          <div>
            <p className="text-xs text-text-secondary mb-0.5">월 입금액</p>
            <p className="text-sm font-bold text-text-primary">
              {latestFlow ? `${formatCurrency(latestFlow.income)}원` : "-"}
            </p>
          </div>
        </div>
        <div className="bg-bg-surface rounded-xl p-4 border border-border-default flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
            <ArrowUpRight size={18} className="text-gray-500" />
          </div>
          <div>
            <p className="text-xs text-text-secondary mb-0.5">월 출금액</p>
            <p className="text-sm font-bold text-text-primary">
              {latestFlow ? `${formatCurrency(latestFlow.expense)}원` : "-"}
            </p>
          </div>
        </div>
      </div>

      {/* 대출 잔액 */}
      <div className="bg-bg-surface rounded-xl p-4 border border-border-default flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
          <Landmark size={18} className="text-amber-600" />
        </div>
        <div>
          <p className="text-xs text-text-secondary mb-0.5">대출 잔액</p>
          <p className="text-lg font-bold text-text-primary">
            {formatCurrency(data.loanBalance)}원
          </p>
        </div>
      </div>
    </div>
  );
}
