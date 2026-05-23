import { useState } from "react";

const STORAGE_KEY = "sofit_push_enabled";

interface UsePushToggleReturn {
  enabled: boolean;
  toggle: () => void;
}

/**
 * localStorage에서 저장된 푸시 알림 설정값을 읽어옵니다.
 * 저장된 값이 없으면 기본값 true(활성화)를 반환합니다.
 */
function getStoredValue(): boolean {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === null) return true;
  return stored === "true";
}

/**
 * 푸시 알림 설정 상태를 관리하는 훅
 *
 * - localStorage key: sofit_push_enabled
 * - 초기값: localStorage 저장값 또는 true (기본 활성화)
 *
 * @returns enabled - 현재 푸시 알림 활성화 상태
 * @returns toggle - 상태를 반전시키고 localStorage에 저장하는 함수
 */
export function usePushToggle(): UsePushToggleReturn {
  const [enabled, setEnabled] = useState<boolean>(getStoredValue);

  const toggle = () => {
    const newValue = !enabled;
    setEnabled(newValue);
    localStorage.setItem(STORAGE_KEY, String(newValue));
  };

  return { enabled, toggle };
}
