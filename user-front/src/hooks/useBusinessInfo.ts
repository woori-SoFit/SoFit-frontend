/**
 * 사업자 정보 조회 훅
 *
 * GET /businesses/me API를 호출하여 사업자 정보를 반환.
 * InfoRow[] 형태로 변환하여 BizInfoConfirm 컴포넌트에 바로 전달 가능.
 */
import { useQuery } from "@tanstack/react-query";
import { MYPAGE_KEYS } from "@/constants/queryKeys";
import { fetchBusinessInfo } from "@/api/bizDataApi";
import { formatBusinessNumber } from "@/utils/signupValidation";
import type { InfoRow } from "@/components/loan/BizInfoConfirm";

export function useBusinessInfo() {
  const { data, isLoading, isError } = useQuery({
    queryKey: MYPAGE_KEYS.business(),
    queryFn: fetchBusinessInfo,
  });

  const bizInfo = data?.result ?? null;

  /** BizInfoConfirm / BusinessInfoPage에서 사용할 InfoRow 배열 */
  const rows: InfoRow[] = bizInfo
    ? [
        { label: "사업자등록번호", value: formatBusinessNumber(bizInfo.businessNumber) },
        { label: "상호명", value: bizInfo.businessName },
        { label: "대표자명", value: bizInfo.representativeName },
        { label: "개업일", value: bizInfo.openDate },
        { label: "업종/업태", value: `${bizInfo.businessCategory}/${bizInfo.businessType}` },
        { label: "사업장 주소", value: bizInfo.businessAddress },
      ]
    : [];

  return {
    bizInfo,
    rows,
    isMybizConnected: bizInfo?.isMybizConnected ?? false,
    isLoading,
    isError,
  };
}
