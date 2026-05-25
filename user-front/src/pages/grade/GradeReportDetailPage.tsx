/**
 * SCB 상세 리포트 페이지
 * Route: /grade-report/detail
 * Layout: StepLayout
 *
 * GradeReportResultPage에서 '상세 리포트 보기' 클릭 후 진입.
 * 종합 등급, 평가 항목별 강점/약점, 조언사항을 표시합니다.
 *
 * TODO: API 연동 시 실제 데이터로 교체
 */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Globe, ChartNoAxesCombined } from "lucide-react";
import { useLayoutStore } from "@/stores/layoutStore";
import wibeeIcon from "@/assets/icons/wibee.svg";

// TODO: API 연동 시 실제 데이터로 교체
const MOCK_DATA = {
  sGrade: "S3",
  strengthKeywords: [
    "온라인 정보 접근성 점수",
    "온라인 플랫폼 활동 지수",
    "업종 평균 대비 매출 비율",
  ],
  improvementKeywords: [
    "업력 대비 매출증가율(3개월)",
    "직원당 매출증가율(6개월)",
  ],
  advice:
    "• 온라인에서 고객과 활발하게 소통하며 높은 평점을 유지하고 있어 디지털 경쟁력이 우수합니다.\n• 연간 매출 증가율이 업종 평균을 크게 상회하여 성장세가 뚜렷합니다.\n• 최근 매출이 조금 주춤한 상황이니 계절적 요인을 고려한 프로모션 전략을 검토해보세요.\n• 직원 생산성 향상을 위한 업무 프로세스 개선을 권장합니다.",
};

// 온라인 관련 키워드는 Globe 아이콘, 나머지는 ChartNoAxesCombined 아이콘
const ONLINE_KEYWORDS = ["온라인 정보 접근성 점수", "온라인 플랫폼 활동 지수"];

function getIcon(keyword: string) {
  if (ONLINE_KEYWORDS.includes(keyword)) {
    return <Globe size={24} className="text-primary" />;
  }
  return <ChartNoAxesCombined size={24} className="text-primary" />;
}

export default function GradeReportDetailPage() {
  const navigate = useNavigate();

  // StepLayout 헤더 타이틀 설정
  useEffect(() => {
    useLayoutStore.getState().setStepTitle("성장 S등급 상세 리포트");
  }, []);

  const allItems = [
    ...MOCK_DATA.strengthKeywords.map((k) => ({ keyword: k, type: "강점" as const })),
    ...MOCK_DATA.improvementKeywords.map((k) => ({ keyword: k, type: "약점" as const })),
  ];

  return (
    <div className="flex flex-col px-5 pt-6 pb-28 gap-6">
      {/* 종합 등급 카드 */}
      <section className="relative bg-linear-to-br from-primary to-primary-dark rounded-2xl p-6 text-white overflow-hidden">
        <p className="text-sm font-medium opacity-80 mb-1">종합 등급</p>
        <p className="text-5xl font-bold">{MOCK_DATA.sGrade}</p>
        <span className="inline-block mt-3 px-3 py-1 rounded-full text-xs font-medium bg-white/20 border border-white/30">
          상위 20%
        </span>

        {/* 우측 뱃지 장식 */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 w-20 h-20 rounded-xl bg-white/10 flex items-center justify-center rotate-12">
          <span className="text-2xl font-bold -rotate-12">{MOCK_DATA.sGrade}</span>
        </div>
      </section>

      {/* 평가 항목별 점수 */}
      <section>
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
                className={`text-xs font-medium px-2 py-0.5 rounded ${
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

      {/* 조언사항 - 캐릭터 말풍선 */}
      <section>
        <h3 className="text-base font-bold text-text-primary mb-4">위비의 조언</h3>

        {/* 말풍선 */}
        <div className="relative bg-sky-100 rounded-2xl p-5 mb-2">
          <p className="text-sm text-text-primary leading-relaxed whitespace-pre-line">
            {MOCK_DATA.advice}
          </p>
          {/* 말풍선 꼬리 */}
          <div className="absolute -bottom-2 left-8 w-4 h-4 bg-sky-100 rotate-45" />
        </div>

        {/* 캐릭터 */}
        <div className="flex items-end mt-2">
          <img
            src={wibeeIcon}
            alt="위비 캐릭터"
            className="w-16 h-16 object-contain"
          />
        </div>
      </section>

      {/* 하단 고정 CTA 버튼 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] p-5 bg-bg-base">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="w-full h-12 rounded-lg text-base font-semibold bg-primary text-white hover:bg-primary-dark active:bg-primary-dark transition-colors cursor-pointer"
        >
          홈화면으로 가기
        </button>
      </div>
    </div>
  );
}
