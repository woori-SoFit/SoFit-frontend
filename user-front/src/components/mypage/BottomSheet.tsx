/**
 * BottomSheet — 하단에서 슬라이드업되는 시트 컴포넌트
 *
 * - 반투명 오버레이 배경
 * - 하단에서 올라오는 애니메이션 (transition)
 * - 상단 rounded-t-2xl 모서리
 */
import { useEffect, useState } from "react";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function BottomSheet({ open, onClose, children }: BottomSheetProps) {
  const [visible, setVisible] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (open) {
      setVisible(true);
      // 다음 프레임에서 애니메이션 시작
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimate(true);
        });
      });
    } else {
      setAnimate(false);
      // 트랜지션 끝난 후 DOM에서 제거
      const timer = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end">
      {/* 오버레이 */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          animate ? "opacity-50" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* 시트 — 앱 컨테이너 너비에 맞춤, 콘텐츠 높이만큼만 차지 */}
      <div
        className={`relative mx-auto w-full max-w-[430px] rounded-t-2xl bg-white shadow-xl transition-transform duration-300 ease-out ${
          animate ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
