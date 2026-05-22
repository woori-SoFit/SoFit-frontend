/**
 * 마이 비즈 데이터 확인 페이지
 * Route: /grade-report/biz-check
 * Layout: StepLayout
 *
 * S분석 리포트 진입 화면에서 CTA 클릭 시,
 * 로그인 상태이나 My Biz Data가 미연결인 경우 이 페이지로 이동.
 * "불러오기" 버튼을 통해 My Biz Data 수집 플로우로 진입.
 */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileInput } from "lucide-react";
import { useLayoutStore } from "@/stores/layoutStore";

export default function BizDataCheckPage() {
  const navigate = useNavigate();

  // StepLayout 헤더 타이틀 설정
  useEffect(() => {
    useLayoutStore.getState().setStepTitle("마이 비즈 데이터 확인");
  }, []);

  const handleFetch = () => {
    navigate("/grade-report/loading");
  };

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
          onClick={handleFetch}
          className="w-full h-12 rounded-lg text-base font-semibold bg-primary text-white hover:bg-primary-dark active:bg-primary-dark transition-colors cursor-pointer"
        >
          불러오기
        </button>
      </div>
    </div>
  );
}
