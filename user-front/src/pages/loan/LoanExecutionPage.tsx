/**
 * 대출 실행 완료 페이지
 * Route: /loan/execution/:applicationId
 * Layout: StepLayout
 */
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Lottie from "lottie-react";
import { useLayoutStore } from "@/stores/layoutStore";
import { EmptyError } from "@/components/common/EmptyError";
import { CharacterLoadingSpinner } from "@/components/common/CharacterLoadingSpinner";
import { ConfirmPage } from "@/components/common/ConfirmPage";
import { fetchLoanExecutionDetail } from "@/api/loanApi";
import { LOAN_KEYS } from "@/constants/queryKeys";
import { formatAmount } from "@/utils/format";
import { REPAYMENT_LABELS } from "@/constants/loanLabels";
import LoanExecution from "@/assets/lottie/LoanExecution.json";

export default function LoanExecutionPage() {
  const navigate = useNavigate();
  const { applicationId } = useParams<{ applicationId: string }>();

  useEffect(() => {
    useLayoutStore.getState().setStepTitle("대출 실행");
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: [...LOAN_KEYS.all, "execution", Number(applicationId)],
    queryFn: () => fetchLoanExecutionDetail(Number(applicationId)),
    enabled: !!applicationId,
  });

  if (isLoading) {
    return <CharacterLoadingSpinner text="실행 정보를 불러오는 중..." />;
  }

  if (!data) {
    return <EmptyError message="실행 정보를 찾을 수 없습니다." />;
  }

  const termLabel = data.approvedTerm >= 12
    ? `${Math.floor(data.approvedTerm / 12)}년`
    : `${data.approvedTerm}개월`;

  return (
    <div className="relative h-full pt-10 overflow-hidden">
      <ConfirmPage
        icon={
          <div className="w-32 h-32 mb-6">
            <Lottie animationData={LoanExecution} loop />
          </div>
        }
        title="대출 실행이 완료되었습니다"
        description="대출금이 정상적으로 지급되었습니다."
        rows={[
          { label: "대출 상품명", value: data.productName },
          { label: "실행 금액", value: formatAmount(data.executedAmount) },
          { label: "확정 금리", value: `${data.approvedRate}%` },
          { label: "대출 기간", value: termLabel },
          { label: "상환 방식", value: REPAYMENT_LABELS[data.repaymentMethod] ?? data.repaymentMethod },
        ]}
        buttonLabel="홈으로 이동"
        onConfirm={() => navigate("/", { replace: true })}
        secondaryButtonLabel="실행 대출 관리"
        onSecondary={() => navigate("/loan-management", { replace: true })}
      />
    </div>
  );
}
