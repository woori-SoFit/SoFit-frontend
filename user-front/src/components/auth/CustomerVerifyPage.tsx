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
import { ShieldCheck, Lock } from "lucide-react";
import { PinInput } from "./PinInput";
import { CustomerInfoForm } from "./CustomerInfoForm";
import { VerifySuccessOverlay } from "./VerifySuccessOverlay";
import { BottomButton } from "@/components/common/BottomButton";
import { lookupFinancialCert, verifyFinancialCertificate, verifyPinForSignup } from "@/api/authApi";
import { formatDate } from "@/utils/format";
import type { CustomerVerifyData, FinancialCertLookupResult } from "@/types/auth";

export type { CustomerVerifyData };

interface CustomerVerifyPageProps {
  /** 페이지 설명 (선택) */
  description?: string;
  /** PIN 검증 성공 후 호출 (입력 정보 전달) */
  onSuccess: (data: CustomerVerifyData) => void;
  /** "signup"이면 회원가입용 엔드포인트 사용 */
  variant?: "default" | "signup";
}

type Step = "INFO" | "CERT_CONFIRM" | "PIN";

export function CustomerVerifyPage({ description, onSuccess, variant = "default" }: CustomerVerifyPageProps) {
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
        const verifyParams = {
          phoneNumber: phone.replace(/\D/g, ""),
          holderName: name.trim(),
          residentNumber: rrnFront + rrnBack,
          pin,
        };
        if (variant === "signup") {
          await verifyPinForSignup(verifyParams);
        } else {
          await verifyFinancialCertificate(verifyParams);
        }
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
        <VerifySuccessOverlay visible={showSuccess} />
      </div>
    );
  }

  // ── 금융인증서 확인 화면 ──
  if (step === "CERT_CONFIRM") {
    const holderName = certInfo?.holderName || name.trim();
    const issuedDate = certInfo ? formatDate(certInfo.issuedAt) : "—";
    const expiresDate = certInfo ? formatDate(certInfo.expiresAt) : "—";
    const certNumber = certInfo?.certNumber || "—";

    return <CertConfirmView
      holderName={holderName}
      certNumber={certNumber}
      issuedDate={issuedDate}
      expiresDate={expiresDate}
      onNext={() => setStep("PIN")}
    />;
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

/** 금융인증서 확인 화면 — 등장 + 터치 시 Y축 회전 */
function CertConfirmView({
  holderName,
  certNumber,
  issuedDate,
  expiresDate,
  onNext,
}: {
  holderName: string;
  certNumber: string;
  issuedDate: string;
  expiresDate: string;
  onNext: () => void;
}) {
  const [flipKey, setFlipKey] = useState(0);

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 px-5 pt-8 pb-4 flex flex-col items-center">
        <p className="text-sm text-primary font-medium mb-1">
          {holderName}님의 금융인증서
        </p>
        <h2 className="text-lg font-bold text-text-primary mb-8">
          인증서를 확인해주세요
        </h2>

        {/* 인증서 카드 — 터치할 때마다 key 변경으로 회전 재트리거 */}
        <div style={{ perspective: "800px" }}>
          <div
            key={flipKey}
            onClick={() => setFlipKey((k) => k + 1)}
            className="w-[220px] rounded-2xl bg-linear-to-br from-[#2563EB] to-[#1d4ed8] px-5 py-7 text-white shadow-[0_20px_60px_rgba(37,99,235,0.4),0_8px_24px_rgba(0,0,0,0.15)] relative overflow-hidden cursor-pointer animate-[cert-flip_0.8s_ease-out_both]"
          >
            <div className="absolute -left-8 -bottom-8 w-36 h-36 rounded-full bg-white/10" />
            <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-white/5" />

            <div className="relative z-10">
              <p className="text-base font-bold mb-0.5">
                {holderName} <span className="text-yellow-300">★</span>
              </p>
              <p className="text-[11px] text-white/70">금융인증서</p>
            </div>

            <div className="relative z-10 mt-6">
              <p className="text-[10px] text-white/60 mb-0.5">인증서 번호</p>
              <p className="text-xs font-mono tracking-wide">{certNumber}</p>
            </div>

            <div className="relative z-10 mt-5">
              <p className="text-[10px] text-white/60 mb-0.5">발급일</p>
              <p className="text-xs font-medium">{issuedDate}</p>
            </div>

            <div className="relative z-10 mt-3">
              <p className="text-[10px] text-white/60 mb-0.5">만료일</p>
              <p className="text-xs font-medium">{expiresDate}</p>
            </div>

            <div className="relative z-10 mt-6 pt-3 border-t border-white/20">
              <p className="text-[10px] text-white/50 text-center">발급기관: 금융결제원</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 text-text-secondary mt-10 w-4/5">
          <div className="flex items-start gap-2">
            <ShieldCheck size={16} className="shrink-0 mt-0.5" />
            <p className="text-xs">본인 명의의 금융인증서만 사용 가능합니다.</p>
          </div>
          <div className="flex items-start gap-2">
            <Lock size={16} className="shrink-0 mt-0.5" />
            <p className="text-xs">타인의 금융인증서를 사용하거나 대여 시 관련 법률에 따라 처벌받을 수 있습니다.</p>
          </div>
        </div>
      </div>

      <BottomButton label="PIN 입력하기" onClick={onNext} />

      <style>{`
        @keyframes cert-flip {
          0% { transform: rotateY(-180deg); opacity: 0; }
          40% { opacity: 1; }
          100% { transform: rotateY(0deg); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
