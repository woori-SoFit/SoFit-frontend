/**
 * 마이 비즈 데이터 확인 스텝
 *
 * My Biz Data가 미연결인 경우 불러오기를 유도하는 화면.
 * "불러오기" 버튼 클릭 시 다음 스텝(로딩)으로 진행.
 */
import Lottie from "lottie-react";
import fileLoadingAnimation from "@/assets/lottie/File-Loading.json";
import { BottomButton } from "@/components/common/BottomButton";

interface BizDataCheckStepProps {
  onNext: () => void;
  isLoading?: boolean;
  heading?: string;
}

export function BizDataCheckStep({ onNext, isLoading = false, heading = "성장 S등급 리포트 서비스를\n이용하기 위해서는" }: BizDataCheckStepProps) {
  return (
    <div className="flex flex-col h-full">
      {/* 컨텐츠 영역 */}
      <div className="flex-1 flex flex-col items-center mt-10 px-5">
        {/* 아이콘 영역 */}
        <div className="w-62 h-32 mb-10">
          <Lottie animationData={fileLoadingAnimation} loop className="w-full h-full" />
        </div>

        {/* 메인 문구 */}
        <h2 className="text-xl font-bold text-text-primary text-center leading-snug whitespace-pre-line">
          {heading}
          <br />
          <span className="text-primary">마이 비즈 데이터</span>를 불러와야 해요
        </h2>

        {/* 보조 설명 */}
        <p className="mt-4 text-sm text-text-secondary text-center leading-relaxed">
          마이 비즈 데이터를 불러오면
          <br />
          최신 데이터로 S분석 리포트를 생성할 수 있어요.
        </p>
      </div>

      {/* 하단 버튼 */}
      <BottomButton
        label={isLoading ? "확인 중..." : "불러오기"}
        onClick={onNext}
        disabled={isLoading}
      />
    </div>
  );
}
