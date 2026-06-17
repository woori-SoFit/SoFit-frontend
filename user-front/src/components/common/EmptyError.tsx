/**
 * 데이터 로드 실패 공통 컴포넌트
 *
 * 사용처: 데이터를 불러오지 못한 모든 화면
 *
 * 구성: 일러스트 + 메시지 + 홈으로 가기 버튼
 */
import { useNavigate } from "react-router-dom";
import noneBizData from "@/assets/icons/None-BizData.svg";

interface EmptyErrorProps {
  /** 안내 메시지 (기본: "데이터를 불러오지 못했어요") */
  message?: string;
  /** 버튼 레이블 (기본: "홈으로 가기") */
  buttonLabel?: string;
  /** 버튼 클릭 시 이동할 경로 (기본: "/") */
  navigateTo?: string;
  /** 커스텀 버튼 클릭 핸들러 */
  onAction?: () => void;
}

export function EmptyError({
  message = "데이터를 불러오지 못했어요",
  buttonLabel = "홈으로 가기",
  navigateTo = "/",
  onAction,
}: EmptyErrorProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onAction) onAction();
    else navigate(navigateTo);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[calc(100dvh-56px)] gap-2">
      <img src={noneBizData} alt="" aria-hidden="true" className="w-40 object-contain" />
      <p className="text-base text-text-secondary text-center">{message}</p>
      <button
        type="button"
        onClick={handleClick}
        className="px-6 py-2 rounded-lg bg-primary-light text-white text-sm font-semibold hover:bg-primary-dark transition-colors"
      >
        {buttonLabel}
      </button>
    </div>
  );
}
