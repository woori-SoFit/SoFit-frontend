/**
 * S등급 분석 결과 스텝
 *
 * 사용자의 S등급 분석 결과를 표시.
 * "상세 리포트 보기" 클릭 시 GradeReportDetailPage로 이동.
 *
 * TODO: API 연동 시 실제 유저 이름, S등급 데이터로 교체
 */
import { useNavigate } from "react-router-dom";
import { Sprout } from "lucide-react";
import { FeatureCard } from "@/components/grade/FeatureCard";

// TODO: API 연동 시 실제 데이터로 교체
const MOCK_DATA = {
  userName: "홍길동",
  grade: "S3",
  gradeDescription: "안정적으로 성장하고 있는\n우수 사업장입니다.",
  gradeDetail: "지속적인 매출 성장과 안정적인 상권을\n기반으로 신용도가 양호해요.",
};

const ALL_GRADES = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8", "S9", "S10"];

export function GradeResultStep() {
  const navigate = useNavigate();

  const handleDetailReport = () => {
    navigate("/grade-report/detail");
  };

  return (
    <div className="flex flex-col items-center px-5 pt-8 pb-28">
      {/* 사용자 이름 + S등급 안내 */}
      <h2 className="text-xl font-bold text-text-primary text-center leading-snug">
        {MOCK_DATA.userName} 사장님의
        <br />
        성장 S등급이에요!
      </h2>

      {/* S등급 표시 - 두 원 (연한 하늘색) */}
      <div className="relative flex items-center justify-center mt-8 mb-8">
        {/* 바깥 원 */}
        <div className="w-44 h-44 rounded-full bg-sky-50 flex items-center justify-center">
          {/* 안쪽 원 */}
          <div className="w-36 h-36 rounded-full bg-sky-100 flex items-center justify-center">
            {/* 등급 텍스트 */}
            <span className="text-5xl font-bold text-primary">
              {MOCK_DATA.grade}
            </span>
          </div>
        </div>
      </div>

      {/* 등급 수준 섹션 */}
      <div className="w-full bg-white rounded-xl p-5 shadow-card border border-border-default">
        <h3 className="text-base font-bold text-text-primary mb-4">등급 수준</h3>

        {/* 현재 등급 화살표 표시 */}
        <div className="grid grid-cols-10 gap-0.5 mb-1">
          {ALL_GRADES.map((grade) => (
            <div key={`arrow-${grade}`} className="flex justify-center">
              {grade === MOCK_DATA.grade && (
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                  <path d="M6 8L0 0H12L6 8Z" fill="#1E293B" />
                </svg>
              )}
            </div>
          ))}
        </div>

        {/* 등급 바 */}
        <div className="grid grid-cols-10 gap-0.5 mb-3">
          {ALL_GRADES.map((grade) => (
            <div
              key={grade}
              className={`h-8 flex items-center justify-center rounded text-xs font-medium ${
                grade === MOCK_DATA.grade
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-text-secondary"
              }`}
            >
              {grade}
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
      <div className="w-full mt-4">
        <FeatureCard
          icon={
            <Sprout size={32} className="text-primary" aria-hidden="true" />
          }
          iconAlt="성장 등급 설명 아이콘"
          title={MOCK_DATA.gradeDescription}
          titleClassName="text-primary"
          description={MOCK_DATA.gradeDetail}
        />
      </div>

      {/* 하단 고정 CTA 버튼 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] p-5 bg-bg-base">
        <button
          type="button"
          onClick={handleDetailReport}
          className="w-full h-12 rounded-lg text-base font-semibold bg-primary text-white hover:bg-primary-dark active:bg-primary-dark transition-colors cursor-pointer"
        >
          상세 리포트 보기
        </button>
      </div>
    </div>
  );
}
