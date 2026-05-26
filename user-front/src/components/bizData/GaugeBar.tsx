import { useState, useEffect } from "react";

interface GaugeBarProps {
  label: string;
  percent: number;
  color: string;
}

export function GaugeBar({ label, percent, color }: GaugeBarProps) {
  const clampedPercent = Math.max(0, Math.min(100, percent));
  const fillPercent = 100 - clampedPercent;
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(fillPercent), 50);
    return () => clearTimeout(timer);
  }, [fillPercent]);

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-text-primary w-14 shrink-0">
        {label}
      </span>
      <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-700 ease-out`}
          style={{ width: `${width}%` }}
        />
      </div>
      <span className={`text-sm font-medium shrink-0 ${color.replace("bg-", "text-")}`}>
        상위 {clampedPercent}%
      </span>
    </div>
  );
}
