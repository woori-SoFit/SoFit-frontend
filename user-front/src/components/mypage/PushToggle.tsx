/**
 * 푸시 알림 설정 토글 컴포넌트
 *
 * 좌측: "푸시 알림" 제목 + 설명 텍스트
 * 우측: 토글 스위치 (ON: blue, OFF: gray)
 */

interface PushToggleProps {
  enabled: boolean;
  onToggle: (value: boolean) => void;
}

export function PushToggle({ enabled, onToggle }: PushToggleProps) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-white px-5 py-4">
      {/* 좌측: 제목 + 설명 */}
      <div className="flex flex-col gap-1">
        <span className="text-base font-semibold text-gray-900">푸시 알림</span>
        <span className="text-sm text-gray-500">
          대출 심사 결과 및 주요 알림을 받아보세요.
        </span>
      </div>

      {/* 우측: 토글 스위치 */}
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label="푸시 알림 설정"
        onClick={() => onToggle(!enabled)}
        className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ${
          enabled ? "bg-primary" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            enabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
