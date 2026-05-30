import { useQuery } from '@tanstack/react-query';
import { LOAN_KEYS } from '@/constants/queryKeys';
import { fetchReviewTabData } from '@/api/loanDetailApi';
import type { ReviewTabData } from '@/types';

/**
 * 심사 결과 탭 전용 데이터를 조회하는 커스텀 훅.
 * productInfo + applicationInfo + recommendation + decision 을 포함합니다.
 *
 * @param id 대출 신청 건 ID
 * @param enabled 쿼리 활성화 여부 (심사 결과 탭 활성 시에만 true)
 */
export function useReviewTab(id: number, enabled: boolean) {
  const { data, isLoading, isError, error, refetch } = useQuery<ReviewTabData, Error>({
    queryKey: LOAN_KEYS.reviewTab(id),
    queryFn: () => fetchReviewTabData(id),
    enabled: id > 0 && enabled,
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
