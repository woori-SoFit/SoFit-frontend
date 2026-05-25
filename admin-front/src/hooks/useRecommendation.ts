import { useQuery } from '@tanstack/react-query';
import { LOAN_KEYS } from '@/constants/queryKeys';
import { fetchRecommendation } from '@/api/loanDetailApi';
import type { RecommendationData } from '@/types';

/**
 * 시스템 추천값(승인 금액, 금리, 기간, 상환 방식)을 조회하는 커스텀 훅.
 * enabled 옵션으로 모달이 열릴 때만 API를 호출합니다.
 *
 * @param id 대출 신청 건 ID
 * @param enabled 쿼리 활성화 여부 (모달 열림 상태)
 */
export function useRecommendation(id: number, enabled: boolean) {
  const { data, isLoading, isError, error } = useQuery<RecommendationData, Error>({
    queryKey: LOAN_KEYS.recommendation(id),
    queryFn: () => fetchRecommendation(id),
    enabled,
    staleTime: 30_000,
  });

  return {
    data,
    isLoading,
    isError,
    error: error ?? null,
  };
}
