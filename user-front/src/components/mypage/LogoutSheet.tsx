/**
 * LogoutSheet — 로그아웃 확인 바텀시트
 *
 * - 상단: 로그아웃 아이콘 (파란색 원형 배경)
 * - 타이틀: "로그아웃 하시겠어요?"
 * - 설명: "현재 기기에서 로그아웃됩니다. 다시 이용하려면 로그인해주세요."
 * - 하단 버튼: "취소" (outline) + "로그아웃" (파란색 filled)
 */
import { LogOut } from "lucide-react";
import { BottomSheet } from "./BottomSheet";

interface LogoutSheetProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function LogoutSheet({ open, onConfirm, onCancel }: LogoutSheetProps) {
  return (
    <BottomSheet open={open} onClose={onCancel}>
      <div className="flex flex-col items-center px-6 py-10">
        {/* 아이콘 */}
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <LogOut size={28} className="text-primary" />
        </div>

        {/* 타이틀 */}
        <h2 className="mt-5 text-lg font-bold text-gray-900">
          로그아웃 하시겠어요?
        </h2>

        {/* 설명 */}
        <p className="mt-2 text-center text-sm text-gray-500 leading-relaxed">
          현재 기기에서 로그아웃됩니다.
          <br />
          다시 이용하려면 로그인해주세요.
        </p>

        {/* 버튼 */}
        <div className="mt-6 flex w-full gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-lg border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-lg bg-primary py-3 text-sm font-semibold text-white hover:bg-primary-dark transition-colors"
          >
            로그아웃
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}
