import { useQuery } from "@tanstack/react-query";
import { BIZ_DATA_KEYS } from "@/constants/queryKeys";
import { fetchBizDataStatus } from "@/api/bizDataApi";

interface UseBizDataStatusReturn {
  /** My Biz Data가 연결(수집 완료)되었는지 여부 */
  isConnected: boolean;
  /** 조회 중 여부 */
  isLoading: boolean;
  /** 에러 발생 여부 */
  isError: boolean;
}

/**
 * My Biz Data 연결(수집 완료) 여부를 서버에서 조회하는 훅
 *
 * @param enabled - 로그인 상태일 때만 true로 전달하여 불필요한 API 호출 방지
 * @returns isConnected, isLoading, isError
 *
 * 에러 발생 시 isConnected: false로 처리 (안전한 폴백)
 * → 사용자는 /biz-data 페이지로 이동하게 되며, 해당 페이지에서 실제 연결 상태를 다시 확인
 */
export function useBizDataStatus(enabled: boolean): UseBizDataStatusReturn {
  const { data, isLoading, isError } = useQuery({
    queryKey: BIZ_DATA_KEYS.status(),
    queryFn: fetchBizDataStatus,
    enabled,
    staleTime: 1000 * 60,
  });

  // 에러 시 또는 데이터 없을 때 isConnected: false (안전한 폴백)
  const isConnected = data?.result?.isConnected ?? false;

  return {
    isConnected,
    isLoading,
    isError,
  };
}
