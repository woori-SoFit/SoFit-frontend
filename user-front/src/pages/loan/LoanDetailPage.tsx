/**
 * 대출 상품 상세 페이지
 * Route: /loan/:productId
 * Layout: StepLayout
 */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { UserRoundSearch, CircleDollarSign, CalendarRange } from "lucide-react";
import { useLayoutStore } from "@/stores/layoutStore";
import { BottomButton } from "@/components/common/BottomButton";
import { DraftResumeModal } from "@/components/loan/DraftResumeModal";
import { LOAN_KEYS } from "@/constants/queryKeys";
import { fetchLoanProduct, checkLoanDraft, deleteLoanApplication } from "@/api/loanApi";
import { formatMaxAmount, formatMaxTerm } from "@/utils/format";
import loanProductIcon from "@/assets/icons/loan-product.svg";

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

  useEffect(() => {
    useLayoutStore.getState().setStepTitle("상품 안내");
  }, []);

  /** pre-apply로 이동 (신규 신청) */
  const navigateToPreApply = () => {
    navigate(`/loan/pre-apply/${product!.productId}`, {
      state: { filterConditions: product!.filterConditions },
    });
  };

  /** 대출 신청 버튼 클릭 — draft 존재 여부 확인 후 분기 */
  const handleApplyClick = async () => {
    if (!product || isChecking) return;
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
      // API 실패 시 신규 신청으로 진행
      navigateToPreApply();
    } finally {
      setIsChecking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-text-secondary">상품 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-text-secondary">상품 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full relative overflow-hidden">
      {/* 배경 그라데이션 */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-sky-100/60 blur-3xl" />
      </div>

      {/* 상단 소개 영역 */}
      <div className="flex flex-col items-center pt-8 pb-2 px-5 z-1">
        <p className="text-sm font-medium text-primary mb-3">
          {product.productName}
        </p>
        <h1 className="text-2xl font-bold text-text-primary text-center leading-tight mb-3 whitespace-pre-line">
          {product.title}
        </h1>
        <p className="text-sm text-text-secondary text-center whitespace-pre-line">
          {product.subtitle}
        </p>
      </div>

      {/* 일러스트 영역 */}
      <div className="flex items-center justify-center py-10 z-1">
        <img src={loanProductIcon} alt="" aria-hidden="true" className="w-48 h-48 object-contain" />
      </div>

      {/* 상품 정보 카드 */}
      <div className="mx-5 p-6 bg-white rounded-xl shadow-card z-1">
        <ul className="flex flex-col gap-6">
          {/* 대상 */}
          <li className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
              <UserRoundSearch size={22} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-text-secondary mb-0.5">대상</p>
              <p className="text-sm font-semibold text-text-primary">
                {product.targetDescription}
              </p>
            </div>
          </li>

          {/* 금액 */}
          <li className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
              <CircleDollarSign size={22} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-text-secondary mb-0.5">금액</p>
              <p className="text-base font-semibold text-text-primary">
                {formatMaxAmount(product.maxLimit)}
              </p>
            </div>
          </li>

          {/* 기간 */}
          <li className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
              <CalendarRange size={22} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-text-secondary mb-0.5">기간</p>
              <p className="text-base font-semibold text-text-primary">
                {formatMaxTerm(product.maxTerm)}
              </p>
            </div>
          </li>
        </ul>
      </div>

      {/* 여백 — 버튼을 항상 하단에 고정 */}
      <div className="flex-1" />

      {/* 대출 신청 버튼 */}
      <BottomButton
        label={isChecking ? "확인 중..." : "대출 신청"}
        onClick={handleApplyClick}
        disabled={isChecking}
      />

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
            // draft 삭제 후 신규 신청 진행
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
