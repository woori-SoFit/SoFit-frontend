/**
 * My Biz Data 인트로 섹션
 *
 * 마이 비즈 데이터 서비스의 가치를 소개하는 인트로 화면.
 * 공통 ServiceIntroPage 컴포넌트를 활용합니다.
 */
import { Link2, BarChart3, ShieldCheck } from "lucide-react";
import { ServiceIntroPage } from "@/components/common/ServiceIntroPage";
import type { IntroFeatureItem } from "@/components/common/ServiceIntroPage";
import bizDataIllust from "@/assets/icons/myBizData.svg";

const FEATURES: IntroFeatureItem[] = [
  {
    icon: Link2,
    iconColor: "text-primary",
    title: "다양한 데이터를 연결",
    description: "흩어진 데이터를 한곳에 연결·관리",
  },
  {
    icon: BarChart3,
    iconColor: "text-primary",
    title: "사업을 더 깊이 분석",
    description: "매출, 지출, 수익성을 한눈에 파악",
  },
  {
    icon: ShieldCheck,
    iconColor: "text-primary",
    title: "금융 활용 기회 확대",
    description: "데이터 기반 금융 심사 우대 활용",
  },
];

interface IntroSectionProps {
  /** CTA 버튼 레이블 */
  buttonLabel?: string;
  /** CTA 버튼 클릭 핸들러 */
  onButtonClick?: () => void;
  /** 버튼 비활성 여부 */
  buttonDisabled?: boolean;
}

export function IntroSection({
  buttonLabel = "데이터 연결 시작하기",
  onButtonClick,
  buttonDisabled = false,
}: IntroSectionProps) {
  return (
    <ServiceIntroPage
      title={<span className="text-primary">마이 비즈 데이터</span>}
      subtitle="흩어진 정보를 연결하면 사업 분석과 금융 활용이 수월합니다."
      illustSrc={bizDataIllust}
      illustAlt="마이 비즈 데이터 일러스트"
      features={FEATURES}
      buttonLabel={buttonLabel}
      onButtonClick={onButtonClick ?? (() => {})}
      buttonDisabled={buttonDisabled}
    />
  );
}
