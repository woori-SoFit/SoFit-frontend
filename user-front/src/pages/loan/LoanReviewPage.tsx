/**
 * 심사 진행 중 페이지
 * Route: /loan/review/:applicationId
 * Layout: StepLayout
 *
 * 심사 중인 대출 카드 클릭 시 진입
 */
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Lottie from "lottie-react";
import { useLayoutStore } from "@/stores/layoutStore";
import { ConfirmPage } from "@/components/common/ConfirmPage";
import { EmptyError } from "@/components/common/EmptyError";
import { CharacterLoadingSpinner } from "@/components/common/CharacterLoadingSpinner";
import { fetchLoanApplicationDetail } from "@/api/loanApi";
import { LOAN_KEYS } from "@/constants/queryKeys";
import { formatAmount, formatDate } from "@/utils/format";
import { REPAYMENT_LABELS } from "@/constants/loanLabels";
import clockAnimation from "@/assets/lottie/Clock.json";

export default function LoanReviewPage() {
  const navigate = useNavigate();
  const { applicationId } = useParams<{ applicationId: string }>();

  useEffect(() => {
    useLayoutStore.getState().setStepTitle("심사 진행 중");
  }, []);

  const { data: app, isLoading } = useQuery({
    queryKey: LOAN_KEYS.application(Number(applicationId)),
    queryFn: () => fetchLoanApplicationDetail(Number(applicationId)),
    enabled: !!applicationId,
  });

  if (isLoading) {
    return <CharacterLoadingSpinner text="신청 정보를 불러오는 중..." />;
  }

  if (!app) {
    return <EmptyError message="신청 정보를 찾을 수 없습니다." />;
  }

  return (
    <div className="h-full pt-10">
      <ConfirmPage
        icon={
          <Lottie animationData={clockAnimation} loop={7} className="w-36 h-36" />
        }
        title="심사가 진행 중이에요"
        rows={[
          { label: "신청 상품", value: app.productName },
          { label: "신청 금액", value: formatAmount(app.requestedAmount) },
          { label: "대출 기간", value: `${app.requestedTerm}개월` },
          { label: "상환방식", value: REPAYMENT_LABELS[app.repaymentMethod] ?? app.repaymentMethod },
          { label: "신청 일시", value: formatDate(app.appliedAt) },
        ]}
        buttonLabel="확인"
        onConfirm={() => navigate(-1)}
      />
    </div>
  );
}
