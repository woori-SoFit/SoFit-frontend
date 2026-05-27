/**
 * 내 정보 확인 페이지
 * Route: /mypage/profile
 * Layout: StepLayout
 */
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLayoutStore } from "@/stores/layoutStore";
import { fetchUserProfile } from "@/api/mypageApi";
import { MYPAGE_KEYS } from "@/constants/queryKeys";
import { formatPhoneNumber, formatResidentNumber } from "@/utils/signupValidation";

export default function ProfilePage() {
  useEffect(() => {
    useLayoutStore.getState().setStepTitle("내 정보 확인");
    useLayoutStore.getState().setOnBack(null);
  }, []);

  const { data, isLoading, isError } = useQuery({
    queryKey: MYPAGE_KEYS.profile(),
    queryFn: fetchUserProfile,
  });

  if (isLoading) {
    return (
      <div className="bg-gray-50" data-testid="profile-page">
        <div className="mx-4 mt-4 bg-white rounded-xl divide-y divide-gray-100">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex justify-between items-center py-4 px-5">
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-gray-50" data-testid="profile-page">
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-500">정보를 불러올 수 없습니다</p>
        </div>
      </div>
    );
  }

  const profile = data?.result;

  const infoItems = [
    { label: "이름", value: profile?.name ?? "-" },
    { label: "아이디", value: profile?.loginId ?? "-" },
    { label: "주민등록번호", value: profile?.residentNumber ? formatResidentNumber(profile.residentNumber) : "-" },
    { label: "연락처", value: profile?.phoneNumber ? formatPhoneNumber(profile.phoneNumber) : "-" },
  ];

  return (
    <div className="bg-gray-50" data-testid="profile-page">
      <div className="mx-4 mt-4 bg-white rounded-xl divide-y divide-gray-100">
        {infoItems.map((item) => (
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
