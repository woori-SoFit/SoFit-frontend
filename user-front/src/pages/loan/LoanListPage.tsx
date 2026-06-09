/**
 * 대출 상품 목록 페이지
 * Route: /loan
 * Layout: StepLayout
 */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useLayoutStore } from "@/stores/layoutStore";
import { LOAN_KEYS } from "@/constants/queryKeys";
import { fetchLoanProducts } from "@/api/loanApi";
import { formatMaxAmount } from "@/utils/format";
import { CharacterLoadingSpinner } from "@/components/common/CharacterLoadingSpinner";

export default function LoanListPage() {
  const navigate = useNavigate();

  const { data: products = [], isLoading } = useQuery({
    queryKey: LOAN_KEYS.list(),
    queryFn: fetchLoanProducts,
  });

  useEffect(() => {
    useLayoutStore.getState().setStepTitle("대출 상품");
  }, []);

  if (isLoading) {
    return <CharacterLoadingSpinner text="상품 목록을 불러오는 중..." />;
  }

  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-text-secondary">등록된 대출 상품이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="px-5 pb-8">
      {/* 상품 카드 목록 */}
      <ul className="flex flex-col gap-3 pt-2">
        {products.map((product) => (
          <li key={product.productId}>
            <button
              type="button"
              onClick={() => navigate(`/loan/${product.productId}`)}
              className="w-full text-left p-5 rounded-xl bg-white border border-border-default hover:border-primary transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  {/* 상품명 */}
                  <p className="text-sm text-text-secondary mb-1">
                    {product.title}
                  </p>
                  {/* 소개 문구 */}
                  <h3 className="text-md font-semibold text-text-primary">
                    {product.productName}
                  </h3>
                </div>
                {/* 한도 정보 */}
                <p className="text-base text-text-secondary">
                  <span className="font-bold text-primary">{formatMaxAmount(product.maxLimit)}</span>
                </p>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
