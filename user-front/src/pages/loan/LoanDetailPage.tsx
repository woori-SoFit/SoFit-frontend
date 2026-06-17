/**
 * 대출 상품 상세 페이지
 * Route: /loan/:productId
 * Layout: StepLayout
 *
 * Full Page Scroll Snap 구조 (iOS 앱 느낌)
 *   섹션 1: 상품 소개 (이름 / 타이틀 / 일러스트 / 요약 정보)
 *   섹션 2: 상품 상세 정보 1 (대상 / 한도 / 기간 / 금리)
 *   섹션 3: 상품 상세 정보 2 (우대금리 / 상환방식 / 담보 / 수수료)
 */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  House,
  UserRoundSearch,
  CircleDollarSign,
  CalendarRange,
  Percent,
  Star,
  RotateCcw,
  Shield,
  Receipt,
} from "lucide-react";
import { useLayoutStore } from "@/stores/layoutStore";
import { useMe } from "@/hooks/useMe";
import { BottomButton } from "@/components/common/BottomButton";
import { DraftResumeModal } from "@/components/loan/DraftResumeModal";
import { EmptyError } from "@/components/common/EmptyError";
import { CharacterLoadingSpinner } from "@/components/common/CharacterLoadingSpinner";
import { LOAN_KEYS } from "@/constants/queryKeys";
import { fetchLoanProduct, checkLoanDraft, deleteLoanApplication } from "@/api/loanApi";
import { formatMaxAmount, formatMaxTerm } from "@/utils/format";
import product1Icon from "@/assets/icons/Product1.png";
import product2Icon from "@/assets/icons/Product2.png";
import product3Icon from "@/assets/icons/Product3.png";
import type { LoanProductDescription } from "@/types/loan";

const PRODUCT_ICONS = [product1Icon, product2Icon, product3Icon];

// ── 상세 섹션 정의 ──────────────────────────────────────────────
interface DescItem {
  icon: React.ReactNode;
  label: string;
  key: keyof LoanProductDescription;
}

const DESC_SECTION_1: DescItem[] = [
  { icon: <UserRoundSearch size={20} className="text-primary" />, label: "대출 대상", key: "targetDetail" },
  { icon: <CircleDollarSign size={20} className="text-primary" />, label: "대출 한도", key: "limitDescription" },
  { icon: <CalendarRange size={20} className="text-primary" />, label: "대출 기간", key: "termDescription" },
  { icon: <Percent size={20} className="text-primary" />, label: "금리", key: "rateDescription" },
];

const DESC_SECTION_2: DescItem[] = [
  { icon: <Star size={20} className="text-primary" />, label: "우대금리", key: "preferentialRateDescription" },
  { icon: <RotateCcw size={20} className="text-primary" />, label: "상환방식", key: "repaymentDescription" },
  { icon: <Shield size={20} className="text-primary" />, label: "담보", key: "collateralDescription" },
  { icon: <Receipt size={20} className="text-primary" />, label: "수수료", key: "feeDescription" },
];

