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
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Lottie from "lottie-react";
import { useLayoutStore } from "@/stores/layoutStore";
import { ConfirmPage } from "@/components/common/ConfirmPage";
import { TermsPage } from "@/components/terms/TermsPage";
import { CustomerVerifyPage } from "@/components/auth/CustomerVerifyPage";
import { AccountStep } from "@/components/loan/AccountStep";
import { formatAmount } from "@/utils/format";
import { REPAYMENT_LABELS } from "@/constants/loanLabels";
import { requestAccountVerification, confirmAccountVerification, fetchLoanApplicationCompletedDetail } from "@/api/loanApi";
import { submitTermsConsents } from "@/api/termsApi";
import { useTerms } from "@/hooks/useTerms";
import { LOAN_KEYS } from "@/constants/queryKeys";
import handshakeAnimation from "@/assets/lottie/Handshake.json";
import { EmptyError } from "@/components/common/EmptyError";
import { CharacterLoadingSpinner } from "@/components/common/CharacterLoadingSpinner";

type AgreementStep = "CONFIRM" | "TERMS" | "CERT" | "ACCOUNT";

export default function LoanAgreementPage() {
  const navigate = useNavigate();
  const { applicationId } = useParams<{ applicationId: string }>();
  const [step, setStep] = useState<AgreementStep>("CONFIRM");
  const { terms: agreementTerms } = useTerms("LOAN_AGREEMENT");

  const { data, isLoading } = useQuery({
    queryKey: LOAN_KEYS.applicationCompleted(Number(applicationId)),
    queryFn: () => fetchLoanApplicationCompletedDetail(Number(applicationId)),
    enabled: !!applicationId,
  });

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

  if (isLoading) {
    return <CharacterLoadingSpinner text="약정 정보를 불러오는 중..." />;
  }

  if (!data || !data.decisionInfo) {
    return <EmptyError message="약정 정보를 찾을 수 없습니다." />;
  }

  const { decisionInfo } = data;
  const approvedAmount = decisionInfo.approvedAmount ?? 0;
  const approvedRate = decisionInfo.approvedRate ?? 0;
  const approvedTerm = decisionInfo.approvedTerm ?? 0;
  const termLabel = approvedTerm >= 12 ? `${Math.floor(approvedTerm / 12)}년` : `${approvedTerm}개월`;
  const repaymentLabel = REPAYMENT_LABELS[data.repaymentMethod] ?? data.repaymentMethod;

  switch (step) {
    // 1. 약정 체결 확인
    case "CONFIRM":
      return (
        <div className="h-full pt-8">
          <ConfirmPage
            icon={
              <div className="w-32 h-32 mb-5">
                <Lottie animationData={handshakeAnimation} loop={5} className="w-full h-full" />
              </div>
            }
            title={data.productName}
            description="아래 대출 조건을 확인하고 약정을 진행해주세요."
            rows={[
              { label: "승인금액", value: formatAmount(approvedAmount) },
              { label: "금리(연)", value: `${approvedRate}%` },
              { label: "대출기간", value: termLabel },
              { label: "상환 방식", value: repaymentLabel },
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
          termType="LOAN_AGREEMENT"
          title="약정 약관 동의"
          description="대출 약정을 위해 아래 약관에 동의해 주세요."
          submitLabel="동의하고 계속"
          onSubmit={async (agreedIds) => {
            const consents = agreementTerms.map((term) => ({
              termId: term.id,
              isConsented: agreedIds.includes(term.id),
            }));
            await submitTermsConsents({
              termType: "LOAN_AGREEMENT",
              applicationId: data.applicationId,
              consents,
            });
            setStep("CERT");
          }}
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
      return (
        <AccountStep
          onSendVerification={async (accountNumber) => {
            const result = await requestAccountVerification(data.applicationId, accountNumber);
            return { authCode: result.authCode };
          }}
          onVerifyCode={async (code) => {
            const verified = await confirmAccountVerification(data.applicationId, code);
            return {
              success: verified,
              message: verified ? undefined : "인증코드가 일치하지 않습니다.",
            };
          }}
          onSubmit={() => navigate(`/loan/execution/${applicationId}`, { replace: true })}
        />
      );

    default:
      return null;
  }
}
