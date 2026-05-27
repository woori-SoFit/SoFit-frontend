/**
 * 사업자 정보 확인 페이지
 * Route: /mypage/business
 * Layout: StepLayout
 */
import { useEffect } from "react";
import { useLayoutStore } from "@/stores/layoutStore";
import { useBusinessInfo } from "@/hooks/useBusinessInfo";
import { formatBusinessNumber } from "@/utils/signupValidation";

export default function BusinessInfoPage() {
  useEffect(() => {
    useLayoutStore.getState().setStepTitle("사업자 정보 확인");
    useLayoutStore.getState().setOnBack(null);
  }, []);

  const { bizInfo: data, isLoading, isError } = useBusinessInfo();

  if (isLoading) {
    return (
      <div className="bg-gray-50" data-testid="business-info-page">
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-gray-50" data-testid="business-info-page">
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-500">정보를 불러올 수 없습니다</p>
        </div>
      </div>
    );
  }

  const infoItems = [
    { label: "사업자등록번호", value: data?.businessNumber ? formatBusinessNumber(data.businessNumber) : "-" },
    { label: "상호명", value: data?.businessName ?? "-" },
    { label: "대표자명", value: data?.representativeName ?? "-" },
    { label: "개업일", value: data?.openDate ?? "-" },
    { label: "업종 / 업태", value: `${data?.businessCategory ?? "-"} / ${data?.businessType ?? "-"}` },
    { label: "사업장 주소", value: data?.businessAddress ?? "-" },
  ];

  return (
    <div className="bg-gray-50" data-testid="business-info-page">
      <div className="px-4 py-5">
        <div className="rounded-xl bg-white divide-y divide-gray-100">
          {infoItems.map((item) => (
            <div
              key={item.label}
              className="flex justify-between items-center py-4 px-5"
            >
              <span className="text-gray-600 font-medium">{item.label}</span>
              <span className="text-gray-900 text-right">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}