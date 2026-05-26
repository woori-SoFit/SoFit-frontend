import { useQuery } from '@tanstack/react-query';
import { LOAN_KEYS } from '@/constants/queryKeys';
import { fetchShapResult } from '@/api/loanDetailApi';
import type { ShapResult } from '@/types';

export interface UseShapResultReturn {
  data: ShapResult | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * SHAP 분석 결과를 조회하는 커스텀 훅.
 * 로딩 스피너(Req 11.4)와 에러 시 재시도(Req 11.6)를 지원합니다.
 */
export function useShapResult(id: number): UseShapResultReturn {
  const { data, isLoading, isError, error, refetch } = useQuery<ShapResult | undefined, Error>({
    queryKey: LOAN_KEYS.shap(id),
    queryFn: () => fetchShapResult(id),
    staleTime: 30_000,
  });

  return {
    data,
    isLoading,
    isError,
    error: error ?? null,
    refetch,
  };
}
