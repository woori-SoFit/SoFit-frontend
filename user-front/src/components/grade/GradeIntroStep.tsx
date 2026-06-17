/**
 * S분석 리포트 인트로 스텝
 *
 * 소상공인 고객에게 SOFIT 성장등급 리포트 서비스의 가치를 소개하고,
 * CTA 버튼을 통해 다음 스텝으로 진행하도록 유도.
 *
 * 공통 ServiceIntroPage 컴포넌트를 활용합니다.
 */
import { BarChart3, Trophy } from "lucide-react";
import { ServiceIntroPage } from "@/components/common/ServiceIntroPage";
import type { IntroFeatureItem } from "@/components/common/ServiceIntroPage";
import gradeReportIntroImg from "@/assets/icons/S-Report.svg";

const FEATURES: IntroFeatureItem[] = [
  {
    icon: BarChart3,
    iconColor: "text-primary",
    title: "입체적 성장 분석",
    description: "리뷰, SNS, 상권 트렌드 기반 숨은 성장 기세 분석",
  },
  {
    icon: Trophy,
    iconColor: "text-primary",
    title: "AI 분석 리포트",
    description: "성장 요인과 개선 포인트를 한눈에 확인",
  },
];

interface GradeIntroStepProps {
  onNext: () => void;
  isLoading?: boolean;
}

export function GradeIntroStep({ onNext, isLoading = false }: GradeIntroStepProps) {
  return (
    <ServiceIntroPage
      title={<span className="text-primary">성장등급 리포트</span>}
      subtitle="사장님의 성장 가능성을 봅니다."
      illustSrc={gradeReportIntroImg}
      illustAlt="SOFIT 성장등급 리포트 서비스 소개 일러스트레이션"
      features={FEATURES}
      buttonLabel={isLoading ? "확인 중..." : "S분석 리포트 시작하기"}
      onButtonClick={onNext}
      buttonDisabled={isLoading}
    />
  );
}
