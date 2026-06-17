/**
 * "우리 가게는 다른 가게보다 잘하고 있나요?" 카테고리 상세 화면
 *
 * 표시 데이터:
 * - 업종/상권 탭 전환
 * - 종합 요약 카드
 * - 매출/수익성/고객만족도 3개 순위 GaugeBar
 * - 순위 의미 팝오버
 */
import { useState, useRef, useEffect } from "react";
import { HelpCircle, X } from "lucide-react";
import { GaugeBar } from "./GaugeBar";
import { formatCurrency, formatPercent } from "@/utils/format";
import type { BizDashboardData } from "@/types/bizData";

interface IndustryDashboardProps {
  data: BizDashboardData;
}

type TabType = "industry" | "district";

/** 순위 % → 평가 텍스트 + 색상 */
function getRankEvaluation(percent: number): { text: string; color: string; bgColor: string } {
  if (percent <= 25) {
    return { text: "상위권이에요", color: "text-success", bgColor: "bg-success/10" };
  }
  if (percent <= 50) {
    return { text: "평균 이상이에요", color: "text-info", bgColor: "bg-info/10" };
  }
  return { text: "개선이 필요해요", color: "text-warning", bgColor: "bg-warning/10" };
}

/** 3개 순위 평균 */
function getOverallRank(a: number, b: number, c: number): number {
  return Math.round((a + b + c) / 3);
}

/** 종합 순위 등급 설명 팝오버 (요약 카드용) */
function GradeInfoPopover({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute right-0 bottom-full mb-2 z-30 w-56 bg-bg-surface rounded-xl border border-border-default shadow-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-text-primary">순위 등급 기준</p>
        <button type="button" onClick={onClose} className="text-text-secondary hover:text-text-primary">
          <X size={16} />
        </button>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-success">A</span>
          </div>
          <p className="text-xs text-text-secondary whitespace-nowrap">상위 0~25%&nbsp;&nbsp;상위권이에요</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-info/10 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-info">B</span>
          </div>
          <p className="text-xs text-text-secondary whitespace-nowrap">상위 25~50%&nbsp;&nbsp;평균 이상이에요</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-warning/10 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-warning">C</span>
          </div>
          <p className="text-xs text-text-secondary whitespace-nowrap">상위 50% 이상&nbsp;&nbsp;개선이 필요해요</p>
        </div>
      </div>
    </div>
  );
}

/** 지표 설명 팝오버 (GaugeBar 섹션용) */
function MetricInfoPopover({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute right-0 bottom-full mb-2 z-30 w-68 bg-bg-surface rounded-xl border border-border-default shadow-lg p-4" style={{ width: "17rem" }}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-text-primary">지표 설명</p>
        <button type="button" onClick={onClose} className="text-text-secondary hover:text-text-primary">
          <X size={16} />
        </button>
      </div>
      <div className="flex flex-col gap-2.5">
        <div className="flex gap-2">
          <span className="w-16 text-xs font-semibold text-text-primary shrink-0">매출</span>
          <p className="text-xs text-text-secondary">이번 달 매출 기준으로 같은 업종/상권과 비교한 순위예요</p>
        </div>
        <div className="flex gap-2">
          <span className="w-16 text-xs font-semibold text-text-primary shrink-0">수익성</span>
          <p className="text-xs text-text-secondary">매출 대비 이익이 얼마나 남는지를 비교한 순위예요</p>
        </div>
        <div className="flex gap-2">
          <span className="w-16 text-xs font-semibold text-text-primary shrink-0">고객만족도</span>
          <p className="text-xs text-text-secondary">리뷰 평점을 기준으로 고객 만족도를 비교한 순위예요</p>
        </div>
      </div>
    </div>
  );
}

/** 순위 % → GaugeBar/텍스트 색상 */
function getRankColor(percent: number): string {
  if (percent <= 25) return "bg-success";
  if (percent <= 50) return "bg-info";
  return "bg-warning";
}

