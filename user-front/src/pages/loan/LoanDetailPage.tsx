/**
 * 대출 상품 상세 페이지
 * Route: /loan/:productId
 * Layout: StepLayout
 *
 * TODO: API 연동 시 MOCK_PRODUCTS 제거 후 useQuery로 교체
 */
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserRoundSearch, CircleDollarSign, CalendarRange } from "lucide-react";
import { useLayoutStore } from "@/stores/layoutStore";
import { BottomButton } from "@/components/common/BottomButton";
import { getMockLoanProduct } from "@/mocks/loanProducts";

/** 금액 포맷 */
function formatMaxAmount(amount: number) {
  const man = amount / 10_000;
  if (man >= 10_000) return `최대 ${(man / 10_000).toFixed(0)}억원`;
  return `최대 ${man.toLocaleString()}만원`;
}

/** 기간 포맷 */
function formatMaxTerm(months: number) {
  if (months % 12 === 0) return `${months / 12}년 이내`;
  return `${months}개월 이내`;
}

export default function LoanDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  const product = getMockLoanProduct(Number(productId));

  useEffect(() => {
    useLayoutStore.getState().setStepTitle("상품 안내");
  }, []);

  if (!product) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-text-secondary">상품 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full relative overflow-hidden">
      {/* 배경 그라데이션 — 중앙 기준 은은한 하늘색 */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-sky-100/60 blur-3xl" />
      </div>
      {/* 상단 소개 영역 */}
      <div className="flex flex-col items-center pt-8 pb-2 px-5">
        {/* 상품명 */}
        <p className="text-sm font-medium text-primary mb-3">
          {product.name}
        </p>
        {/* 타이틀 */}
        <h1 className="text-2xl font-bold text-text-primary text-center leading-tight mb-3 whitespace-pre-line">
          {product.title}
        </h1>
        {/* 설명 */}
        <p className="text-sm text-text-secondary text-center whitespace-pre-line">
          {product.description}
        </p>
      </div>

      {/* 일러스트 영역 (플레이스홀더) */}
      <div className="flex items-center justify-center py-10 z-1">
        <div className="w-48 h-48 rounded-2xl bg-linear-to-br from-blue-50 to-sky-100 flex items-center justify-center">
          <div className="w-20 h-20 rounded-xl bg-primary/20 flex items-center justify-center">
            <CircleDollarSign size={40} className="text-primary" />
          </div>
        </div>
      </div>

      {/* 상품 정보 카드 */}
      <div className="flex-1 mx-5 p-6 bg-white rounded-2xl shadow-card z-1">
        <ul className="flex flex-col gap-6">
          {/* 대상 */}
          <li className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
              <UserRoundSearch size={22} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-text-secondary mb-0.5">대상</p>
              <p className="text-base font-semibold text-text-primary">
                사업기간 1년 이상 개인사업자
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
                {formatMaxAmount(product.maxAmount)}
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

      {/* 대출 신청 버튼 */}
      <BottomButton
        label="대출 신청"
        onClick={() => navigate(`/loan/pre-apply/${product.id}`)}
      />
    </div>
  );
}
