/**
 * 슬라이드 스텝 전환 훅
 *
 * exit → displayStep 교체 → enter → idle 순으로 페이즈를 관리해
 * 좌우 슬라이드 애니메이션과 함께 스텝을 전환한다.
 *
 * 사용처: LoanPreApplyPage
 */
import { useEffect, useRef, useState } from "react";

export type SlideDir = "forward" | "back";
export type SlidePhase = "idle" | "exit" | "enter";

interface UseSlideStepOptions {
  /** exit 트랜지션 지속 시간 (ms), 기본 200 */
  exitDuration?: number;
}

interface UseSlideStepReturn {
  /** 로직 상 현재 스텝 (전환 중에도 목표 스텝 값) */
  step: number;
  /** 실제 렌더에 사용되는 스텝 (전환 완료 후 교체) */
  displayStep: number;
  /** 현재 트랜지션 페이즈 */
  phase: SlidePhase;
  /** 슬라이드 방향 */
  slideDir: SlideDir;
  /** 다음 스텝으로 슬라이드 전환 */
  goToStep: (next: number, dir: SlideDir) => void;
  /** 전환 중 여부 */
  isTransitioning: boolean;
}

export function useSlideStep(initialStep = 0, options: UseSlideStepOptions = {}): UseSlideStepReturn {
  const { exitDuration = 200 } = options;

  const [step, setStep] = useState(initialStep);
  const [displayStep, setDisplayStep] = useState(initialStep);
  const [phase, setPhase] = useState<SlidePhase>("idle");
  const [slideDir, setSlideDir] = useState<SlideDir>("forward");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const goToStep = (next: number, dir: SlideDir) => {
    if (phase !== "idle") return;

    setSlideDir(dir);
    setPhase("exit");

    timerRef.current = setTimeout(() => {
      setDisplayStep(next);
      setStep(next);
      setPhase("enter");

      // 브라우저가 enter 상태를 한 프레임 렌더한 뒤 idle로 복귀
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setPhase("idle");
        });
      });
    }, exitDuration);
  };

  return {
    step,
    displayStep,
    phase,
    slideDir,
    goToStep,
    isTransitioning: phase !== "idle",
  };
}
