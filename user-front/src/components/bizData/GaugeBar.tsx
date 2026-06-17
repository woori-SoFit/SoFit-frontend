import { useState, useEffect } from "react";
import { InfoTooltip } from "@/components/common/InfoTooltip";

interface GaugeBarProps {
  label: string;
  percent: number;
  color: string;
  /** 라벨 옆에 도움말 툴팁을 표시할 때 메시지 전달 */
  tooltip?: string;
}

export function GaugeBar({ label, percent, color, tooltip }: GaugeBarProps) {
  const clampedPercent = Math.max(0, Math.min(100, percent));
  const fillPercent = 100 - clampedPercent;
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(fillPercent), 50);
    return () => clearTimeout(timer);
  }, [fillPercent]);

  return (
    <div className="flex items-center">
      <div className="flex items-center gap-1 w-18 shrink-0">
        <span className="text-sm font-medium text-text-primary">{label}</span>
        {tooltip && <InfoTooltip ariaLabel={`${label} 설명`} message={tooltip} />}
      </div>
      <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-700 ease-out`}
          style={{ width: `${width}%` }}
        />
      </div>
      <span className={`w-18 text-right text-sm font-medium shrink-0 ${color.replace("bg-", "text-")}`}>
        상위 {clampedPercent}%
      </span>
    </div>
  );
}
