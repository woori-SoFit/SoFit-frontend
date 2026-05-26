/**
 * 내 정보 확인 페이지
 * Route: /mypage/profile
 * Layout: StepLayout (타이틀은 layoutStore로 설정)
 *
 * TODO: API 연동 완료 후 useMe/fetchUserProfile로 교체
 */
import { useEffect } from "react";
import { useLayoutStore } from "@/stores/layoutStore";
import { MOCK_PROFILE_ROWS } from "@/mocks/profileInfo";

export default function ProfilePage() {
  useEffect(() => {
    useLayoutStore.getState().setStepTitle("내 정보 확인");
    useLayoutStore.getState().setOnBack(null);
  }, []);

  return (
    <div className="bg-gray-50" data-testid="profile-page">
      <div className="mx-4 mt-4 bg-white rounded-xl divide-y divide-gray-100">
        {MOCK_PROFILE_ROWS.map((item) => (
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
  );
}
