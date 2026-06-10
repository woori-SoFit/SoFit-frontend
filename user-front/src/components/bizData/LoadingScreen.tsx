/**
 * Step 기반 순차 로딩 화면 공통 컴포넌트
 *
 * 사용처:
 * - My Biz Data 수집 중 로딩
 *
 */
import { useState, useEffect, useRef } from "react";
import type { LucideIcon } from "lucide-react";
import { CircleCheckBig, Loader2, Circle } from "lucide-react";
import Lottie from "lottie-react";
import bizDataRobotAnimation from "@/assets/lottie/Biz-Data-Robot.json";
import { BottomButton } from "@/components/common/BottomButton";

type StepStatus = "pending" | "loading" | "done";

export interface LoadingStep {
  label: string;
  status: StepStatus;
  icon?: LucideIcon;
}

interface LoadingScreenProps {
  title: string;
  description?: string;
  steps?: LoadingStep[];
  /** 하단 버튼 레이블 (기본값: "다음") */
  buttonLabel?: string;
  /** 모든 step 완료 시 자동 호출 (API 요청 등) */
  onAllDone?: () => void | Promise<void>;
  /** 하단 버튼 클릭 시 호출 (화면 이동 등) */
  onComplete?: () => void;
}

const STEP_INTERVAL_MS = 1000;

export function LoadingScreen({ title, description, steps, buttonLabel = "다음", onAllDone, onComplete }: LoadingScreenProps) {
  const [internalSteps, setInternalSteps] = useState<LoadingStep[]>(() => steps ?? []);
  const [allDone, setAllDone] = useState(false);
  const [hasError, setHasError] = useState(false);
  const onAllDoneCalledRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (internalSteps.length === 0) return;

    const loadingIndex = internalSteps.findIndex((s) => s.status === "loading");

    if (loadingIndex !== -1) {
      timerRef.current = setTimeout(() => {
        setInternalSteps((prev) =>
          prev.map((s, i) => {
            if (i === loadingIndex) return { ...s, status: "done" };
            if (i === loadingIndex + 1 && s.status === "pending") return { ...s, status: "loading" };
            return s;
          }),
        );
      }, STEP_INTERVAL_MS);
    } else {
      const firstPending = internalSteps.findIndex((s) => s.status === "pending");
      if (firstPending !== -1) {
        setInternalSteps((prev) =>
          prev.map((s, i) => (i === firstPending ? { ...s, status: "loading" } : s)),
        );
      }
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [internalSteps]);

  // 전체 완료 감지 → onAllDone 자동 호출
  useEffect(() => {
    if (internalSteps.length === 0) return;
    if (internalSteps.every((s) => s.status === "done")) {
      setAllDone(true);
      if (!onAllDoneCalledRef.current && onAllDone) {
        onAllDoneCalledRef.current = true;
        Promise.resolve(onAllDone()).catch(() => {
          setHasError(true);
        });
      }
    }
  }, [internalSteps, onAllDone]);

  return (
    <div data-testid="loading-screen" className="flex flex-col h-full">
      <div className="flex-1 flex flex-col items-center px-5 pt-6 overflow-y-auto">
        {/* 타이틀 */}
        <h1 className="text-xl font-bold text-text-primary text-center leading-tight mb-1">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-text-secondary text-center mb-6">{description}</p>
        )}

        {/* 로봇 Lottie 애니메이션 */}
        <div className="w-52 h-52 mb-6">
          <Lottie animationData={bizDataRobotAnimation} loop={!allDone} className="w-full h-full" />
        </div>

        {/* Step 목록 카드 */}
        {internalSteps.length > 0 && (
          <div className="w-full bg-bg-surface rounded-2xl overflow-hidden">
            <ul className="divide-gray-50">
              {internalSteps.map((step, index) => {
                const StepIcon = step.icon;

                return (
                  <li key={index} className="flex items-center gap-3 px-4 py-3">
                    {/* 왼쪽 아이콘 */}
                    {StepIcon && (
                      <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 bg-blue-50">
                        <StepIcon size={17} className="text-primary" />
                      </div>
                    )}

                    {/* 라벨 + 상태 텍스트 */}
                    <div className="flex-1">
                      <span className={`text-sm font-medium ${step.status === "pending" ? "text-gray-400" : "text-text-primary"}`}>
                        {step.label}
                      </span>
                      <p className={`text-xs mt-0.5 ${
                        step.status === "done" ? "text-success" :
                        step.status === "loading" ? "text-primary" :
                        "text-gray-300"
                      }`}>
                        {step.status === "done" && "완료"}
                        {step.status === "loading" && "불러오는 중"}
                        {step.status === "pending" && "대기"}
                      </p>
                    </div>

                    {/* 오른쪽 상태 아이콘 */}
                    <div className="shrink-0">
                      {step.status === "done"    && <CircleCheckBig size={20} className="text-success" />}
                      {step.status === "loading" && <Loader2 size={20} className="text-primary animate-spin" />}
                      {step.status === "pending" && <Circle size={20} className="text-gray-300" />}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* steps 없을 때 단순 스피너 */}
        {internalSteps.length === 0 && (
          <div className="flex items-center justify-center w-16 h-16 mt-4">
            <Loader2 size={40} className="text-primary animate-spin" />
          </div>
        )}
      </div>

      {/* 하단 버튼 — 전체 완료 시 활성화, 에러 시 비활성화 */}
      {hasError ? (
        <div className="px-5 py-4 text-center">
          <p className="text-sm text-error mb-3">처리 중 오류가 발생했습니다. 다시 시도해주세요.</p>
          <button
            type="button"
            onClick={() => {
              setHasError(false);
              if (onAllDone) {
                Promise.resolve(onAllDone()).catch(() => {
                  setHasError(true);
                });
              }
            }}
            className="w-full h-12 rounded-xl bg-primary text-white text-base font-semibold"
          >
            다시 시도
          </button>
        </div>
      ) : (
        <BottomButton
          label={buttonLabel}
          onClick={() => onComplete?.()}
          disabled={!allDone}
        />
      )}
    </div>
  );
}
