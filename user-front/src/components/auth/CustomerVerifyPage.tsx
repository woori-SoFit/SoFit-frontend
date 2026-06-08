/**
 * 고객 정보 입력 + PIN 인증 페이지 공통 컴포넌트
 *
 * 흐름:
 *   1. 고객 정보 입력 (CustomerInfoForm)
 *   2. 다음 버튼 → 금융인증서 조회 (POST /financial-cert/lookup)
 *   3. 금융인증서 확인 화면 (ConfirmPage)
 *   4. PIN 입력하기 → PinInput
 *   5. PIN 인증 (POST /financial-cert/verify-pin)
 *   6-a. 성공 → VerifySuccessOverlay → onSuccess 호출
 *   6-b. 실패 → 에러 메시지 + 재입력
 */
import { useState, useCallback } from "react";
import Lottie from "lottie-react";
import { ShieldCheck, Lock } from "lucide-react";
import { PinInput } from "./PinInput";
import { CustomerInfoForm } from "./CustomerInfoForm";
import { VerifySuccessOverlay } from "./VerifySuccessOverlay";
import { ConfirmPage } from "@/components/common/ConfirmPage";
import { BottomButton } from "@/components/common/BottomButton";
import { lookupFinancialCert, verifyFinancialCertificate } from "@/api/authApi";
import { formatDate } from "@/utils/format";
import type { CustomerVerifyData, FinancialCertLookupResult } from "@/types/auth";
import documentAnimation from "@/assets/lottie/Document.json";

export type { CustomerVerifyData };

interface CustomerVerifyPageProps {
  /** 페이지 설명 (선택) */
  description?: string;
  /** PIN 검증 성공 후 호출 (입력 정보 전달) */
  onSuccess: (data: CustomerVerifyData) => void;
}

type Step = "INFO" | "CERT_CONFIRM" | "PIN";

export function CustomerVerifyPage({ description, onSuccess }: CustomerVerifyPageProps) {
  const [step, setStep] = useState<Step>("INFO");
  const [name, setName] = useState("");
  const [rrnFront, setRrnFront] = useState("");
  const [rrnBack, setRrnBack] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [certInfo, setCertInfo] = useState<FinancialCertLookupResult | null>(null);

  /** 정보 입력 유효성 검사 */
  const isInfoValid =
    name.trim().length >= 2 &&
    rrnFront.length === 6 &&
    rrnBack.length === 1 &&
    phone.replace(/\D/g, "").length === 11;

  /** 금융인증서 조회 */
  const handleLookup = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const res = await lookupFinancialCert({
        holderName: name.trim(),
        residentNumber: rrnFront + rrnBack,
        phoneNumber: phone.replace(/\D/g, ""),
      });
      setCertInfo(res.result);
      setStep("CERT_CONFIRM");
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setErrorMessage(axiosErr.response?.data?.message || "인증서를 찾을 수 없습니다. 정보를 확인해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  /** PIN 인증 */
  const handlePinSubmit = useCallback(
    async (pin: string) => {
      setIsLoading(true);
      setErrorMessage("");
      try {
        await verifyFinancialCertificate({
          phoneNumber: phone.replace(/\D/g, ""),
          holderName: name.trim(),
          residentNumber: rrnFront + rrnBack,
          pin,
        });
        setShowSuccess(true);
        setTimeout(() => {
          onSuccess({
            name: name.trim(),
            residentNumber: rrnFront + rrnBack,
            phone: phone.replace(/\D/g, ""),
            pin,
          });
        }, 1300);
      } catch (err: unknown) {
        const axiosErr = err as { response?: { status?: number; data?: { message?: string } } };
        const status = axiosErr.response?.status;
        if (status === 404) {
          setErrorMessage(axiosErr.response?.data?.message || "인증서를 찾을 수 없습니다. 정보를 다시 확인해주세요.");
        } else {
          setErrorMessage(axiosErr.response?.data?.message || "PIN이 일치하지 않습니다. 다시 입력해 주세요.");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [name, rrnFront, rrnBack, phone, onSuccess]
  );

  // ── PIN 입력 화면 ──
  if (step === "PIN") {
    return (
      <div className="relative flex flex-col h-full overflow-hidden">
        <div className="flex-1 min-h-0">
          <PinInput
            onSubmit={handlePinSubmit}
            isLoading={isLoading || showSuccess}
            errorMessage={errorMessage}
          />
        </div>
        <div className="px-5 pb-6 shrink-0">
          <button
            type="button"
            onClick={() => {
              setStep("INFO");
              setErrorMessage("");
            }}
            disabled={showSuccess}
            className="w-full h-12 rounded-lg border border-border-default text-sm font-semibold text-text-primary hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            정보 다시 입력하기
          </button>
        </div>
        <VerifySuccessOverlay visible={showSuccess} />
      </div>
    );
  }

  // ── 금융인증서 확인 화면 ──
  if (step === "CERT_CONFIRM") {
    const certRows = certInfo
      ? [
          { label: "인증서 종류", value: "금융인증서" },
          { label: "인증서 번호", value: certInfo.certNumber },
          { label: "사용자", value: certInfo.holderName },
          { label: "발급일", value: formatDate(certInfo.issuedAt) },
          { label: "만료일", value: formatDate(certInfo.expiresAt) },
        ]
      : [
          { label: "인증서 종류", value: "금융인증서" },
          { label: "사용자", value: name.trim() || "—" },
        ];

    return (
      <ConfirmPage
        icon={<Lottie animationData={documentAnimation} loop={3} className="w-40 h-40" />}
        title="금융인증서를 불러왔어요"
        description="아래 정보를 확인 후 인증을 진행해 주세요."
        rows={certRows}
        buttonLabel="PIN 입력하기"
        onConfirm={() => setStep("PIN")}
      >
        <div className="flex flex-col gap-3 text-text-secondary mt-4">
          <div className="flex items-start gap-2">
            <ShieldCheck size={18} className="shrink-0" />
            <p className="text-sm">본인 명의의 금융인증서만 사용 가능합니다.</p>
          </div>
          <div className="flex items-start gap-2">
            <Lock size={18} className="shrink-0" />
            <p className="text-sm">타인의 금융인증서를 사용하거나 대여 시 관련 법률에 따라 처벌받을 수 있습니다.</p>
          </div>
        </div>
      </ConfirmPage>
    );
  }

  // ── 정보 입력 화면 ──
  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 px-5 pt-7 pb-4">
        <div className="mb-10">
          <h1 className="text-xl font-bold text-text-primary pb-2">
            금융인증서를 불러오기 위해<br />고객 정보를 입력해주세요
          </h1>
          {description && (
            <p className="text-sm text-text-secondary">{description}</p>
          )}
        </div>

        <CustomerInfoForm
          name={name}
          rrnFront={rrnFront}
          rrnBack={rrnBack}
          phone={phone}
          onNameChange={setName}
          onRrnFrontChange={setRrnFront}
          onRrnBackChange={setRrnBack}
          onPhoneChange={setPhone}
        />
      </div>

      {/* 에러 메시지 */}
      {errorMessage && step === "INFO" && (
        <div className="px-5 pb-2">
          <p className="text-sm text-error text-center">{errorMessage}</p>
        </div>
      )}

      <BottomButton
        label={isLoading ? "조회 중..." : "다음"}
        onClick={handleLookup}
        disabled={!isInfoValid || isLoading}
      />
    </div>
  );
}
