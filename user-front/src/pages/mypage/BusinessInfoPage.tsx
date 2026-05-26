import { useEffect } from "react";
import { MOCK_BIZ_INFO_ROWS } from "@/mocks/bizInfo";
import { useLayoutStore } from "@/stores/layoutStore";

/**
 * 사업자 정보 확인 페이지
 * Route: /mypage/business
 * Layout: StepLayout (타이틀은 layoutStore로 설정)
 *
 * TODO: API 연동 완료 후 useBusinessInfo 훅으로 교체
 */
export default function BusinessInfoPage() {
  useEffect(() => {
    useLayoutStore.getState().setStepTitle("사업자 정보 확인");
    useLayoutStore.getState().setOnBack(null);
  }, []);

  return (
    <div className="bg-gray-50" data-testid="business-info-page">
      <div className="px-4 py-5">
        <div className="rounded-xl bg-white divide-y divide-gray-100">
          {MOCK_BIZ_INFO_ROWS.map((item) => (
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
