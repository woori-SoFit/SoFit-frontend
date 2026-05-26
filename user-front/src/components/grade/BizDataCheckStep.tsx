/**
 * 마이 비즈 데이터 확인 스텝
 *
 * My Biz Data가 미연결인 경우 불러오기를 유도하는 화면.
 * "불러오기" 버튼 클릭 시 다음 스텝(로딩)으로 진행.
 */
import { FileInput } from "lucide-react";

interface BizDataCheckStepProps {
  onNext: () => void;
}

export function BizDataCheckStep({ onNext }: BizDataCheckStepProps) {
  return (
    <div className="flex flex-col items-center px-5 pt-32 pb-28 min-h-full">
      {/* 아이콘 영역 */}
      <div className="flex items-center justify-center w-24 h-24 rounded-full bg-blue-50 mb-8">
        <FileInput size={48} className="text-primary" />
      </div>

      {/* 메인 문구 */}
      <h2 className="text-xl font-bold text-text-primary text-center leading-snug">
        성장 등급 리포트 서비스를
        <br />
        이용하기 위해서는
        <br />
        <span className="text-primary">마이 비즈 데이터를 불러와야 해요.</span>
      </h2>

      {/* 보조 설명 */}
      <p className="mt-4 text-sm text-text-secondary text-center leading-relaxed">
        마이 비즈 데이터를 불러오면
        <br />
        최신 데이터로 S분석 리포트를
        <br />
        생성할 수 있어요.
      </p>

      {/* 하단 고정 CTA 버튼 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] p-5 bg-bg-base">
        <button
          type="button"
          onClick={onNext}
          className="w-full h-12 rounded-lg text-base font-semibold bg-primary text-white hover:bg-primary-dark active:bg-primary-dark transition-colors cursor-pointer"
        >
          불러오기
        </button>
      </div>
    </div>
  );
}
