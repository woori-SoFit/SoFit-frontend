import { useEffect } from "react";
import { useLayoutStore } from "@/stores/layoutStore";
import { useBusinessInfo } from "@/hooks/useBusinessInfo";

/**
 * 사업자 정보 확인 페이지
 * Route: /mypage/business
 * Layout: StepLayout (타이틀은 layoutStore로 설정)
 */
export default function BusinessInfoPage() {
  const { rows, isLoading } = useBusinessInfo();

  useEffect(() => {
    useLayoutStore.getState().setStepTitle("사업자 정보 확인");
    useLayoutStore.getState().setOnBack(null);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-text-secondary">불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50" data-testid="business-info-page">
      <div className="px-4 py-5">
        <div className="rounded-xl bg-white divide-y divide-gray-100">
          {rows.map((item) => (
            <div
              key={item.label}
              className="flex justify-between items-center py-4 px-5"
            >
              <span className="text-gray-600 font-bold">{item.label}</span>
              <span className="text-gray-900 text-right">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
