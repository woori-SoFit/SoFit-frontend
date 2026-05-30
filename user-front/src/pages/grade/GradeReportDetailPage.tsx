/**
 * 성장 S등급 상세 리포트 페이지
 * Route: /grade-report/detail
 * Layout: StepLayout
 *
 * GradeResultStep에서 '상세 리포트 보기' 클릭 후 진입.
 * 종합 등급, 평가 항목별 강점/약점, 조언사항을 표시합니다.
 */
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Globe,
  TrendingUp,
  TrendingDown,
  Store,
  Users,
  Award,
} from "lucide-react";
import { useLayoutStore } from "@/stores/layoutStore";
import { BottomButton } from "@/components/common/BottomButton";
import Lottie from "lottie-react";
import rocketLaunchAnimation from "@/assets/lottie/Rocket-Launch.json";
import wibeeIcon from "@/assets/icons/wibee.svg";
import type { GradeDetailResult } from "@/api/gradeApi";

/** 키워드에 맞는 아이콘 매핑 */
function getIcon(keyword: string) {
  if (keyword.includes("온라인 정보")) {
    return <Globe size={22} className="text-primary" />;
  }
  if (keyword.includes("플랫폼 활동")) {
    return <Award size={22} className="text-primary" />;
  }
  if (keyword.includes("매출 비율") || keyword.includes("매출증가율(3개월)")) {
    return <TrendingUp size={22} className="text-primary" />;
  }
  if (keyword.includes("직원당")) {
    return <Users size={22} className="text-primary" />;
  }
  if (keyword.includes("업력")) {
    return <TrendingDown size={22} className="text-primary" />;
  }
  return <Store size={22} className="text-primary" />;
}

export default function GradeReportDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const detail = (location.state as { detail?: GradeDetailResult } | null)?.detail;

  useEffect(() => {
    useLayoutStore.getState().setStepTitle("성장 S등급 상세 리포트");
  }, []);

  // 데이터가 없는 경우 (직접 URL 접근 등)
  if (!detail) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-5">
        <p className="text-text-secondary text-center">
          상세 리포트 데이터를 불러올 수 없습니다.
        </p>
        <BottomButton
          label="돌아가기"
          onClick={() => navigate("/grade-report")}
        />
      </div>
    );
  }

  const allItems = [
    ...detail.strengthKeywords.map((k) => ({ keyword: k, type: "강점" as const })),
    ...detail.improvementKeywords.map((k) => ({ keyword: k, type: "약점" as const })),
  ];

  return (
    <div className="flex flex-col h-full">
      {/* 스크롤 가능한 컨텐츠 영역 */}
      <div className="flex-1 overflow-y-auto px-5 pt-6 pb-4">
        {/* 종합 등급 카드 */}
        <section className="relative rounded-2xl px-6 py-5 bg-white shadow-card border border-border-default overflow-hidden mb-5">
          {/* 배경 장식 원 */}
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-primary/5" />
          <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-primary/5" />

          {/* 로켓 */}
          <div className="absolute bottom-0 right-6 w-30 h-30">
            <Lottie
              animationData={rocketLaunchAnimation}
              loop={5}
              className="w-full h-full"
            />
          </div>

          {/* 좌측 정보 */}
          <div className="relative">
            <p className="text-sm text-text-secondary font-medium mb-1">
              종합 등급
            </p>

            <p className="text-5xl font-bold text-primary">
              {detail.sGrade}
            </p>

            <span className="inline-block mt-3 px-3 py-1 rounded-full text-xs font-medium text-primary bg-primary/10">
              상위 {parseInt(detail.sGrade.replace(/\D/g, ""), 10) * 10}%
            </span>
          </div>
        </section>

        {/* 평가 항목별 점수 */}
        <section className="mb-5">
          <h3 className="text-base font-bold text-text-primary mb-4">평가 항목별 점수</h3>

          <div className="flex flex-col gap-3">
            {allItems.map((item) => (
              <div
                key={item.keyword}
                className="flex items-center bg-white rounded-xl p-4 shadow-card border border-border-default"
              >
                {/* 아이콘 */}
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  {getIcon(item.keyword)}
                </div>

                {/* 키워드 텍스트 */}
                <div className="ml-4 flex-1">
                  <p className="text-sm font-semibold text-text-primary">{item.keyword}</p>
                </div>

                {/* 강점/약점 라벨 */}
                <span
                  className={`text-sm font-medium px-2 py-0.5 rounded ${
                    item.type === "강점"
                      ? "text-success bg-success/10"
                      : "text-error bg-error/10"
                  }`}
                >
                  {item.type}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 조언사항 - 캐릭터 + 말풍선 */}
        <section>
          <h3 className="text-base font-bold text-text-primary mb-4">위비의 조언</h3>

          <div className="flex items-start gap-3">
            {/* 캐릭터 (좌측) */}
            <img
              src={wibeeIcon}
              alt="위비 캐릭터"
              className="w-14 h-14 object-contain shrink-0 animate-floating"
            />

            {/* 말풍선 (우측 대각선) */}
            <div className="relative flex-1 bg-sky-100 rounded-2xl p-4 border border-sky-200">
              {/* 말풍선 꼬리 (캐릭터 쪽을 가리킴) */}
              <div className="absolute top-4 -left-2 w-3 h-3 bg-sky-100 border-l border-b border-sky-200 rotate-45" />

              <p className="text-sm text-text-primary leading-relaxed whitespace-pre-line">
                {detail.advice}
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* 하단 버튼 */}
      <BottomButton
        label="홈화면으로 가기"
        onClick={() => navigate("/")}
      />
    </div>
  );
}
