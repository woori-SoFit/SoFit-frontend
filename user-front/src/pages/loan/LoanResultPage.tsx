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
import { EmptyError } from "@/components/common/EmptyError";
import { CharacterLoadingSpinner } from "@/components/common/CharacterLoadingSpinner";
import { ConfirmPage } from "@/components/common/ConfirmPage";
import { fetchLoanApplicationCompletedDetail } from "@/api/loanApi";
import { LOAN_KEYS } from "@/constants/queryKeys";
import { formatAmount } from "@/utils/format";
import { REPAYMENT_LABELS } from "@/constants/loanLabels";
import confettiAnimation from "@/assets/lottie/Flex-Confetti.json";
import alert from "@/assets/lottie/Alert-Circle.json";
import sReportIcon from "@/assets/icons/s-report-icon.svg";

export default function LoanResultPage() {
  const navigate = useNavigate();
  const { applicationId } = useParams<{ applicationId: string }>();

  useEffect(() => {
    useLayoutStore.getState().setStepTitle("심사 결과");
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: LOAN_KEYS.applicationCompleted(Number(applicationId)),
    queryFn: () => fetchLoanApplicationCompletedDetail(Number(applicationId)),
    enabled: !!applicationId,
  });

  if (isLoading) {
    return <CharacterLoadingSpinner text="심사 결과를 불러오는 중..." />;
  }

  if (!data) {
    return <EmptyError message="신청 정보를 찾을 수 없습니다." />;
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
    <div className="h-full pt-14">
      <ConfirmPage
        icon={
          <div className="w-18 h-18 mb-2">
            <Lottie animationData={alert} loop={1} />
          </div>
        }
        title={<>이번 대출은<br />아쉽게도 승인되지 않았어요</>}
        description={
          <>
            제출해 주신 정보를 바탕으로 심사를 진행했어요.
            <br />
            성장 S등급 분석 리포트에서 다음 준비 방향을 확인해보세요.
          </>
        }
        rows={[
          { label: "거절 사유", value: data.decisionInfo.rejectionReason ?? "내부 심사 기준 미달" },
        ]}
        buttonLabel="성장 S등급 분석 리포트 보기"
        onConfirm={() => navigate("/grade-report")}
        secondaryButtonLabel="홈으로 가기"
        onSecondary={() => navigate("/")}
      >
        {/* S등급 분석 리포트 안내 카드 */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 className="font-bold text-text-primary mb-1.5">
                성장 S등급 분석 리포트 확인하기
              </h4>
              <p className="text-sm text-text-secondary leading-relaxed">
                심사에 참고될 수 있는 항목과<br />
                개선 포인트를 확인할 수 있어요.
              </p>
            </div>
            <img src={sReportIcon} alt="" aria-hidden="true" className="w-14 h-14 object-contain shrink-0" />
          </div>
        </div>
      </ConfirmPage>
    </div>
  );
}
