/**
 * "우리 가게는 다른 가게보다 잘하고 있나요?" 카테고리 상세 화면
 *
 * 표시 데이터:
 * - 종합 한줄 요약
 * - 매출/수익성/안정성 3개 순위 시각화 (GaugeBar 재활용)
 * - 순위별 의미 설명
 */
import { Trophy } from "lucide-react";
import { GaugeBar } from "./GaugeBar";
import type { BizDashboardData } from "@/types/bizData";

interface IndustryDashboardProps {
  data: BizDashboardData;
}

/** 순위에 따른 평가 텍스트 + 색상 */
function getRankEvaluation(percent: number): { text: string; color: string; bgColor: string } {
  if (percent <= 20) {
    return { text: "상위권이에요, 업종 내 경쟁력이 높아요", color: "text-success", bgColor: "bg-success/10" };
  }
  if (percent <= 40) {
    return { text: "평균 이상이에요, 좋은 흐름이에요", color: "text-info", bgColor: "bg-info/10" };
  }
  return { text: "개선이 필요해요, 전략을 점검해보세요", color: "text-warning", bgColor: "bg-warning/10" };
}

/** 종합 순위 계산 (3개 평균) */
function getOverallRank(sales: number, profit: number, stability: number): number {
  return Math.round((sales + profit + stability) / 3);
}

export function IndustryDashboard({ data }: IndustryDashboardProps) {
  const { industryName, revenue: salesRank, profitability: profitRank, stability: stabilityRank } = data.industryComparison;

  const overallRank = getOverallRank(salesRank, profitRank, stabilityRank);
  const overallEval = getRankEvaluation(overallRank);

  const ranks = [
    { label: "매출", percent: salesRank, color: "bg-success" },
    { label: "수익성", percent: profitRank, color: "bg-primary" },
    { label: "안정성", percent: stabilityRank, color: "bg-secondary" },
  ];

  return (
    <div className="flex flex-col gap-4 px-5 py-4">
      {/* 종합 한줄 요약 */}
      <div className="bg-bg-surface rounded-xl p-5 border border-border-default text-center">
        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-3">
          <Trophy size={24} className="text-primary" />
        </div>
        <p className="text-lg font-bold text-text-primary mb-1">
          업종 내 상위 {overallRank}%
        </p>
        <p className="text-xs text-text-secondary">
          {industryName} 업종 평균과 비교한 종합 순위예요
        </p>
        <div className={`inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full ${overallEval.bgColor}`}>
          <span className={`text-xs font-medium ${overallEval.color}`}>{overallEval.text}</span>
        </div>
      </div>

      {/* 3개 순위 시각화 */}
      <div className="bg-bg-surface rounded-xl p-5 border border-border-default">
        <h3 className="text-sm font-semibold text-text-primary mb-1">업종 평균과 비교</h3>
        <p className="text-xs text-text-secondary mb-4">
          사장님 업종({industryName}) 평균과 비교했어요
        </p>
        <div className="flex flex-col gap-5">
          {ranks.map((rank) => (
            <div key={rank.label}>
              <GaugeBar
                label={rank.label}
                percent={rank.percent}
                color={rank.color}
                tooltip={
                  rank.label === "수익성"
                    ? "매출 대비 이익이 얼마나 남는지를 업종 평균과 비교해 보여줘요."
                    : rank.label === "안정성"
                      ? "매출과 현금 흐름이 얼마나 꾸준한지를 업종 평균과 비교해 보여줘요."
                      : undefined
                }
              />
            </div>
          ))}
        </div>
      </div>

      {/* 순위별 의미 설명 */}
      <div className="bg-bg-surface rounded-xl p-5 border border-border-default">
        <h3 className="text-sm font-semibold text-text-primary mb-3">순위가 의미하는 것</h3>
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-xs font-bold text-success">A</span>
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">상위 0~20%</p>
              <p className="text-xs text-text-secondary">상위권이에요, 업종 내 경쟁력이 높아요</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-info/10 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-xs font-bold text-info">B</span>
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">상위 20~40%</p>
              <p className="text-xs text-text-secondary">평균 이상이에요, 좋은 흐름을 유지하고 있어요</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-warning/10 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-xs font-bold text-warning">C</span>
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">상위 40% 이상</p>
              <p className="text-xs text-text-secondary">개선이 필요해요, 전략을 점검해보세요</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
