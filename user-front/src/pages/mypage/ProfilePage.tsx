/**
 * 내 정보 확인 페이지
 * Route: /mypage/profile
 * Layout: MainLayout
 *
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5
 */
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/mypage/PageHeader";
import { useMe } from "@/hooks/useMe";
import { fetchUserProfile } from "@/api/mypageApi";
import { MYPAGE_KEYS } from "@/constants/queryKeys";

/** 프로필 정보 행 */
interface InfoRowProps {
  label: string;
  value: string;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex justify-between items-center py-4 px-5">
      <span className="text-gray-600 font-medium">{label}</span>
      <span className="text-gray-900 text-right">{value}</span>
    </div>
  );
}

/** 로딩 스켈레톤 */
function ProfileSkeleton() {
  return (
    <div className="mx-4 mt-4 bg-white rounded-xl divide-y divide-gray-100">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex justify-between items-center py-4 px-5">
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export default function ProfilePage() {
  const { me, isLoading: isMeLoading } = useMe();

  const { data: profileData, isLoading: isProfileLoading } = useQuery({
    queryKey: MYPAGE_KEYS.profile(),
    queryFn: fetchUserProfile,
    staleTime: 1000 * 60,
  });

  const isLoading = isMeLoading || isProfileLoading;
  const profile = profileData?.result;

  // me 또는 profile에서 정보 추출
  const name = profile?.name ?? me?.name ?? "-";
  const loginId = profile?.loginId ?? me?.loginId ?? "-";
  const phone = profile?.phone ?? "-";
  // 주민등록번호는 API에서 제공하지 않으므로 마스킹 처리된 형태로 표시
  const residentNumber = "******-*******";

  return (
    <div className="min-h-screen bg-gray-50" data-testid="profile-page">
      <PageHeader title="내 정보 확인" />

      {isLoading ? (
        <ProfileSkeleton />
      ) : (
        <div className="mx-4 mt-4 bg-white rounded-xl divide-y divide-gray-100">
          <InfoRow label="이름" value={name} />
          <InfoRow label="아이디" value={loginId} />
          <InfoRow label="주민등록번호" value={residentNumber} />
          <InfoRow label="연락처" value={phone} />
        </div>
      )}
    </div>
  );
}
