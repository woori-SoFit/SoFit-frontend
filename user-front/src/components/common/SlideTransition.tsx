/**
 * 슬라이드 트랜지션 래퍼 컴포넌트
 *
 * useSlideStep 훅의 phase/slideDir를 받아
 * 자식 콘텐츠에 좌우 슬라이드 + 페이드 CSS 클래스를 적용한다.
 */
import type { ReactNode } from "react";
import type { SlideDir, SlidePhase } from "@/hooks/useSlideStep";

interface SlideTransitionProps {
  phase: SlidePhase;
  slideDir: SlideDir;
  children: ReactNode;
  className?: string;
}

export function SlideTransition({ phase, slideDir, children, className = "" }: SlideTransitionProps) {
  const slideClass = (() => {
    if (phase === "exit") {
      return slideDir === "forward" ? "-translate-x-8 opacity-0" : "translate-x-8 opacity-0";
    }
    if (phase === "enter") {
      return slideDir === "forward" ? "translate-x-8 opacity-0" : "-translate-x-8 opacity-0";
    }
    return "translate-x-0 opacity-100";
  })();

  return (
    <div className={`transition-all duration-200 ease-in-out ${slideClass} ${className}`}>
      {children}
    </div>
  );
}
