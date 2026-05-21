/**
 * 심사 결과 페이지
 * Route: /loan/result/:applicationId
 * Layout: MainLayout
 *
 * status에 따라 분기:
 * - APPROVED: 승인 화면 (약정 체결 버튼 + SCB 리포트 버튼)
 * - REJECTED: 거절 화면 (추후 구현)
 *
 * TODO: API 연동 시 useParams + useQuery로 실제 데이터 조회
 */
import Lottie from "lottie-react";
import { useNavigate } from "react-router-dom";
import { ConfirmPage } from "@/components/common/ConfirmPage";
import { formatAmount } from "@/utils/format";
import confettiAnimation from "@/assets/lottie/Flex-Confetti.json";

/** Mock 승인 데이터 — TODO: API 연동 시 제거 */
const MOCK_APPROVAL = {
  applicationId: 2,
  productName: "우리 사장님 대출",
  status: "APPROVED" as const,
  requestedAmount: 70_000_000,
  approvedAmount: 65_000_000,
  proposedRate: 4.25,
  term: 60,
  repaymentMethod: "원리금균등분할상환",
  appliedAt: "2026-05-02",
  updatedAt: "2026-05-07",
};

export default function LoanResultPage() {
  const navigate = useNavigate();

  // TODO: API 연동 시 useParams + useQuery로 교체
  const data = MOCK_APPROVAL;

  if (data.status === "APPROVED") {
    return <ApprovedView data={data} navigate={navigate} />;
  }

  // TODO: REJECTED 화면 구현
  return <div data-testid="loan-result-page">거절 화면 (추후 구현)</div>;
}

/** 승인 화면 — ConfirmPage + Lottie 오버레이 */
function ApprovedView({
  data,
  navigate,
}: {
  data: typeof MOCK_APPROVAL;
  navigate: ReturnType<typeof useNavigate>;
}) {
  const termLabel = data.term >= 12 ? `${Math.floor(data.term / 12)}년` : `${data.term}개월`;

  return (
    <div className="relative h-full mt-10">
      {/* Lottie 축하 애니메이션 오버레이 */}
      <div className="absolute inset-x-0 top-0 pointer-events-none z-10 flex justify-center">
        <Lottie
          animationData={confettiAnimation}
          loop={true}
          className="w-full max-w-sm -translate-y-35"
        />
      </div>

      <ConfirmPage
        title={<>심사가 <span className="text-primary">승인</span>되었습니다!</>}
        rows={[
          { label: "신청 상품", value: data.productName },
          { label: "신청금액", value: formatAmount(data.requestedAmount) },
          { label: "승인금액", value: formatAmount(data.approvedAmount) },
          { label: "금리(연)", value: `${data.proposedRate}%` },
          { label: "대출기간", value: termLabel },
          { label: "상환방식", value: data.repaymentMethod },
        ]}
        buttonLabel="약정 체결하기"
        onConfirm={() => navigate(`/loan/agreement/${data.applicationId}`)}
        secondaryButtonLabel="SCB 분석 리포트 보기"
        onSecondary={() => navigate("/grade-report")}
      />
    </div>
  );
}
