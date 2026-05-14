/**
 * 대출 상품 목록 페이지
 * Route: /loan
 * Layout: MainLayout
 *
 * TODO: API 연동 시 MOCK_PRODUCTS 제거 후 useQuery로 교체
 */
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import type { LoanProduct } from "@/types/loan";
import { useEffect } from "react";
import { useLayoutStore } from "@/stores/layoutStore";

/** 임시 Mock 데이터 */
const MOCK_PRODUCTS: LoanProduct[] = [
  {
    id: 1,
    name: "우리 사장님 대출",
    title: "우리 사장님 곁을 든든하게!",
    minAmount: 5_000_000,
    maxAmount: 100_000_000,
    minRate: 4.5,
    maxRate: 8.9,
    minTerm: 12,
    maxTerm: 60,
    description: "소상공인 맞춤 신용대출",
  },
  {
    id: 2,
    name: "성장 사다리 대출",
    title: "성장하는 사업에 날개를 달아드려요",
    minAmount: 10_000_000,
    maxAmount: 200_000_000,
    minRate: 3.9,
    maxRate: 7.5,
    minTerm: 12,
    maxTerm: 84,
    description: "성장S등급 우대 대출",
  },
  {
    id: 3,
    name: "긴급 운영자금 대출",
    title: "급할 때 빠르게, 운영자금 지원",
    minAmount: 1_000_000,
    maxAmount: 50_000_000,
    minRate: 5.0,
    maxRate: 9.9,
    minTerm: 6,
    maxTerm: 36,
    description: "빠른 심사 소액 대출",
  },
];

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
  const products = MOCK_PRODUCTS;

  useEffect(() => {
    useLayoutStore.getState().setStepTitle("대출 상품");
  }, []);

  return (
    <div className="px-5 pt-6 pb-8">
      {/* 상품 카드 목록 */}
      <ul className="flex flex-col gap-4">
        {products.map((product) => (
          <li key={product.id}>
            <button
              type="button"
              onClick={() => navigate(`/loan/${product.id}`)}
              className="w-full text-left p-5 rounded-xl bg-white border border-border-default hover:border-primary transition-colors shadow-card"
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
