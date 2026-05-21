/**
 * 대출 진행 관리 페이지
 * Route: /loan-applications
 * Layout: MainLayout
 *
 * 구성:
 *   1. 심사 중인 대출 — 중앙 정렬 카드 슬라이더 + 인디케이터 점
 *   2. 심사 완료된 대출 — 중앙 정렬 카드 슬라이더 + 인디케이터 점
 */
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MOCK_LOAN_APPLICATIONS } from "@/mocks/loanApplications";
import { CardSlider } from "@/components/loan/CardSlider";
import type { LoanApplication } from "@/types/loan";

export default function LoanProgressPage() {
  const navigate = useNavigate();

  const { inProgress, completed } = useMemo(() => {
    const inProgress: LoanApplication[] = [];
    const completed: LoanApplication[] = [];

    MOCK_LOAN_APPLICATIONS.forEach((app) => {
      if (app.status === "SUBMITTED" || app.status === "IN_REVIEW") {
        inProgress.push(app);
      } else {
        completed.push(app);
      }
    });

    return { inProgress, completed };
  }, []);

  const handleCardClick = (app: LoanApplication) => {
    if (app.status === "APPROVED" || app.status === "REJECTED") {
      navigate(`/loan/result/${app.id}`);
    } else if (app.status === "IN_REVIEW" || app.status === "SUBMITTED") {
      navigate(`/loan/review/${app.id}`);
    }
  };

  return (
    <div className="pb-8" data-testid="loan-progress-page">
      {/* 심사 중인 대출 */}
      <section className="pt-10">
        <div className="px-5 flex items-center gap-2 mb-4">
          <h2 className="text-lg font-bold text-text-primary">심사 중인 대출</h2>
          <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-medium">
            {inProgress.length}
          </span>
        </div>

        {inProgress.length === 0 ? (
          <p className="px-5 text-sm text-text-secondary">심사 중인 대출이 없습니다.</p>
        ) : (
          <CardSlider items={inProgress} onCardClick={handleCardClick} />
        )}
      </section>

      {/* 심사 완료된 대출 */}
      <section className="mt-12">
        <div className="px-5 flex items-center gap-2 mb-4">
          <h2 className="text-lg font-bold text-text-primary">심사 완료된 대출</h2>
          <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-medium">
            {completed.length}
          </span>
        </div>

        {completed.length === 0 ? (
          <p className="px-5 text-sm text-text-secondary">심사 완료된 대출이 없습니다.</p>
        ) : (
          <CardSlider items={completed} onCardClick={handleCardClick} />
        )}
      </section>
    </div>
  );
}
