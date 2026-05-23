/**
 * 마이페이지 메인
 * Route: /mypage
 * Layout: MainLayout
 *
 * Requirements: 1.1~1.8, 2.1~2.3, 3.1~3.3, 4.1~4.4, 5.1~5.5
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { PageHeader } from "@/components/mypage/PageHeader";
import { ProfileCard } from "@/components/mypage/ProfileCard";
import { MenuItem } from "@/components/mypage/MenuItem";
import { PushToggle } from "@/components/mypage/PushToggle";
import ConfirmDialog from "@/components/mypage/ConfirmDialog";

import { useMe } from "@/hooks/useMe";
import { usePushToggle } from "@/hooks/usePushToggle";
import { postLogout, deleteAccount } from "@/api/mypageApi";

export default function MyPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { me } = useMe();
  const { enabled, toggle } = usePushToggle();

  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  /** 로그아웃 확인 핸들러 */
  const handleLogoutConfirm = async () => {
    try {
      await postLogout();
    } finally {
      queryClient.clear();
      navigate("/login");
    }
  };

  /** 회원 탈퇴 확인 핸들러 */
  const handleDeleteConfirm = async () => {
    try {
      await deleteAccount();
    } finally {
      queryClient.clear();
      navigate("/login");
    }
  };

  return (
    <div data-testid="my-page" className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <PageHeader title="마이페이지" />

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
            onClick={() => setDeleteDialogOpen(true)}
          />
        </div>
      </div>

      {/* 로그아웃 확인 다이얼로그 */}
      <ConfirmDialog
        open={logoutDialogOpen}
        title="로그아웃"
        description="정말 로그아웃 하시겠습니까?"
        confirmLabel="로그아웃"
        cancelLabel="취소"
        onConfirm={handleLogoutConfirm}
        onCancel={() => setLogoutDialogOpen(false)}
      />

      {/* 회원 탈퇴 확인 다이얼로그 */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="회원 탈퇴"
        description="탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다. 정말 탈퇴하시겠습니까?"
        confirmLabel="탈퇴"
        cancelLabel="취소"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
}
