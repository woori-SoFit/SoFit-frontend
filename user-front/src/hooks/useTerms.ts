import { useQuery } from "@tanstack/react-query";
import { TERMS_KEYS } from "@/constants/queryKeys";
import { fetchTerms } from "@/api/termsApi";
import type { TermType } from "@/types/common";

/**
 * 약관 목록을 조회하는 훅
 *
 * @param termType 약관 유형 (PERSONAL_INFO, MYDATA, MYBIZDATA, LOAN_APPLICATION, LOAN_AGREEMENT)
 */
export function useTerms(termType: TermType) {
  const { data, isLoading, isError } = useQuery({
    queryKey: TERMS_KEYS.list(termType),
    queryFn: () => fetchTerms(termType),
    staleTime: 1000 * 60 * 5,
  });

  return {
    terms: data ?? [],
    isLoading,
    isError,
  };
}
