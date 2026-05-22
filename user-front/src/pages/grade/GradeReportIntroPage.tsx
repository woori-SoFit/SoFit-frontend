/**
 * S분석 리포트 진입 화면
 * Route: /grade-report/intro
 * Layout: StepLayout
 *
 * 소상공인 고객에게 SOFIT 성장등급 리포트 서비스의 가치를 소개하고,
 * CTA 버튼을 통해 리포트 플로우를 시작하도록 유도하는 페이지.
 *
 * CTA 분기 로직:
 *   - 비로그인 → /login?returnUrl=/grade-report/intro
 *   - 로그인 + My Biz Data 미연결 → /biz-data
 *   - 로그인 + My Biz Data 연결 → /grade-report
 */
import { useEffect } from "react";
import { BarChart3, Trophy } from "lucide-react";
import { useLayoutStore } from "@/stores/layoutStore";
import { useCtaNavigation } from "@/hooks/useCtaNavigation";
import { FeatureCard } from "@/components/grade/FeatureCard";
import { CtaButton } from "@/components/grade/CtaButton";
import gradeReportIntroImg from "@/assets/icons/S-Report.svg";

export default function GradeReportIntroPage() {
  const { handleCtaClick, isNavigating, isStatusLoading } = useCtaNavigation();

  // StepLayout 헤더 타이틀 설정
  useEffect(() => {
    useLayoutStore.getState().setStepTitle("S분석 리포트");
  }, []);

  return (
    <div className="flex flex-col items-center px-5 pt-8 pb-28">
      {/* 메인 타이틀 */}
      <h1 className="text-3xl font-bold text-text-primary text-center">
        SOFIT
        <br />
        <span className="text-primary">성장등급 리포트</span>
      </h1>

      {/* 서브 타이틀 */}
      <p className="mt-2 text-base text-text-secondary">
        사장님의 성장 가능성을 봅니다.
      </p>

      {/* 중앙 일러스트레이션 */}
      <img
        src={gradeReportIntroImg}
        alt="SOFIT 성장등급 리포트 서비스 소개 일러스트레이션"
        className="mt-8 mb-8 min-h-[200px] w-full max-w-[280px] object-contain"
        onError={(e) => {
          // 이미지 로딩 실패 시 높이 유지
          e.currentTarget.style.visibility = "hidden";
        }}
      />

      {/* Feature Section - 서비스 특징 카드 */}
      <div className="flex w-full flex-col gap-4">
        <FeatureCard
          icon={
            <BarChart3 size={32} className="text-green-700" aria-hidden="true" />
          }
          iconAlt="성장 분석 아이콘"
          title="입체적 성장 분석"
          description={"리뷰, SNS, 상권 트렌드 등\n숨은 성장 기세를 분석합니다."}
        />

        <FeatureCard
          icon={
            <Trophy size={32} className="text-primary" aria-hidden="true" />
          }
          iconAlt="우대 혜택 아이콘"
          title="맞춤형 우대 혜택"
          description={"발굴된 성장 등급에 따라\n더 높은 한도와 낮은 금리를 설계합니다."}
        />
      </div>

      {/* CTA 버튼 */}
      <CtaButton
        label="S분석 리포트 시작하기"
        onClick={handleCtaClick}
        isLoading={false}
        disabled={isNavigating}
      />
    </div>
  );
}
