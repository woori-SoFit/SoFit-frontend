/**
 * S등급 분석 결과 스텝
 *
 * 사용자의 S등급 분석 결과를 표시.
 * "상세 리포트 보기" 클릭 시 GradeReportDetailPage로 이동.
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sprout } from "lucide-react";
import { FeatureCard } from "@/components/grade/FeatureCard";
import { BottomButton } from "@/components/common/BottomButton";
import { useMe } from "@/hooks/useMe";
import { fetchGradeDetail } from "@/api/gradeApi";
import type { GradeResult } from "@/api/gradeApi";

const ALL_GRADES = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8", "S9", "S10"];

interface GradeResultStepProps {
  gradeResult: GradeResult | null;
  message?: string;
}

export function GradeResultStep({ gradeResult, message }: GradeResultStepProps) {
  const navigate = useNavigate();
  const { me } = useMe();
  const userName = me?.name ?? "";
  const [isLoading, setIsLoading] = useState(false);

  const handleDetailReport = async () => {
    setIsLoading(true);
    try {
      const detail = await fetchGradeDetail();
      navigate("/grade-report/detail", { state: { detail } });
    } catch {
      // API 실패 시에도 페이지 이동 (데이터 없이)
      navigate("/grade-report/detail");
    } finally {
      setIsLoading(false);
    }
  };

  if (!gradeResult) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-5">
        <p className="text-text-secondary text-center">
          {message || '아직 성장 S등급이 산출되지 않았어요.'}
        </p>
      </div>
    );
  }

  const grade = gradeResult.sGrade;
  const gradeDescription = gradeResult.comment;
  const gradeDetail = gradeResult.commentDetail;

  return (
    <div className="flex flex-col h-full">
      {/* 컨텐츠 영역 */}
      <div className="flex-1 flex flex-col items-center px-5 pt-8 overflow-y-auto">
        {/* 사용자 이름 + S등급 안내 */}
        <h2 className="text-xl font-bold text-text-primary text-center leading-snug">
          {userName} 사장님의
          <br />
          성장 S등급이에요!
        </h2>

        {/* S등급 표시 - 두 원 (연한 하늘색) */}
        <div className="relative flex items-center justify-center mt-10 mb-8">
          {/* 바깥 원 */}
          <div
            className="w-44 h-44 rounded-full bg-sky-50 flex items-center justify-center"
            style={{ animation: "pulse-outer 2s ease-in-out infinite" }}
          >
            {/* 안쪽 원 */}
            <div
              className="w-36 h-36 rounded-full bg-sky-100"
              style={{ animation: "pulse-inner 2s ease-in-out infinite" }}
            />
          </div>

          {/* 등급 텍스트 — 원 위에 고정 */}
          <span className="absolute text-5xl font-bold text-primary">
            {grade}
          </span>
        </div>

        {/* 등급 수준 섹션 */}
        <div className="w-full bg-white rounded-xl p-5 shadow-card border border-border-default mt-9">
          <h3 className="text-base font-bold text-text-primary mb-4">등급 수준</h3>

          {/* 현재 등급 화살표 표시 */}
          <div className="grid grid-cols-10 gap-0.5 mb-1">
            {ALL_GRADES.map((g) => (
              <div key={`arrow-${g}`} className="flex justify-center">
                {g === grade && (
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                    <path d="M6 8L0 0H12L6 8Z" fill="#1E293B" />
                  </svg>
                )}
              </div>
            ))}
          </div>

          {/* 등급 바 */}
          <div className="grid grid-cols-10 gap-0.5 mb-3">
            {ALL_GRADES.map((g) => (
              <div
                key={g}
                className={`h-8 flex items-center justify-center rounded text-xs font-medium ${
                  g === grade
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-text-secondary"
                }`}
              >
                {g}
              </div>
            ))}
          </div>

          {/* 높은 등급 / 낮은 등급 라벨 */}
          <div className="flex justify-between items-center mt-2 mb-2">
            <span className="text-xs text-primary font-medium">높은 등급</span>
            <div className="flex-1 mx-2 border-t border-dashed border-gray-300" />
            <span className="text-xs text-text-secondary">낮은 등급</span>
          </div>
        </div>

        {/* 등급 설명 카드 */}
        <div className="w-full mt-4 pb-4">
          <FeatureCard
            icon={
              <Sprout size={32} className="text-primary" aria-hidden="true" />
            }
            iconAlt="성장 등급 설명 아이콘"
            title={gradeDescription}
            titleClassName="text-primary"
            description={gradeDetail}
          />
        </div>
      </div>

      {/* 하단 버튼 — 컨텐츠 영역 밖에서 full width 유지 */}
      <BottomButton
        label="상세 리포트 보기"
        onClick={handleDetailReport}
        disabled={isLoading}
      />
    </div>
  );
}
