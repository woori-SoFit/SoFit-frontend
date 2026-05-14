/**
 * StepLayout — 다단계 흐름(신청, 회원가입 등)용 레이아웃
 *
 * - 상단 뒤로가기 + 진행 단계 표시
 * - 하단 네비게이션 바 없음
 */
import { Outlet } from "react-router-dom";

interface StepLayoutProps {
  title?: string;
  currentStep?: number;
  totalSteps?: number;
  onBack?: () => void;
}

export function StepLayout(_props: StepLayoutProps) {
  // TODO: 상단 헤더 (뒤로가기, 타이틀, 진행 바) 구현

  return (
    <div data-testid="step-layout">
      {/* TODO: StepHeader */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}
