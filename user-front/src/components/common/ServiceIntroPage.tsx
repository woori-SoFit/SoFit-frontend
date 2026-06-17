/**
 * ServiceIntroPage — 서비스 인트로 공통 컴포넌트
 *
 * 마이 비즈 데이터, S등급 성장 리포트 등 서비스 진입 시
 * 공통된 레이아웃(하늘색 그라데이션 배경 + 일러스트 + 특징 카드 + CTA 버튼)을 제공합니다.
 *
 * 메인 타이틀: SoFit 로고 이미지 고정 + 아래 텍스트만 props로 주입
 */
import { BottomButton } from "@/components/common/BottomButton";
import mainLogo from "@/assets/mainLogo.svg";
import type { LucideIcon } from "lucide-react";

/** 특징 항목 데이터 */
export interface IntroFeatureItem {
  /** lucide 아이콘 컴포넌트 */
  icon: LucideIcon;
  /** 아이콘 색상 클래스 (예: "text-blue-500") */
  iconColor: string;
  /** 볼드 타이틀 (첫째 줄) */
  title: string;
  /** 설명 텍스트 (둘째 줄, 간결히 한 줄) */
  description: string;
}

interface ServiceIntroPageProps {
  /** 로고 아래에 표시할 타이틀 텍스트 (ReactNode로 강조색/줄바꿈 지원) */
  title: React.ReactNode;
  /** 서브 타이틀 */
  subtitle: string;
  /** 중앙 일러스트 이미지 src */
  illustSrc: string;
  /** 일러스트 alt 텍스트 */
  illustAlt: string;
  /** 특징 항목 목록 */
  features: IntroFeatureItem[];
  /** CTA 버튼 레이블 */
  buttonLabel: string;
  /** CTA 버튼 클릭 핸들러 */
  onButtonClick: () => void;
  /** 버튼 비활성 여부 */
  buttonDisabled?: boolean;
}

export function ServiceIntroPage({
  title,
  subtitle,
  illustSrc,
  illustAlt,
  features,
  buttonLabel,
  onButtonClick,
  buttonDisabled = false,
}: ServiceIntroPageProps) {
  return (
    <div className="flex flex-col h-full relative overflow-x-hidden">
      {/* 배경 그라데이션 */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-sky-100/60 blur-3xl" />
      </div>

      {/* 컨텐츠 영역 — 스크롤 가능 */}
      <div className="flex-1 overflow-y-auto flex flex-col items-center pt-2 px-5 pb-4 relative z-1">
        {/* 메인 타이틀: 로고 + 텍스트 */}
        <h1 className="text-2xl font-bold text-text-primary text-center leading-tight">
          <img src={mainLogo} alt="SoFit" className="inline h-12" />
          <br />
          {title}
        </h1>

        {/* 서브 타이틀 */}
        <p className="mt-2 text-sm text-text-secondary text-center">
          {subtitle}
        </p>

        {/* 중앙 일러스트레이션 */}
        <img
          src={illustSrc}
          alt={illustAlt}
          className="mt-8 mb-16 w-full max-w-[260px] object-contain"
          onError={(e) => {
            e.currentTarget.style.visibility = "hidden";
          }}
        />

        {/* 특징 카드 — 각각 개별 카드 */}
        <div className="w-full flex flex-col gap-2">
          {features.map((item) => {
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
      <div className="shrink-0">
        <BottomButton
          label={buttonLabel}
          onClick={onButtonClick}
          disabled={buttonDisabled}
        />
      </div>
    </div>
  );
}
