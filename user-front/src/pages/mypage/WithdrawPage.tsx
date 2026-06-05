/**
 * 회원 탈퇴 페이지
 * Route: /mypage/withdraw
 * Layout: StepLayout
 */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { TriangleAlert } from "lucide-react";
import { deleteAccount } from "@/api/mypageApi";
import { useLayoutStore } from "@/stores/layoutStore";

const CONFIRM_TEXT = "탈퇴하기";

const DELETED_INFO = [
  "회원 정보 (이름, 아이디, 연락처 등)",
  "사업자 정보",
  "대출 신청 및 심사 정보",
  "마이데이터 연동 정보",
  "기타 서비스 이용 기록",
];

export default function WithdrawPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [input, setInput] = useState("");

  const isConfirmed = input === CONFIRM_TEXT;

  useEffect(() => {
    useLayoutStore.getState().setStepTitle("회원 탈퇴");
    useLayoutStore.getState().setOnBack(null);
  }, []);

  const handleWithdraw = async () => {
    if (!isConfirmed) return;
    try {
      await deleteAccount();
      queryClient.clear();
      navigate("/login");
    } catch (error) {
      console.error("회원 탈퇴 실패:", error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-base">
      {/* 콘텐츠 */}
      <div className="flex-1 px-6 pt-10 overflow-y-auto">
        {/* 경고 아이콘 */}
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <TriangleAlert size={28} className="text-error" />
          </div>
        </div>

        {/* 타이틀 */}
        <h2 className="mt-5 text-center text-xl font-bold text-gray-900">
          정말 탈퇴하시겠어요?
        </h2>

        {/* 설명 */}
        <p className="mt-3 text-center text-sm text-gray-500 leading-relaxed">
          탈퇴 시 계정과 모든 데이터가 삭제되며,
          <br />
          서비스 이용이 불가능합니다.
        </p>

        {/* 삭제되는 정보 카드 */}
        <div className="mt-8 rounded-xl bg-red-50 p-5">
          <p className="text-sm font-bold text-error mb-3">삭제되는 정보</p>
          <ul className="space-y-1.5">
            {DELETED_INFO.map((item) => (
              <li key={item} className="text-sm text-gray-700">
                • {item}
              </li>
            ))}
          </ul>
        </div>

        {/* 확인 입력 */}
        <div className="mt-10">
          <p className="text-sm text-gray-700 mb-2 ml-1">
            탈퇴를 원하시면 '<span className="font-semibold">{CONFIRM_TEXT}</span>'를 입력해주세요.
          </p>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={CONFIRM_TEXT}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex-1 rounded-xl border border-gray-200 bg-white py-3.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          취소
        </button>
        <button
          type="button"
          onClick={handleWithdraw}
          disabled={!isConfirmed}
          className={`flex-1 rounded-xl py-3.5 text-sm font-semibold text-white transition-colors cursor-pointer ${
            isConfirmed
              ? "bg-error hover:bg-red-600"
              : "bg-red-200 cursor-not-allowed"
          }`}
        >
          탈퇴 완료
        </button>
      </div>
    </div>
  );
}
