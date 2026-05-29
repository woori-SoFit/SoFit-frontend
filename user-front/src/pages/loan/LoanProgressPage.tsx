/**
 * 대출 진행 관리 페이지
 * Route: /loan-applications
 * Layout: StepLayout
 *
 * 심사 중 + 심사 완료 대출 목록을 API에서 조회하여 카드 슬라이더로 표시
 */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useLayoutStore } from "@/stores/layoutStore";
import { fetchLoanApplicationsInProgress, fetchLoanApplicationsCompleted } from "@/api/loanApi";
import { LOAN_KEYS } from "@/constants/queryKeys";
import { CardSlider } from "@/components/loan/CardSlider";
import type { LoanApplication } from "@/types/loan";

export default function LoanProgressPage() {
  const navigate = useNavigate();

  useEffect(() => {
    useLayoutStore.getState().setStepTitle("대출 진행 관리");
  }, []);

  const { data: inProgress = [], isLoading: isLoadingInProgress } = useQuery({
    queryKey: LOAN_KEYS.applicationsInProgress(),
    queryFn: fetchLoanApplicationsInProgress,
  });

  const { data: completed = [], isLoading: isLoadingCompleted } = useQuery({
    queryKey: LOAN_KEYS.applicationsCompleted(),
    queryFn: fetchLoanApplicationsCompleted,
  });

  const handleCardClick = (app: LoanApplication) => {
    if (app.status === "APPROVED" || app.status === "REJECTED" || app.status === "CANCELLED") {
      navigate(`/loan/result/${app.id}`);
    } else if (app.status === "EXECUTED") {
      navigate(`/loan/execution/${app.id}`);
    } else if (app.status === "CONTRACTED") {
      navigate(`/loan/agreement/${app.id}`);
    } else {
      navigate(`/loan/review/${app.id}`);
    }
  };

  if (isLoadingInProgress && isLoadingCompleted) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-text-secondary">대출 현황을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="pb-8" data-testid="loan-progress-page">
      {/* 심사 중인 대출 */}
      <section className="pt-5">
        <div className="px-5 flex items-center gap-2 mb-4">
          <h2 className="text-lg font-bold text-text-primary">심사 중인 대출</h2>
          <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-medium">
            {inProgress.length}
          </span>
        </div>

        {inProgress.length === 0 ? (
          <div className="px-5 flex items-center justify-center min-h-[200px]">
            <p className="text-md text-text-secondary">심사 중인 대출이 없습니다.</p>
          </div>
        ) : (
          <CardSlider items={inProgress} onCardClick={handleCardClick} />
        )}
      </section>

      {/* 심사 완료된 대출 */}
      <section className="mt-16">
        <div className="px-5 flex items-center gap-2 mb-4">
          <h2 className="text-lg font-bold text-text-primary">심사 완료된 대출</h2>
          <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-medium">
            {completed.length}
          </span>
        </div>

        {completed.length === 0 ? (
          <div className="px-5 flex items-center justify-center min-h-[200px]">
            <p className="text-md text-text-secondary">심사 완료된 대출이 없습니다.</p>
          </div>
        ) : (
          <CardSlider items={completed} onCardClick={handleCardClick} />
        )}
      </section>
    </div>
  );
}
