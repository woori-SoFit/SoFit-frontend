/**
 * Step 기반 순차 로딩 화면 공통 컴포넌트
 * — Bot 일러스트 + 플로팅 아이콘 + step 목록 카드
 *
 * 사용처:
 * - My Biz Data 수집 중 로딩
 *
 * cf. 대출 신청 MyData 불러오기 로딩은 별도 디자인이라 MydataLoadingStep을 사용
 */
import { useState, useEffect, useRef } from "react";
import type { LucideIcon } from "lucide-react";
import { CircleCheckBig, Loader2, Circle, Bot, Home, CreditCard, Landmark, MapPin, Star, FileText } from "lucide-react";

type StepStatus = "pending" | "loading" | "done";

export interface LoadingStep {
  label: string;
  status: StepStatus;
  /** 왼쪽 아이콘 */
  icon?: LucideIcon;
  /** 활성(loading/done)일 때 아이콘 배경 Tailwind class */
  activeBg?: string;
  /** 활성(loading/done)일 때 아이콘 색상 Tailwind class */
  activeColor?: string;
}

interface LoadingScreenProps {
  title: string;
  description?: string;
  steps?: LoadingStep[];
  /** 모든 step이 done이 되면 1회 호출 */
  onComplete?: () => void;
}

const STEP_INTERVAL_MS = 500;

/** 로봇 주변 플로팅 아이콘 위치 */
const FLOATING_ICONS = [
  { Icon: Home,      className: "top-2 left-1/2 -translate-x-8",   color: "text-red-400"   },
  { Icon: Landmark,  className: "top-2 left-1/2 translate-x-2",    color: "text-blue-400"  },
  { Icon: CreditCard,className: "top-1/2 left-2 -translate-y-1/2", color: "text-green-500" },
  { Icon: MapPin,    className: "top-1/2 right-2 -translate-y-1/2",color: "text-purple-400"},
  { Icon: Star,      className: "bottom-2 left-1/2 -translate-x-8",color: "text-amber-400" },
  { Icon: FileText,  className: "bottom-2 left-1/2 translate-x-2", color: "text-slate-400" },
] as const;

export function LoadingScreen({ title, description, steps, onComplete }: LoadingScreenProps) {
  const [internalSteps, setInternalSteps] = useState<LoadingStep[]>(() => steps ?? []);
  const onCompleteCalledRef = useRef(false);
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

  useEffect(() => {
    if (internalSteps.length === 0 || onCompleteCalledRef.current) return;
    const allDone = internalSteps.every((s) => s.status === "done");
    if (allDone && onComplete) {
      onCompleteCalledRef.current = true;
      onComplete();
    }
  }, [internalSteps, onComplete]);

  return (
    <div data-testid="loading-screen" className="flex flex-col items-center px-5 pt-6 pb-8">
      {/* 타이틀 */}
      <h1 className="text-xl font-bold text-text-primary text-center leading-tight mb-1">
        {title}
      </h1>
      {description && (
        <p className="text-sm text-text-secondary text-center mb-6">{description}</p>
      )}

      {/* 로봇 일러스트레이션 */}
      <div className="relative flex items-center justify-center w-52 h-52 mb-6">
        {/* 동심원 배경 */}
        <div className="absolute w-52 h-52 rounded-full bg-blue-50/50" />
        <div className="absolute w-36 h-36 rounded-full bg-blue-50" />

        {/* 중앙 Bot 아이콘 */}
        <div className="relative z-10 w-20 h-20 rounded-full bg-white shadow-md flex items-center justify-center">
          <Bot size={44} className="text-primary" />
        </div>

        {/* 플로팅 아이콘들 */}
        {FLOATING_ICONS.map(({ Icon, className, color }) => (
          <div
            key={className}
            className={`absolute ${className} w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center`}
          >
            <Icon size={16} className={color} />
          </div>
        ))}
      </div>

      {/* Step 목록 카드 */}
      {internalSteps.length > 0 && (
        <div className="w-full bg-bg-surface rounded-2xl shadow-card overflow-hidden">
          <ul className="divide-y divide-gray-50">
            {internalSteps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = step.status !== "pending";
              const iconBg = isActive ? (step.activeBg ?? "bg-primary/10") : "bg-gray-100";
              const iconColor = isActive ? (step.activeColor ?? "text-primary") : "text-gray-400";

              return (
                <li key={index} className="flex items-center gap-3 px-4 py-3.5">
                  {/* 왼쪽 아이콘 */}
                  {StepIcon && (
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}>
                      <StepIcon size={17} className={iconColor} />
                    </div>
                  )}

                  {/* 라벨 */}
                  <span className={`flex-1 text-sm font-medium ${step.status === "pending" ? "text-gray-400" : "text-text-primary"}`}>
                    {step.label}
                  </span>

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
  );
}
