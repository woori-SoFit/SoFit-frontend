/**
 * 캐릭터 로딩 스피너 컴포넌트 — 순차 페이드 전환
 *
 * LoadingWIBEE1~6 이미지를 중앙에 겹쳐 배치하고
 * 1.2초 간격으로 한 캐릭터씩 페이드 인/아웃 전환.
 * 하단에 점 인디케이터로 현재 캐릭터 위치 표시.
 *
 * fullScreen (기본 true): 화면 전체 높이의 정중앙에 배치
 *
 * 사용처: 데이터 로딩 대기 UI
 */
import { useEffect, useState } from "react";
import wibee1 from "@/assets/icons/LoadingWIBEE1.png";
import wibee2 from "@/assets/icons/LoadingWIBEE2.png";
import wibee3 from "@/assets/icons/LoadingWIBEE3.png";
import wibee4 from "@/assets/icons/LoadingWIBEE4.png";
import wibee5 from "@/assets/icons/LoadingWIBEE5.png";
import wibee6 from "@/assets/icons/LoadingWIBEE6.png";

const WIBEE_IMAGES = [wibee1, wibee2, wibee3, wibee4, wibee5, wibee6];
const COUNT = WIBEE_IMAGES.length;
const INTERVAL = 1200;

interface CharacterLoadingSpinnerProps {
  /** 로딩 텍스트 (선택) */
  text?: string;
  /** true면 화면 전체 높이 중앙에 배치 (기본 true) */
  fullScreen?: boolean;
}

export function CharacterLoadingSpinner({ text, fullScreen = true }: CharacterLoadingSpinnerProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % COUNT);
    }, INTERVAL);
    return () => clearInterval(timer);
  }, []);

  const spinner = (
    <div className="flex flex-col items-center gap-3">
      {/* 캐릭터 영역 — 겹쳐 배치 */}
      <div className="relative w-32 h-32">
        {WIBEE_IMAGES.map((src, i) => {
          const isActive = i === activeIndex;
          return (
            <img
              key={i}
              src={src}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-contain transition-all duration-500 ease-in-out"
              style={{
                opacity: isActive ? 1 : 0,
                transform: isActive ? "scale(1)" : "scale(0.85)",
              }}
            />
          );
        })}
      </div>

      {/* 로딩 텍스트 */}
      {text && <p className="text-base text-text-secondary">{text}</p>}

      {/* 점 인디케이터 */}
      <div className="flex items-center gap-1.5">
        {WIBEE_IMAGES.map((_, i) => (
          <div
            key={i}
            className={`rounded-full transition-all duration-300 ${
              i === activeIndex
                ? "w-2 h-2 bg-primary"
                : "w-1.5 h-1.5 bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );

  if (!fullScreen) return spinner;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      {spinner}
    </div>
  );
}
