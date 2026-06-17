/**
 * 홈 페이지
 * Layout: MainLayout
 *
 * 구성:
 *   1. 히어로 섹션 (타이틀 + 서브타이틀) — 중앙 정렬
 *   2. 상품 카드 가로 슬라이더 (부채꼴 carousel)
 *   3. 대출진행관리 배너
 *   4. 2×2 메뉴 그리드
 */
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { ProductCardSlider } from "@/components/home/ProductCardSlider";
import type { ProductCard } from "@/components/home/ProductCardSlider";
import { DraftResumeCard } from "@/components/home/DraftResumeCard";
import { fetchLoanProducts, fetchLoanDrafts } from "@/api/loanApi";
import { useMe } from "@/hooks/useMe";
import type { LoanProductListItem } from "@/types/loan";
import { HOME_MENU_ITEMS } from "@/constants/homeMenuItems";
import { FALLBACK_CARDS } from "@/constants/fallbackProducts";
import { formatAmount } from "@/utils/format";
import mainLogo from "@/assets/mainLogo.svg";

import icon1 from "@/assets/icons/menu1.svg";

// ── 상품 카드 색상 팔레트 (productId 기준 순환) ──────────────────────────
const CARD_PALETTE = [
  "#0EA5E9",
  "#2563EB",
  "#4F46E5",
  "#0EA5E9",
  "#2563EB",
];

/** LoanProductListItem → ProductCard 변환 */
function toProductCard(product: LoanProductListItem, index: number): ProductCard {
  const bg = CARD_PALETTE[index % CARD_PALETTE.length];
  return {
    id: product.productId,
    productId: product.productId,
    bg,
    tag: "한도",
    rate: formatAmount(product.maxLimit),
    desc: product.title,
    title: product.productName,
    subtitle: product.title,
    minRate: product.minRate,
  };
}

/**
 * 슬라이더가 양쪽에 카드를 자연스럽게 보여주려면 최소 minCount개가 필요하다.
 * 데이터가 적을 때 전체를 반복 복사해서 채우고,
 * 복사본은 id에 round * 1000 offset을 더해 React key 충돌을 방지한다.
 */
function repeatCards(cards: ProductCard[], minCount = 6): ProductCard[] {
  if (cards.length === 0) return cards;
  const result: ProductCard[] = [...cards];
  let round = 1;
  while (result.length < minCount) {
    cards.forEach((card) => {
      result.push({ ...card, id: card.id + round * 1000 });
    });
    round += 1;
  }
  return result;
}

// ── 메뉴 그리드 아이템 → @/constants/homeMenuItems.ts 로 분리 ──

export default function HomePage() {
  const { me, isLoggedIn } = useMe();
  const userName = me?.name ?? "";
  const navigate = useNavigate();

  // 대출 상품 목록 조회
  const { data: loanProducts = [] } = useQuery({
    queryKey: ["loanProducts"],
    queryFn: fetchLoanProducts,
  });

  // 임시저장 대출 목록 조회 (로그인 시에만, 매 진입 시 새로 조회)
  const { data: drafts = [] } = useQuery({
    queryKey: ["loanDrafts"],
    queryFn: fetchLoanDrafts,
    enabled: isLoggedIn,
    staleTime: 0,
    refetchOnMount: "always",
  });

  // API 데이터 → ProductCard 변환, 응답 전에는 fallback 사용
  const baseCards = loanProducts.length > 0
    ? loanProducts.map((product, i) => toProductCard(product, i))
    : FALLBACK_CARDS;
  const productCards = repeatCards(baseCards, 6);
  const originalCount = loanProducts.length > 0 ? loanProducts.length : FALLBACK_CARDS.length;

  return (
    <div className="pb-8">
      {/* ── 히어로 섹션 ── */}
      <section className="px-5 pt-2 pb-4 text-center">
        <h1 className="text-[21px] font-bold leading-snug text-[--color-text-primary]">
          <span className="text-primary">{userName}{" "}</span>
          사장님의 성장을 <br />
          <img src={mainLogo} alt="SoFit" className="inline h-7 mb-1.5" />이 함께할게요
        </h1>

        <p className="text-sm text-gray-600">
          개인사업자를 위한 특별한 상품을 만나보세요
        </p>
      </section>

      {/* ── 상품 카드 슬라이더 ── */}
      <ProductCardSlider
        cards={productCards}
        originalCount={originalCount}
        onCardClick={(productId) => navigate(`/loan/${productId}`)}
      />

      {/* ── 대출 신청 이어하기 카드 ── */}
      <DraftResumeCard drafts={drafts} />

      {/* ── 대출진행관리 배너 ── */}
      <section className="px-5 mt-2">
        <button
          type="button"
          onClick={() => {
            if (!isLoggedIn) {
              navigate(`/login?returnUrl=${encodeURIComponent("/loan-applications")}`, { replace: true });
            } else {
              navigate("/loan-applications");
            }
          }}
          className="flex items-center justify-between w-full bg-white rounded-2xl px-5 py-4 shadow-[--shadow-card] border border-border-default active:scale-[0.98] transition-transform text-left"
        >
          <div>
            <p className="text-base font-bold text-[--color-text-primary]">
              나의 대출 현황
            </p>
            <p className="mt-0.5 text-sm text-[--color-text-secondary]">
              심사중인 대출 바로 확인하기
            </p>
          </div>
          <img src={icon1} alt="" aria-hidden="true" className="w-12 h-12 object-contain" />
        </button>
      </section>

      {/* ── 2×2 메뉴 그리드 ── */}
      <section className="px-5 mt-2">
        <div className="grid grid-cols-2 gap-2">
          {HOME_MENU_ITEMS.map((item) => {
            // 로그인 필요한 메뉴
            const requiresAuth = item.id === "loan-management";
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (requiresAuth && !isLoggedIn) {
                    navigate(`/login?returnUrl=${encodeURIComponent(item.to)}`, { replace: true });
                  } else {
                    navigate(item.to);
                  }
                }}
                className="flex items-center justify-between bg-white rounded-2xl px-3 py-4 shadow-[--shadow-card] border border-border-default active:scale-[0.97] transition-transform text-left"
              >
                <div className="flex items-center gap-2">
                  <img src={item.icon} alt="" aria-hidden="true" className="w-6.5 h-6.5 object-contain" width={26} height={26} />
                  <span className="text-[15px] font-semibold text-text-primary">
                    {item.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