export function IndustryDashboard({ data }: IndustryDashboardProps) {
  const [tab, setTab] = useState<TabType>("industry");
  const [showGradePopover, setShowGradePopover] = useState(false);
  const [showMetricPopover, setShowMetricPopover] = useState(false);
  const gradePopoverRef = useRef<HTMLDivElement>(null);
  const metricPopoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (gradePopoverRef.current && !gradePopoverRef.current.contains(e.target as Node)) {
        setShowGradePopover(false);
      }
      if (metricPopoverRef.current && !metricPopoverRef.current.contains(e.target as Node)) {
        setShowMetricPopover(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const isIndustry = tab === "industry";

  const salesRank = isIndustry ? data.industrySalesRank : data.districtSalesRank;
  const profitRank = isIndustry ? data.industryProfitRank : data.districtProfitRank;
  const satisfactionRank = isIndustry ? data.industrySatisfactionRank : data.districtSatisfactionRank;
  const overallRank = getOverallRank(salesRank, profitRank, satisfactionRank);
  const overallEval = getRankEvaluation(overallRank);
  const compareLabel = isIndustry ? `${data.industryName} 업종` : "우리 동네 상권";

  const ranks = [
    { label: "매출", percent: salesRank },
    { label: "수익성", percent: profitRank },
    { label: "고객만족도", percent: satisfactionRank },
  ];

  return (
    <div className="flex flex-col gap-3 px-5 py-4">
      {/* 업종 / 상권 탭 */}
      <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
        <button
          type="button"
          onClick={() => setTab("industry")}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
            tab === "industry"
              ? "bg-bg-surface text-text-primary shadow-sm"
              : "text-text-secondary"
          }`}
        >
          업종
        </button>
        <button
          type="button"
          onClick={() => setTab("district")}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
            tab === "district"
              ? "bg-bg-surface text-text-primary shadow-sm"
              : "text-text-secondary"
          }`}
        >
          상권
        </button>
      </div>

      {/* 종합 요약 카드 */}
      <div className="bg-bg-surface rounded-xl p-4 border border-border-default text-center relative">
        {/* 등급 기준 툴팁 버튼 */}
        <div className="absolute top-3 right-3" ref={gradePopoverRef}>
          <button
            type="button"
            onClick={() => setShowGradePopover((v) => !v)}
            className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            aria-label="등급 기준 보기"
          >
            <HelpCircle size={15} className="text-text-secondary" />
          </button>
          {showGradePopover && <GradeInfoPopover onClose={() => setShowGradePopover(false)} />}
        </div>
        <p className="text-xs text-text-secondary mb-1">{compareLabel} 평균과 비교</p>
        <p className="text-2xl font-bold text-text-primary mb-2">
          상위 <span className={overallEval.color}>{overallRank}%</span>
        </p>
        <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${overallEval.bgColor}`}>
          <span className={`text-xs font-medium ${overallEval.color}`}>{overallEval.text}</span>
        </div>
      </div>

      {/* 순위 시각화 */}
      <div className="bg-bg-surface rounded-xl p-5 border border-border-default">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-text-primary">{compareLabel}과 비교</h3>
            <p className="text-xs text-text-secondary mt-0.5">숫자가 낮을수록 상위권이에요</p>
          </div>
          <div className="relative" ref={metricPopoverRef}>
            <button
              type="button"
              onClick={() => setShowMetricPopover((v) => !v)}
              className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              aria-label="지표 설명 보기"
            >
              <HelpCircle size={15} className="text-text-secondary" />
            </button>
            {showMetricPopover && <MetricInfoPopover onClose={() => setShowMetricPopover(false)} />}
          </div>
        </div>
        <div className="flex flex-col gap-5">
          {ranks.map((rank) => (
            <GaugeBar
              key={rank.label}
              label={rank.label}
              percent={rank.percent}
              color={getRankColor(rank.percent)}
            />
          ))}
        </div>
      </div>

      {/* 평균 비교 표 */}
      <div className="bg-bg-surface rounded-xl border border-border-default overflow-hidden">
        <div className="px-5 pt-4 pb-3">
          <h3 className="text-sm font-semibold text-text-primary">{compareLabel} 평균 비교</h3>
        </div>
        <table className="w-full table-fixed">
          <thead>
            <tr className="bg-gray-50 border-y border-border-default">
              <th className="w-1/3 text-left text-xs font-medium text-text-secondary px-5 py-2.5">지표</th>
              <th className="w-1/3 text-right text-xs font-medium text-text-secondary px-4 py-2.5">내 가게</th>
              <th className="w-1/3 text-right text-xs font-medium text-text-secondary px-5 py-2.5">{isIndustry ? "업종" : "상권"} 평균</th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                label: "매출",
                mine: formatCurrency(data.monthlyRevenue) + "원",
                avg: formatCurrency(isIndustry ? data.industryAvgRevenue : data.districtAvgRevenue) + "원",
                isPositive: data.monthlyRevenue >= (isIndustry ? data.industryAvgRevenue : data.districtAvgRevenue),
              },
              {
                label: "수익률",
                mine: formatPercent(data.monthlyProfitRate),
                avg: formatPercent(isIndustry ? data.industryAvgProfitRate : data.districtAvgProfitRate),
                isPositive: data.monthlyProfitRate >= (isIndustry ? data.industryAvgProfitRate : data.districtAvgProfitRate),
              },
              {
                label: "리뷰 평점",
                mine: `${data.reviewRating.toFixed(1)}점`,
                avg: `${(isIndustry ? data.industryAvgReviewRating : data.districtAvgReviewRating).toFixed(1)}점`,
                isPositive: data.reviewRating >= (isIndustry ? data.industryAvgReviewRating : data.districtAvgReviewRating),
              },
            ].map((row, idx, arr) => (
              <tr key={row.label} className={idx < arr.length - 1 ? "border-b border-border-default" : ""}>
                <td className="px-5 py-4 text-sm font-medium text-text-primary">{row.label}</td>
                <td className={`px-4 py-4 text-right text-sm font-bold ${row.isPositive ? "text-primary" : "text-error"}`}>
                  {row.mine}
                </td>
                <td className="px-5 py-4 text-right text-sm text-text-secondary">{row.avg}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
