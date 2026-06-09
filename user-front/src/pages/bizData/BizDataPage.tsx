/**
 * My Biz Data 페이지
 * Route: /biz-data
 * Layout: StepLayout
 *
 * - 미연결 시: 서비스 소개 + 수집 시작 버튼
 * - 연결 완료 시: 통합 대시보드
 */
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLayoutStore } from "@/stores/layoutStore";
import { IntroSection } from "@/components/bizData/IntroSection";
import { MenuHub } from "@/components/bizData/MenuHub";
import { CharacterLoadingSpinner } from "@/components/common/CharacterLoadingSpinner";
import { checkMyBizConnected } from "@/api/mybizApi";


export default function BizDataPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  // grade-report에서 진입한 경우 returnTo를 전달받음
  const returnTo = (location.state as { returnTo?: string } | null)?.returnTo;

  useEffect(() => {
    useLayoutStore.getState().setStepTitle("마이 비즈 데이터");
    return () => {
      useLayoutStore.getState().setStepTitle("");
    };
  }, []);

  useEffect(() => {
    checkMyBizConnected()
      .then(setIsConnected)
      .catch(() => {
        // 비로그인
        setIsConnected(false);
      });
  }, []);

  if (isConnected === null) {
    return <CharacterLoadingSpinner text="불러오는 중..." />;
  }

  if (!isConnected) {
    return (
      <div data-testid="biz-data-page" className="flex flex-col h-[calc(100dvh-64px)]">
        <IntroSection
          onButtonClick={() => navigate("/biz-data/collect", {
            state: returnTo ? { returnTo } : undefined,
          })}
        />
      </div>
    );
  }

  return <MenuHub />;
}
