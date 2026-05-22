import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMe } from "@/hooks/useMe";
import { useBizDataStatus } from "@/hooks/useBizDataStatus";

interface UseCtaNavigationReturn {
  /** CTA 클릭 핸들러 */
  handleCtaClick: () => void;
  /** 네비게이션 진행 중 여부 */
  isNavigating: boolean;
  /** Biz Data 상태 로딩 중 여부 */
  isStatusLoading: boolean;
}

/**
 * CTA 버튼의 분기 네비게이션 로직을 캡슐화하는 훅
 *
 * 분기 로직:
 * 1. 비로그인 → /login?returnUrl=/grade-report/intro
 * 2. 로그인 + My Biz Data 미연결 → /biz-data
 * 3. 로그인 + My Biz Data 연결 → /grade-report
 *
 * isNavigating 상태로 중복 클릭을 방지합니다.
 */
export function useCtaNavigation(): UseCtaNavigationReturn {
  const navigate = useNavigate();
  const { isLoggedIn } = useMe();
  const { isConnected, isLoading: isStatusLoading } =
    useBizDataStatus(isLoggedIn);

  const [isNavigating, setIsNavigating] = useState(false);

  const handleCtaClick = () => {
    // 중복 클릭 방지
    if (isNavigating) return;

    // 상태 로딩 중이면 클릭 무시
    if (isStatusLoading) return;

    setIsNavigating(true);

    if (!isLoggedIn) {
      navigate("/login?returnUrl=/grade-report/intro");
    } else if (!isConnected) {
      navigate("/biz-data");
    } else {
      navigate("/grade-report");
    }
  };

  return {
    handleCtaClick,
    isNavigating,
    isStatusLoading,
  };
}
