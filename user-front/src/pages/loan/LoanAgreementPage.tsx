/**
 * 대출 약정 페이지
 * Route: /loan/agreement/:applicationId
 * Layout: StepLayout
 *
 * Flow:
 *   1. 약정 체결 확인 (승인 정보 표시, 아이콘 없음)
 *   2. 약정 약관 동의 (TermsPage 공통 컴포넌트)
 *   3. 본인인증 금융인증서 (CustomerVerifyPage 공통 컴포넌트)
 *   4. 대출 실행 계좌 설정 (AccountStep 컴포넌트)
 *   5. 대출 실행 완료
 */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import { useLayoutStore } from "@/stores/layoutStore";
import { ConfirmPage } from "@/components/common/ConfirmPage";
import { TermsPage } from "@/components/terms/TermsPage";
import { CustomerVerifyPage } from "@/components/auth/CustomerVerifyPage";
import { AccountStep } from "@/components/loan/AccountStep";
import { formatAmount } from "@/utils/format";
import { MOCK_AGREEMENT_TERMS } from "@/mocks/agreementTerms";
import confettiAnimation from "@/assets/lottie/Success-Celebration.json";

type AgreementStep = "CONFIRM" | "TERMS" | "CERT" | "ACCOUNT" | "COMPLETE";

/** Mock 약정 데이터 — TODO: API 연동 시 제거 */
const MOCK_AGREEMENT_DATA = {
  applicationId: 2,
  productName: "우리 사장님 대출",
  approvedAmount: 65_000_000,
  proposedRate: 4.25,
  term: 60,
  repaymentMethod: "원리금균등분할상환",
  maturityDate: "2031-05-07",
};

export default function LoanAgreementPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<AgreementStep>("CONFIRM");

  useEffect(() => {
    useLayoutStore.getState().setStepTitle("약정 체결");

    useLayoutStore.getState().setOnBack(() => {
      if (step === "CONFIRM") {
        navigate(-1);
      } else if (step === "TERMS") {
        setStep("CONFIRM");
      } else if (step === "CERT") {
        setStep("TERMS");
      } else if (step === "ACCOUNT") {
        setStep("CERT");
      }
    });

    return () => {
      useLayoutStore.getState().setOnBack(null);
    };
  }, [navigate, step]);

  const data = MOCK_AGREEMENT_DATA;
  const termLabel = data.term >= 12 ? `${Math.floor(data.term / 12)}년` : `${data.term}개월`;

  switch (step) {
    // 1. 약정 체결 확인
    case "CONFIRM":
      return (
        <div className="h-full pt-25">
          <ConfirmPage
            icon={null}
            title={data.productName}
            description="아래 대출 조건을 확인하고 약정을 진행해주세요."
            rows={[
              { label: "승인금액", value: formatAmount(data.approvedAmount) },
              { label: "예정 금리(연)", value: `${data.proposedRate}%` },
              { label: "만기일", value: data.maturityDate.replace(/-/g, ".") },
              { label: "상환 방식", value: data.repaymentMethod },
            ]}
            buttonLabel="약정 동의하기"
            onConfirm={() => setStep("TERMS")}
          />
        </div>
      );

    // 2. 약정 약관 동의
    case "TERMS":
      return (
        <TermsPage
          title="약정 약관 동의"
          description="대출 약정을 위해 아래 약관에 동의해 주세요."
          terms={MOCK_AGREEMENT_TERMS}
          submitLabel="동의하고 계속"
          onSubmit={() => setStep("CERT")}
        />
      );

    // 3. 본인인증 금융인증서
    case "CERT":
      return (
        <CustomerVerifyPage
          description="약정 체결을 위해 본인 인증을 진행해주세요."
          onSuccess={() => setStep("ACCOUNT")}
        />
      );

    // 4. 대출 실행 계좌 설정
    case "ACCOUNT":
      return <AccountStep onSubmit={() => setStep("COMPLETE")} />;

    // 5. 대출 실행 완료
    case "COMPLETE":
      return (
        <div className="relative h-full pt-15 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none z-10 flex items-start justify-center">
            <Lottie
              animationData={confettiAnimation}
              loop={3}
              className="w-full max-w-sm -translate-y-25"
            />
          </div>
          <ConfirmPage
            title="대출이 실행되었습니다!"
            description="입금까지 영업일 기준 1~2일 소요됩니다."
            rows={[
              { label: "상품명", value: data.productName },
              { label: "실행금액", value: formatAmount(data.approvedAmount) },
              { label: "금리(연)", value: `${data.proposedRate}%` },
              { label: "대출기간", value: termLabel },
              { label: "상환방식", value: data.repaymentMethod },
            ]}
            buttonLabel="홈으로 이동"
            onConfirm={() => navigate("/")}
            secondaryButtonLabel="대출 진행 관리"
            onSecondary={() => navigate("/loan-applications")}
          />
        </div>
      );

    default:
      return null;
  }
}
