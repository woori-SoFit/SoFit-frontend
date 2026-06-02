/**
 * InfoTooltip — 도움말 툴팁
 *
 * 작은 ? 배지를 클릭/탭 하면 설명이 떠요. 모바일에서도 동작하도록 클릭 기반으로 구현.
 * 외부 영역 탭 시 자동으로 닫힘.
 *
 * `position: fixed`로 viewport에 띄워서 앱 컨테이너의 overflow:hidden,
 * max-width 제약을 탈출하고, 좌우 경계도 viewport 기준으로 자동 보정해요.
 */
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { HelpCircle } from "lucide-react";

interface InfoTooltipProps {
  /** 툴팁에 표시할 설명 */
  message: string;
  /** 라벨 (스크린리더용) */
  ariaLabel?: string;
  /** 툴팁 표시 위치 */
  placement?: "top" | "bottom";
}

const TOOLTIP_MAX_WIDTH = 220;
const SAFE_PADDING = 12;
const GAP_FROM_TRIGGER = 6;

export function InfoTooltip({ message, ariaLabel = "도움말", placement = "top" }: InfoTooltipProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 닫기
  useEffect(() => {
    if (!open) return;
    function handleOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        triggerRef.current && !triggerRef.current.contains(target) &&
        tooltipRef.current && !tooltipRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  // 스크롤/리사이즈로 위치 갱신
  useEffect(() => {
    if (!open) return;
    function update() {
      if (!triggerRef.current || !tooltipRef.current) return;
      const trigger = triggerRef.current.getBoundingClientRect();
      const tip = tooltipRef.current.getBoundingClientRect();

      // 트리거 중앙 X
      const triggerCenterX = trigger.left + trigger.width / 2;
      // 기본: 툴팁을 트리거 중앙 아래/위 정렬
      let left = triggerCenterX - tip.width / 2;
      // viewport 좌/우 경계로 클램프
      const minLeft = SAFE_PADDING;
      const maxLeft = window.innerWidth - tip.width - SAFE_PADDING;
      left = Math.max(minLeft, Math.min(maxLeft, left));

      const top =
        placement === "top"
          ? trigger.top - tip.height - GAP_FROM_TRIGGER
          : trigger.bottom + GAP_FROM_TRIGGER;

      setPos({ top, left });
    }
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open, message, placement]);

  // 첫 렌더 사이클에 위치 측정
  useLayoutEffect(() => {
    if (!open || !triggerRef.current || !tooltipRef.current) return;
    const trigger = triggerRef.current.getBoundingClientRect();
    const tip = tooltipRef.current.getBoundingClientRect();
    const triggerCenterX = trigger.left + trigger.width / 2;
    let left = triggerCenterX - tip.width / 2;
    const minLeft = SAFE_PADDING;
    const maxLeft = window.innerWidth - tip.width - SAFE_PADDING;
    left = Math.max(minLeft, Math.min(maxLeft, left));
    const top =
      placement === "top"
        ? trigger.top - tip.height - GAP_FROM_TRIGGER
        : trigger.bottom + GAP_FROM_TRIGGER;
    setPos({ top, left });
  }, [open, message, placement]);

  return (
    <span className="relative inline-flex items-center align-middle">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={ariaLabel}
        aria-expanded={open}
        className="w-4 h-4 flex items-center justify-center text-text-disabled hover:text-text-secondary transition-colors"
      >
        <HelpCircle size={14} />
      </button>
      {open && (
        <div
          ref={tooltipRef}
          role="tooltip"
          style={{
            position: "fixed",
            top: pos?.top ?? -9999,
            left: pos?.left ?? -9999,
            maxWidth: TOOLTIP_MAX_WIDTH,
            visibility: pos ? "visible" : "hidden",
          }}
          className="z-[var(--z-tooltip)] w-max px-2.5 py-1.5 text-[11px] leading-snug text-white bg-gray-800 rounded-md shadow-md whitespace-normal break-keep"
        >
          {message}
        </div>
      )}
    </span>
  );
}
