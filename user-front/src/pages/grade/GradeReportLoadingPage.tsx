/**
 * S분석 리포트 생성 중 (로딩) 페이지
 * Route: /grade-report/loading
 * Layout: StepLayout
 *
 * BizDataCheckPage에서 '불러오기' 버튼 클릭 후 진입.
 * 마이 비즈 데이터를 기반으로 S등급을 계산하는 동안 대기하는 화면.
 *
 * 로직:
 *   - 최소 3초 대기
 *   - API 응답이 오면 (+ 최소 대기 충족 시) 다음 페이지로 이동
 *   - TODO: 실제 API 연동 후 폴링/응답 대기 로직 추가
 */
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import { ChartColumnIncreasing } from "lucide-react";
import { useLayoutStore } from "@/stores/layoutStore";
import bizDataLoadingAnimation from "@/assets/lottie/Biz-Data-Loading.json";

export default function GradeReportLoadingPage() {
  const navigate = useNavigate();
  const hasNavigated = useRef(false);

  // StepLayout 헤더 타이틀 설정
  useEffect(() => {
    useLayoutStore.getState().setStepTitle("성장 S등급 분석 리포트 생성 중");
  }, []);

  useEffect(() => {
    // TODO: 실제 API 연동 시 아래 로직을 교체
    // 1. API 호출 시작 (S등급 산출 요청 또는 폴링)
    // 2. API 응답 완료 플래그 관리
    // 3. 최소 대기 시간 + API 응답 모두 충족 시 navigate

    const MIN_WAIT_MS = 3000;

    const timer = setTimeout(() => {
      if (!hasNavigated.current) {
        hasNavigated.current = true;
        // TODO: S등급 분석 결과 페이지로 이동 (추후 구현)
        navigate("/grade-report/result", { replace: true });
      }
    }, MIN_WAIT_MS);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center px-5 pt-20 min-h-full">
      {/* 메인 문구 */}
      <h2 className="text-xl font-bold text-text-primary text-center leading-snug mb-20">
        마이 비즈 데이터를 기반으로
        <br />
        S등급을 계산하고 있어요.
      </h2>

      {/* 로딩 애니메이션 + 아이콘 */}
      <div className="relative flex items-center justify-center w-48 h-48 mb-6">
        {/* Lottie 로딩 바 */}
        <Lottie
          animationData={bizDataLoadingAnimation}
          loop={1}
          className="absolute inset-0 w-full h-full"
        />

        {/* 중앙 아이콘 원 */}
        <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-blue-50">
          <ChartColumnIncreasing size={28} className="text-primary" />
        </div>
      </div>

      {/* 하단 안내 문구 */}
      <p className="text-sm text-text-secondary text-center">
        데이터를 분석 중이에요
      </p>
    </div>
  );
}
