/**
 * My Biz Data 인트로 섹션
 *
 * 마이 비즈 데이터 서비스의 가치를 소개하는 인트로 화면.
 * 공통 ServiceIntroPage 컴포넌트를 활용합니다.
 *
 * 주의: BizDataPage에서 하단 버튼을 직접 렌더링하므로
 * ServiceIntroPage의 버튼 영역은 외부에서 제어합니다.
 */
import { Link2, BarChart3, ShieldCheck } from "lucide-react";
import type { IntroFeatureItem } from "@/components/common/ServiceIntroPage";
import { BottomButton } from "@/components/common/BottomButton";
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
    <div className="flex flex-col h-full relative">
      {/* 배경 그라데이션 */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-sky-100/60 blur-3xl" />
      </div>

      {/* 컨텐츠 영역 — 스크롤 가능 */}
      <div className="flex-1 overflow-y-auto flex flex-col items-center pt-6 px-5 pb-4 relative z-1">
        {/* 메인 타이틀 */}
        <h1 className="text-2xl font-bold text-text-primary text-center leading-tight">
          SOFIT
          <br />
          <span className="text-primary">마이 비즈 데이터</span>
        </h1>

        {/* 서브 타이틀 */}
        <p className="mt-2 mb-4 text-sm text-text-secondary text-center">
          흩어진 정보를 연결하면 사업 분석과 금융 활용이 수월합니다.
        </p>

        {/* 중앙 일러스트레이션 */}
        <img
          src={bizDataIllust}
          alt="마이 비즈 데이터 일러스트"
          className="mt-7 mb-12 w-full max-w-[260px] object-contain"
          onError={(e) => {
            e.currentTarget.style.visibility = "hidden";
          }}
        />

        {/* 특징 카드 — 각각 개별 카드 */}
        <div className="w-full flex flex-col gap-3">
          {FEATURES.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex items-center gap-4 bg-white rounded-2xl p-4">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                  <Icon size={20} className={item.iconColor} aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-bold text-text-primary">{item.title}</p>
                  <p className="text-sm text-text-secondary leading-relaxed mt-0.5">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 하단 CTA 버튼 — 항상 하단 고정 */}
      {onButtonClick && (
        <div className="shrink-0">
          <BottomButton
            label={buttonLabel}
            onClick={onButtonClick}
            disabled={buttonDisabled}
          />
        </div>
      )}
    </div>
  );
}
