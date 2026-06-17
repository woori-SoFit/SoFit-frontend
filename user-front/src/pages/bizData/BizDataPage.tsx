/**
 * My Biz Data 페이지
 * Route: /biz-data
 * Layout: StepLayout
 *
 * - 미연결 시: 서비스 소개 + 수집 시작 버튼
 * - 연결 완료 시: 통합 대시보드
 */
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useLayoutStore } from "@/stores/layoutStore";
import { useMe } from "@/hooks/useMe";
import { IntroSection } from "@/components/bizData/IntroSection";
import { MenuHub } from "@/components/bizData/MenuHub";
import { CharacterLoadingSpinner } from "@/components/common/CharacterLoadingSpinner";
import { checkMyBizConnected } from "@/api/mybizApi";


export default function BizDataPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, isLoading: isAuthLoading } = useMe();

  // 로그인 상태일 때만 mybiz-status API 호출 (React Query 캐싱 적용)
  const { data: isConnected, isLoading: isBizLoading } = useQuery({
    queryKey: ["mybiz", "status"],
    queryFn: checkMyBizConnected,
    enabled: isLoggedIn,
    staleTime: 1000 * 60,
  });

  // grade-report에서 진입한 경우 returnTo를 전달받음
  const returnTo = (location.state as { returnTo?: string } | null)?.returnTo;

  useEffect(() => {
    useLayoutStore.getState().setStepTitle(isConnected ? "마이 비즈 데이터" : "");
    return () => {
      useLayoutStore.getState().setStepTitle("");
    };
  }, [isConnected]);

  if (isAuthLoading || (isLoggedIn && isBizLoading)) {
    return <CharacterLoadingSpinner text="불러오는 중..." />;
  }

  if (!isConnected) {
    return (
      <div data-testid="biz-data-page" className="flex flex-col h-[calc(100dvh-64px)]">
        <IntroSection
          onButtonClick={() => {
            if (!isLoggedIn) {
              navigate(`/login?returnUrl=${encodeURIComponent("/biz-data")}`, { replace: true });
              return;
            }
            navigate("/biz-data/collect", {
              state: returnTo ? { returnTo } : undefined,
            });
          }}
        />
      </div>
    );
  }

  return <MenuHub />;
}
