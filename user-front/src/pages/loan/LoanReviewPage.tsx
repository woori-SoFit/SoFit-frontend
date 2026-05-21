/**
 * 심사 진행 중 페이지
 * Route: /loan/review/:applicationId
 * Layout: MainLayout
 *
 * 심사 중인 대출 카드 클릭 시 진입
 * TODO: API 연동 시 useParams + useQuery로 실제 데이터 조회
 */
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Lottie from "lottie-react";
import { useLayoutStore } from "@/stores/layoutStore";
import { ConfirmPage } from "@/components/common/ConfirmPage";
import { MOCK_LOAN_APPLICATIONS } from "@/mocks/loanApplications";
import { formatAmount, formatDate } from "@/utils/format";
import clockAnimation from "@/assets/lottie/Clock.json";

/** 상환방식 한글 매핑 */
const REPAYMENT_LABELS: Record<string, string> = {
  EQUAL_PRINCIPAL: "원금균등",
  EQUAL_PAYMENT: "원리금균등",
  BULLET: "만기일시",
};

export default function LoanReviewPage() {
  const navigate = useNavigate();
  const { applicationId } = useParams<{ applicationId: string }>();

  useEffect(() => {
    useLayoutStore.getState().setStepTitle("심사 진행 중");
  }, []);

  // TODO: API 연동 시 useQuery로 교체
  const app = MOCK_LOAN_APPLICATIONS.find((a) => a.id === Number(applicationId));

  if (!app) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-text-secondary">신청 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="mt-20">
      <ConfirmPage
        icon={
          <Lottie animationData={clockAnimation} loop={true} className="w-24 h-24" />
        }
        title="심사가 진행 중이에요"
        rows={[
          { label: "신청 상품", value: app.productName },
          { label: "신청 금액", value: formatAmount(app.requestedAmount) },
          { label: "상환방식", value: REPAYMENT_LABELS[app.repaymentMethod] ?? app.repaymentMethod },
          { label: "신청 일시", value: formatDate(app.appliedAt) },
        ]}
        buttonLabel="확인"
        onConfirm={() => navigate(-1)}
      />
    </div>
  );
}
