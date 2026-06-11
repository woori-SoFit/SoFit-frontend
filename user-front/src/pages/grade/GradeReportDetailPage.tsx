/**
 * 성장 S등급 분석 리포트 페이지
 * Route: /grade-report/detail
 * Layout: StepLayout
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
  Sprout,
} from "lucide-react";
import { useLayoutStore } from "@/stores/layoutStore";
import { EmptyError } from "@/components/common/EmptyError";
import Lottie from "lottie-react";
import rocketLaunchAnimation from "@/assets/lottie/Rocket-Launch.json";
import type { GradeDetailResult } from "@/api/gradeApi";

const ALL_GRADES = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8", "S9", "S10"];

/** 키워드에 맞는 아이콘 매핑 */
function getIcon(keyword: string) {
  if (keyword.includes("온라인 정보")) return <Globe size={22} />;
  if (keyword.includes("플랫폼 활동")) return <Award size={22} />;
  if (keyword.includes("매출 비율") || keyword.includes("매출증가율")) return <TrendingUp size={22} />;
  if (keyword.includes("직원당")) return <Users size={22} />;
  if (keyword.includes("업력")) return <TrendingDown size={22} />;
  return <Store size={22} />;
}

export default function GradeReportDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const detail = (location.state as { detail?: GradeDetailResult } | null)?.detail;

  useEffect(() => {
    useLayoutStore.getState().setStepTitle("성장 S등급 분석 리포트");
    return () => {
      useLayoutStore.getState().setStepTitle("");
    };
  }, []);

  if (!detail) {
    return (
      <EmptyError
        message="상세 리포트를 불러올 수 없습니다."
        buttonLabel="돌아가기"
        navigateTo="/grade-report"
      />
    );
  }

  const grade = detail.sGrade;

  return (
    <div className="relative flex flex-col h-full">      
      <div className="flex-1 overflow-y-auto scrollbar-none px-5 pt-2 pb-24">

        {/* ── 종합 등급 카드 ── */}
        <section className="relative rounded-2xl px-6 py-5 bg-white shadow-card border border-border-default overflow-hidden mb-3">
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-primary/5" />
          <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-primary/5" />
          <div className="absolute bottom-0 right-6 w-30 h-30">
            <Lottie animationData={rocketLaunchAnimation} loop={5} className="w-full h-full" />
          </div>
          <div className="relative">
            <p className="text-sm text-text-secondary font-medium mb-1">종합 등급</p>
            <p className="text-5xl font-bold text-primary">{grade}</p>
            <span className="inline-block mt-3 px-3 py-1 rounded-full text-xs font-medium text-primary bg-primary/10">
              상위 {parseInt(grade.replace(/\D/g, ""), 10) * 10}%
            </span>
          </div>
        </section>

        {/* ── 등급 수준 섹션 ── */}
        <section className="w-full p-2 mb-5">
          {/* 현재 등급 화살표 */}
          <div className="grid grid-cols-10 gap-0.5 mb-1">
            {ALL_GRADES.map((g) => (
              <div key={`arrow-${g}`} className="flex justify-center">
                {g === grade && (
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                    <path d="M6 8L0 0H12L6 8Z" fill="#1E293B" />
                  </svg>
                )}
              </div>
            ))}
          </div>

          {/* 등급 바 */}
          <div className="grid grid-cols-10 gap-0.5 mb-5">
            {ALL_GRADES.map((g) => (
              <div
                key={g}
                className={`h-8 flex items-center justify-center rounded text-xs font-medium ${
                  g === grade ? "bg-primary text-white" : "bg-white text-text-secondary"
                }`}
              >
                {g}
              </div>
            ))}
          </div>

          {detail.comment && (
            <div className="flex items-start gap-3 mt-4">
              <Sprout size={24} className="text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-primary mb-1">{detail.comment}</p>
                {detail.commentDetail && (
                  <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">
                    {detail.commentDetail}
                  </p>
                )}
              </div>
            </div>
          )}
        </section>

        {/* ── 성장 인사이트 ── */}
        <section className="mb-4">
          <h3 className="text-base font-bold text-text-primary mb-3">성장 인사이트</h3>
          <div className="bg-white rounded-xl p-5 border border-border-default">
            <ul className="flex flex-col gap-2.5">
              {detail.advice.split(/[.\n]/).filter((s) => s.trim()).map((sentence, i) => (
                <li key={i} className="flex items-start gap-2 list-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <p className="text-sm text-text-primary leading-relaxed">{sentence.trim()}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

    
        {/* ── 강점 항목 ── */}
        {detail.strengthKeywords.length > 0 && (
          <section className="mb-5">
            <h3 className="text-base font-bold text-text-primary mb-3">강점</h3>
            <div className="flex flex-col gap-2.5">
              {detail.strengthKeywords.map((keyword) => (
                <div
                  key={keyword}
                  className="flex items-center bg-white rounded-xl p-4 border border-border-default"
                >
                  <div className="w-10 h-10 rounded-full text-success bg-success/10 flex items-center justify-center shrink-0">
                    {getIcon(keyword)}
                  </div>
                  <p className="ml-4 text-sm font-semibold text-text-primary">{keyword}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── 약점 항목 ── */}
        {detail.improvementKeywords.length > 0 && (
          <section className="mb-5">
            <h3 className="text-base font-bold text-text-primary mb-3">개선 영역</h3>
            <div className="flex flex-col gap-2.5">
              {detail.improvementKeywords.map((keyword) => (
                <div
                  key={keyword}
                  className="flex items-center bg-white rounded-xl p-4 border border-border-default"
                >
                  <div className="w-10 h-10 rounded-full text-error bg-error/10 flex items-center justify-center shrink-0">
                    {getIcon(keyword)}
                  </div>
                  <p className="ml-4 text-sm font-semibold text-text-primary">{keyword}</p>
                </div>
              ))}
            </div>
          </section>
        )}

      
      </div>

      {/* 하단 고정 버튼 — 투명 배경 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] p-5 z-40">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="w-full h-12 rounded-lg text-base font-semibold bg-primary text-white hover:bg-primary-dark active:bg-primary-dark transition-colors cursor-pointer shadow-lg"
        >
          홈화면으로 가기
        </button>
      </div>
    </div>
  );
}
