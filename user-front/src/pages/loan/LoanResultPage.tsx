/**
 * 심사 결과 페이지
 * Route: /loan/result/:applicationId
 * Layout: StepLayout
 *
 * status에 따라 분기:
 * - APPROVED: 승인 화면 (약정 체결 버튼 + SCB 리포트 버튼)
 * - REJECTED: 거절 화면 (거절 사유 표시)
 */
import { useEffect } from "react";
import Lottie from "lottie-react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useLayoutStore } from "@/stores/layoutStore";
import { ConfirmPage } from "@/components/common/ConfirmPage";
import { fetchLoanApplicationCompletedDetail } from "@/api/loanApi";
import { LOAN_KEYS } from "@/constants/queryKeys";
import { formatAmount } from "@/utils/format";
import { REPAYMENT_LABELS } from "@/constants/loanLabels";
import confettiAnimation from "@/assets/lottie/Flex-Confetti.json";

export default function LoanResultPage() {
  const navigate = useNavigate();
  const { applicationId } = useParams<{ applicationId: string }>();

  useEffect(() => {
    useLayoutStore.getState().setStepTitle("심사 결과");
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: LOAN_KEYS.application(Number(applicationId)),
    queryFn: () => fetchLoanApplicationCompletedDetail(Number(applicationId)),
    enabled: !!applicationId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-text-secondary">심사 결과를 불러오는 중...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-text-secondary">신청 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  if (data.decisionInfo.decision === "APPROVED") {
    return <ApprovedView data={data} navigate={navigate} />;
  }

  return <RejectedView data={data} navigate={navigate} />;
}

/** 승인 화면 */
function ApprovedView({
  data,
  navigate,
}: {
  data: { applicationId: number; productName: string; requestedAmount: number; repaymentMethod: string; decisionInfo: { approvedAmount: number | null; approvedRate: number | null; approvedTerm: number | null } };
  navigate: ReturnType<typeof useNavigate>;
}) {
  const { decisionInfo } = data;
  const termLabel = decisionInfo.approvedTerm
    ? decisionInfo.approvedTerm >= 12
      ? `${Math.floor(decisionInfo.approvedTerm / 12)}년`
      : `${decisionInfo.approvedTerm}개월`
    : "-";

  return (
    <div className="relative h-full pt-10">
      <div className="absolute inset-x-0 top-0 pointer-events-none z-10 flex justify-center">
        <Lottie
          animationData={confettiAnimation}
          loop={3}
          className="w-full max-w-sm -translate-y-20"
        />
      </div>

      <ConfirmPage
        title={<>심사가 <span className="text-primary">승인</span>되었습니다!</>}
        rows={[
          { label: "신청 상품", value: data.productName },
          { label: "승인금액", value: decisionInfo.approvedAmount ? formatAmount(decisionInfo.approvedAmount) : "-" },
          { label: "금리(연)", value: decisionInfo.approvedRate ? `${decisionInfo.approvedRate}%` : "-" },
          { label: "대출기간", value: termLabel },
          { label: "상환방식", value: REPAYMENT_LABELS[data.repaymentMethod] ?? data.repaymentMethod },
        ]}
        buttonLabel="약정 체결하기"
        onConfirm={() => navigate(`/loan/agreement/${data.applicationId}`)}
        secondaryButtonLabel="성장 S등급 분석 리포트 보기"
        onSecondary={() => navigate("/grade-report")}
      />
    </div>
  );
}

/** 거절 화면 */
function RejectedView({
  data,
  navigate,
}: {
  data: { productName: string; requestedAmount: number; decisionInfo: { rejectionReason: string | null } };
  navigate: ReturnType<typeof useNavigate>;
}) {
  return (
    <div className="h-full pt-30">
      <ConfirmPage
        icon={
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        }
        title={<>아쉽지만 대출을<br />이용하실 수 없습니다.</>}
        description={
          <>
            고객님의 소중한 정보를 바탕으로 대출심사를 진행하였으나,
            <br />
            내부심사기준에 따라 대출이 불가합니다.
          </>
        }
        rows={[
          { label: "거절 사유", value: data.decisionInfo.rejectionReason ?? "내부 심사 기준 미달" },
        ]}
        buttonLabel="홈으로 가기"
        onConfirm={() => navigate("/")}
        secondaryButtonLabel="성장 S등급 분석 리포트 보기"
        onSecondary={() => navigate("/grade-report")}
      />
    </div>
  );
}
