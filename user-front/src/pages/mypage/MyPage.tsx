/**
 * 마이페이지 메인
 * Route: /mypage
 * Layout: StepLayout (타이틀은 layoutStore로 설정)
 *
 * Requirements: 1.1~1.8, 2.1~2.3, 3.1~3.3, 4.1~4.4, 5.1~5.5
 */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { ProfileCard } from "@/components/mypage/ProfileCard";
import { MenuItem } from "@/components/mypage/MenuItem";
import { PushToggle } from "@/components/mypage/PushToggle";
import { LogoutSheet } from "@/components/mypage/LogoutSheet";

import { useMe } from "@/hooks/useMe";
import { usePushToggle } from "@/hooks/usePushToggle";
import { postLogout } from "@/api/mypageApi";
import { resetCsrfToken } from "@/api/axiosInstance";
import { useLayoutStore } from "@/stores/layoutStore";

export default function MyPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { me } = useMe();
  const { enabled, toggle } = usePushToggle();

  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  useEffect(() => {
    useLayoutStore.getState().setStepTitle("마이페이지");
    useLayoutStore.getState().setOnBack(null);
  }, []);

  /** 로그아웃 확인 핸들러 */
  const handleLogoutConfirm = async () => {
    try {
      await postLogout();
      queryClient.clear();
      navigate("/login");
    } catch (error) {
      console.error("로그아웃 실패:", error);
    } finally {
      resetCsrfToken();
    }
  };

  return (
    <div data-testid="my-page" className="bg-gray-50">
      {/* 콘텐츠 영역 */}
      <div className="flex flex-col gap-3 p-4">
        {/* 프로필 카드 */}
        <ProfileCard
          name={me?.name ?? ""}
          loginId={me?.loginId ?? ""}
        />

        {/* 메뉴 섹션: 내 정보 / 사업자 정보 */}
        <div className="overflow-hidden rounded-xl bg-white divide-y divide-gray-100">
          <MenuItem label="내 정보 확인" to="/mypage/profile" />
          <MenuItem label="사업자 정보 확인" to="/mypage/business" />
        </div>

        {/* 푸시 알림 토글 */}
        <PushToggle enabled={enabled} onToggle={() => toggle()} />

        {/* 로그아웃 / 회원 탈퇴 */}
        <div className="overflow-hidden rounded-xl bg-white divide-y divide-gray-100">
          <MenuItem label="로그아웃" onClick={() => setLogoutDialogOpen(true)} />
          <MenuItem
            label="회원 탈퇴"
            variant="danger"
            to="/mypage/withdraw"
          />
        </div>
      </div>

      {/* 로그아웃 확인 바텀시트 */}
      <LogoutSheet
        open={logoutDialogOpen}
        onConfirm={handleLogoutConfirm}
        onCancel={() => setLogoutDialogOpen(false)}
      />
    </div>
  );
}