export default function LoanDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(false);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [draftData, setDraftData] = useState<{ applicationId?: number; resumeStep?: string }>({});

  const { data: product, isLoading } = useQuery({
    queryKey: LOAN_KEYS.detail(Number(productId)),
    queryFn: () => fetchLoanProduct(Number(productId)),
    enabled: !!productId,
  });

  const { isLoggedIn } = useMe();

  const onBack = useLayoutStore((s) => s.onBack);
  const onHome = useLayoutStore((s) => s.onHome);

  const handleBack = () => {
    if (onBack) onBack();
    else navigate(-1);
  };

  const handleHome = () => {
    if (onHome) onHome();
    else navigate("/");
  };

  useEffect(() => {
    useLayoutStore.getState().setStepTitle("상품 안내");
    useLayoutStore.getState().setOverlayHeader(true);
    return () => {
      useLayoutStore.getState().setOverlayHeader(false);
    };
  }, []);

  const navigateToPreApply = () => {
    navigate(`/loan/pre-apply/${product!.productId}`, {
      state: { filterConditions: product!.filterConditions },
    });
  };

  const handleApplyClick = async () => {
    if (!product || isChecking) return;

    // 비로그인 상태면 로그인 페이지로 이동
    if (!isLoggedIn) {
      const returnUrl = `/loan/${product.productId}`;
      navigate(`/login?returnUrl=${encodeURIComponent(returnUrl)}`, { replace: true });
      return;
    }

    setIsChecking(true);
    try {
      const result = await checkLoanDraft(product.productId);
      if (result.hasDraft) {
        setDraftData({ applicationId: result.applicationId, resumeStep: result.resumeStep });
        setShowDraftModal(true);
      } else {
        navigateToPreApply();
      }
    } catch {
      navigateToPreApply();
    } finally {
      setIsChecking(false);
    }
  };

  if (isLoading) {
    return (
      <div>
        <CharacterLoadingSpinner text="상품 정보를 불러오는 중..." />
      </div>
    );
  }

  if (!product) {
    return <EmptyError message="상품 정보를 찾을 수 없습니다." />;
  }

  const desc = product.productDescription;
  const hasDesc = !!desc;

  return (
    <div className="relative flex flex-col h-full">
      {/* 투명 오버레이 헤더 — absolute로 콘텐츠 위에 떠있음 */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-2 h-14 pointer-events-none">
        <button
          type="button"
          onClick={handleBack}
          aria-label="뒤로가기"
          className="w-10 h-10 flex items-center justify-center rounded-full pointer-events-auto"
        >
          <ChevronLeft size={26} className="text-gray-700 drop-shadow-sm" />
        </button>
        <button
          type="button"
          onClick={handleHome}
          aria-label="홈으로"
          className="w-10 h-10 flex items-center justify-center rounded-full pointer-events-auto"
        >
          <House size={22} className="text-gray-700 drop-shadow-sm" />
        </button>
      </div>

      {/* Scroll Snap 컨테이너 — 최상단부터 시작 */}
      <div className="flex-1 overflow-y-scroll snap-y snap-mandatory scroll-smooth pb-16 scrollbar-none">

        {/* ── 섹션 1: 상품 소개 ── */}
        <section className="snap-start snap-always min-h-full flex flex-col relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-sky-100/60 blur-3xl" />
          </div>

          <div className="flex flex-col items-center pt-20 pb-2 px-5 z-1">
            <p className="text-sm font-medium text-primary mb-3">{product.title}</p>
            <h1 className="text-2xl font-bold text-text-primary text-center leading-tight mb-3 whitespace-pre-line">
              {product.productName}
            </h1>
            <p className="text-sm text-text-secondary text-center whitespace-pre-line">
              {product.subtitle}
            </p>
          </div>

          <div className="flex items-center justify-center py-8 z-1">
            <img src={PRODUCT_ICONS[(product.productId - 1) % PRODUCT_ICONS.length]} width={160} height={160} alt="" aria-hidden="true" className="w-62 h-62 object-contain" />
          </div>

          {/* 요약 정보 카드 */}
          <div className="mx-5 p-6 bg-white rounded-xl shadow-card z-1">
            <ul className="flex flex-col gap-5">
              <li className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                  <UserRoundSearch size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-text-secondary mb-0.5">대상</p>
                  <p className="font-semibold text-text-primary">{product.targetSummary}</p>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                  <CircleDollarSign size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-text-secondary mb-0.5">금액</p>
                  <p className="font-semibold text-text-primary">{formatMaxAmount(product.maxLimit)}</p>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                  <CalendarRange size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-text-secondary mb-0.5">기간</p>
                  <p className="font-semibold text-text-primary">{formatMaxTerm(product.maxTerm)}</p>
                </div>
              </li>
            </ul>
          </div>

          {/* 스크롤 유도 인디케이터 */}
          {hasDesc && (
            <div className="flex flex-col items-center gap-2 py-6 z-1">
              <div className="flex flex-col gap-1 items-center">
                <div className="w-1 h-1 rounded-full bg-primary/40" />
                <div className="w-1 h-1 rounded-full bg-primary/60" />
                <div className="w-1 h-1 rounded-full bg-primary" />
              </div>
            </div>
          )}
        </section>

        {/* ── 섹션 2: 상세 정보 1 (대상/한도/기간/금리) ── */}
        {hasDesc && (
          <section className="snap-start snap-always min-h-full px-5 pt-15 pb-20">
            <h2 className="text-lg font-bold text-text-primary mb-5">상품 상세 정보</h2>
            <ul className="flex flex-col gap-4">
              {DESC_SECTION_1.map((item) => {
                const value = desc[item.key];
                if (!value) return null;
                return (
                  <li key={item.key} className="bg-white rounded-xl p-4 shadow-card">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                        {item.icon}
                      </div>
                      <p className="text-sm font-semibold text-text-primary">{item.label}</p>
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">
                      {value}
                    </p>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {/* ── 섹션 3: 상세 정보 2 (우대금리/상환/담보/수수료) ── */}
        {hasDesc && (
          <section className="snap-start snap-always min-h-full px-5 pt-15 pb-20">
            <h2 className="text-lg font-bold text-text-primary mb-5">금리 및 기타 안내</h2>
            <ul className="flex flex-col gap-4">
              {DESC_SECTION_2.map((item) => {
                const value = desc[item.key];
                if (!value) return null;
                return (
                  <li key={item.key} className="bg-white rounded-xl p-4 shadow-card">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                        {item.icon}
                      </div>
                      <p className="text-sm font-semibold text-text-primary">{item.label}</p>
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">
                      {value}
                    </p>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </div>

      {/* 대출 신청 버튼 — 스냅 컨테이너 위에 fixed로 고정 */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <BottomButton
          label={isChecking ? "확인 중..." : "대출 신청"}
          onClick={handleApplyClick}
          disabled={isChecking}
        />
      </div>

      {/* 임시저장 이어가기 모달 */}
      {showDraftModal && (
        <DraftResumeModal
          onResume={() => {
            setShowDraftModal(false);
            navigate("/loan/apply", {
              state: {
                productId: product.productId,
                applicationId: draftData.applicationId,
                resumeStep: draftData.resumeStep,
              },
            });
          }}
          onNewApply={async () => {
            setShowDraftModal(false);
            if (draftData.applicationId) {
              try {
                await deleteLoanApplication(draftData.applicationId);
              } catch {
                // 삭제 실패는 무시하고 진행
              }
            }
            navigateToPreApply();
          }}
          onClose={() => setShowDraftModal(false)}
        />
      )}
    </div>
  );
}
