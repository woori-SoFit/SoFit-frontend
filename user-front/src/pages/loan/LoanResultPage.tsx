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
import { useEffect } from "react";
import Lottie from "lottie-react";
import { useNavigate, useParams } from "react-router-dom";
import { useLayoutStore } from "@/stores/layoutStore";
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

/** Mock 거절 데이터 — TODO: API 연동 시 제거 */
const MOCK_REJECTION = {
  applicationId: 3,
  productName: "우리 Oh!(5)클릭 대출",
  status: "REJECTED" as const,
  requestedAmount: 50_000_000,
  rejectionReason: "신용도 기준 미달",
  appliedAt: "2026-04-15",
  updatedAt: "2026-04-20",
};

export default function LoanResultPage() {
  const navigate = useNavigate();
  const { applicationId } = useParams<{ applicationId: string }>();

  useEffect(() => {
    useLayoutStore.getState().setStepTitle("심사 결과");
  }, []);

  // TODO: API 연동 시 useQuery로 교체
  const allMockData = [MOCK_APPROVAL, MOCK_REJECTION];
  const data = allMockData.find((d) => d.applicationId === Number(applicationId));

  if (!data) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-text-secondary">신청 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  if (data.status === "APPROVED") {
    return <ApprovedView data={data} navigate={navigate} />;
  }

  return <RejectedView data={data as typeof MOCK_REJECTION} navigate={navigate} />;
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
    <div className="relative h-full pt-10">
      {/* Lottie 축하 애니메이션 오버레이 */}
      <div className="absolute inset-x-0 top-0 pointer-events-none z-10 flex justify-center">
        <Lottie
          animationData={confettiAnimation}
          loop={true}
          className="w-full max-w-sm -translate-y-20"
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
        secondaryButtonLabel="성장 S등급 분석 리포트 보기"
        onSecondary={() => navigate("/grade-report")}
      />
    </div>
  );
}

/** 거절 화면 — ConfirmPage 재사용 */
function RejectedView({
  data,
  navigate,
}: {
  data: typeof MOCK_REJECTION;
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
          { label: "거절 사유", value: data.rejectionReason },
        ]}
        buttonLabel="홈으로 가기"
        onConfirm={() => navigate("/")}
        secondaryButtonLabel="성장 S등급 분석 리포트 보기"
        onSecondary={() => navigate("/grade-report")}
      />
    </div>
  );
}
