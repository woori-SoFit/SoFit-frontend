import { useQuery } from "@tanstack/react-query";
import { BIZ_DATA_KEYS } from "@/constants/queryKeys";
import { fetchMyBizDashboard } from "@/api/mybizApi";

interface UseAvailableMonthsReturn {
  /** 서버에서 제공하는 사용 가능한 월 목록 (내림차순) */
  availableMonths: string[];
  isLoading: boolean;
  isError: boolean;
}

/**
 * 마이비즈 대시보드에서 availableMonths 필드만 추출하는 훅
 *
 * - fetchMyBizDashboard() 응답의 availableMonths를 select
 * - 에러 시 빈 배열 반환 (컴포넌트에서 현재 시스템 월을 fallback으로 사용)
 */
export function useAvailableMonths(): UseAvailableMonthsReturn {
  const { data, isLoading, isError } = useQuery({
    queryKey: BIZ_DATA_KEYS.dashboard(),
    queryFn: () => fetchMyBizDashboard(),
    select: (dashboard) => dashboard.availableMonths,
    staleTime: 1000 * 60 * 5,
  });

  return {
    availableMonths: data ?? [],
    isLoading,
    isError,
  };
}
