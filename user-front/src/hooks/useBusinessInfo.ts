import { useQuery } from "@tanstack/react-query";
import { MYPAGE_KEYS } from "@/constants/queryKeys";
import { fetchBusinessInfo } from "@/api/mypageApi";
import type { BusinessInfo } from "@/types/mypage";

/**
 * 사업자 정보를 조회하는 훅
 *
 * @returns data - 사업자 정보 (BusinessInfo | undefined)
 * @returns isLoading - 로딩 상태
 * @returns isError - 에러 발생 여부
 */
export function useBusinessInfo(): {
  data: BusinessInfo | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const { data, isLoading, isError } = useQuery({
    queryKey: MYPAGE_KEYS.business(),
    queryFn: fetchBusinessInfo,
  });

  return {
    data: data?.result,
    isLoading,
    isError,
  };
}
