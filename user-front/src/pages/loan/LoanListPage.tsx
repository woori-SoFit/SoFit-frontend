/**
 * 대출 상품 목록 페이지
 * Route: /loan
 * Layout: MainLayout
 *
 * TODO: API 연동 시 MOCK_PRODUCTS 제거 후 useQuery로 교체
 */
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { useLayoutStore } from "@/stores/layoutStore";
import { MOCK_LOAN_PRODUCTS } from "@/mocks/loanProducts";

/** 금액 포맷 (만원 단위) */
function formatAmount(amount: number) {
  const man = amount / 10_000;
  if (man >= 10_000) return `${(man / 10_000).toFixed(0)}억`;
  return `${man.toLocaleString()}만`;
}

export default function LoanListPage() {
  const navigate = useNavigate();

  // TODO: API 연동 시 아래로 교체
  // const { data: products, isLoading } = useQuery({
  //   queryKey: LOAN_KEYS.list(),
  //   queryFn: fetchLoanProducts,
  // });
  const products = MOCK_LOAN_PRODUCTS;

  useEffect(() => {
    useLayoutStore.getState().setStepTitle("대출 상품");
  }, []);

  return (
    <div className="px-5 pb-8">
      {/* 상품 카드 목록 */}
      <ul className="flex flex-col gap-3">
        {products.map((product) => (
          <li key={product.id}>
            <button
              type="button"
              onClick={() => navigate(`/loan/${product.id}`)}
              className="w-full text-left p-5 rounded-xl bg-white border border-border-default hover:border-primary transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  {/* 상품명 */}
                  <p className="text-sm text-text-secondary mb-1">
                    {product.name}
                  </p>
                  {/* 소개 문구 */}
                  <h3 className="text-base font-semibold text-text-primary mb-3">
                    {product.title}
                  </h3>
                  {/* 금리/한도 정보 */}
                  <div className="flex items-center gap-3 text-sm text-text-secondary">
                    <span>
                      금리 <span className="font-medium text-text-primary">{product.minRate}~{product.maxRate}%</span>
                    </span>
                    <span className="text-border-default">|</span>
                    <span>
                      한도 <span className="font-medium text-text-primary">{formatAmount(product.maxAmount)}</span>
                    </span>
                  </div>
                </div>
                <ChevronRight size={20} className="text-gray-400 ml-2 shrink-0" />
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
