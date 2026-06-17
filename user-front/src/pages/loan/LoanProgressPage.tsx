/**
 * 대출 진행 관리 페이지
 * Route: /loan-applications
 * Layout: StepLayout
 *
 * 심사 중 + 심사 완료 대출 목록을 API에서 조회하여 카드 슬라이더로 표시
 *
 * 실시간 업데이트 전략:
 * - SSE(useSSE 훅)를 통해 LOAN_DECIDED 이벤트 수신 시 자동 refetch
 * - 탭 포커스 복귀 시에도 최신 상태 반영 (refetchOnWindowFocus)
 */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useLayoutStore } from "@/stores/layoutStore";
import { fetchLoanApplicationsInProgress, fetchLoanApplicationsCompleted } from "@/api/loanApi";
import { LOAN_KEYS } from "@/constants/queryKeys";
import { CardSlider } from "@/components/loan/CardSlider";
import { CharacterLoadingSpinner } from "@/components/common/CharacterLoadingSpinner";
import type { LoanApplication } from "@/types/loan";
import nonewibee1 from "@/assets/icons/None-BizData.svg";
import nonewibee2 from "@/assets/icons/None-BizData2.svg";

export default function LoanProgressPage() {
  const navigate = useNavigate();

  useEffect(() => {
    useLayoutStore.getState().setStepTitle("대출 진행 관리");
  }, []);

  const { data: inProgress = [], isLoading: isLoadingInProgress } = useQuery({
    queryKey: LOAN_KEYS.applicationsInProgress(),
    queryFn: fetchLoanApplicationsInProgress,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });

  const { data: completed = [], isLoading: isLoadingCompleted } = useQuery({
    queryKey: LOAN_KEYS.applicationsCompleted(),
    queryFn: fetchLoanApplicationsCompleted,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });

  const handleCardClick = (app: LoanApplication) => {
    if (app.status === "APPROVED") {
      navigate(`/loan/agreement/${app.id}`);
    } else if (app.status === "REJECTED" || app.status === "CANCELLED") {
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
    return <CharacterLoadingSpinner text="대출 현황을 불러오는 중..." />;
  }

  return (
    <div className="flex flex-col gap-6" data-testid="loan-progress-page">
      {/* 심사 중인 대출 */}
      <section className="pt-5 flex flex-col gap-3">
        <div className="px-5 flex items-center gap-2">
          <h2 className="text-lg font-bold text-text-primary">심사 중인 대출</h2>
          <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-medium">
            {inProgress.length}
          </span>
        </div>

        {inProgress.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[230px] gap-2">
            <img src={nonewibee1} alt="" aria-hidden="true" className="w-32 object-contain opacity-60" />
            <p className="text-text-secondary">심사 중인 대출이 없습니다.</p>
          </div>
        ) : (
          <CardSlider items={inProgress} onCardClick={handleCardClick} />
        )}
      </section>

      {/* 심사 완료된 대출 */}
      <section className="pt-5 flex flex-col gap-4">
        <div className="px-5 flex items-center gap-2">
          <h2 className="text-lg font-bold text-text-primary">심사 완료된 대출</h2>
          <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-medium">
            {completed.length}
          </span>
        </div>

        {completed.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[230px] gap-2">
            <img src={nonewibee2} alt="" aria-hidden="true" className="w-32 object-contain opacity-60" />
            <p className="text-text-secondary">심사 완료된 대출이 없습니다.</p>
          </div>
        ) : (
          <CardSlider items={completed} onCardClick={handleCardClick} />
        )}
      </section>
    </div>
  );
}
