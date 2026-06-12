/**
 * API 응답 전 슬라이더에 표시할 정적 fallback 상품 카드.
 * LCP 요소가 초기 렌더 시점에 DOM에 존재하도록 보장한다.
 */
import type { ProductCard } from "@/components/home/ProductCardSlider";

export const FALLBACK_CARDS: ProductCard[] = [
  {
    id: 1, productId: 1, bg: "#0EA5E9",
    tag: "한도", rate: "1억원", desc: "사장님을 위한 든든한 대출",
    title: "우리 사장님 대출", subtitle: "사장님을 위한 든든한 대출", minRate: 5.46,
  },
  {
    id: 2, productId: 2, bg: "#2563EB",
    tag: "한도", rate: "3,000만원", desc: "빠르고 간편한 사업자 대출",
    title: "우리 Oh!(5) 클릭 대출", subtitle: "빠르고 간편한 사업자 대출", minRate: 5.74,
  },
  {
    id: 3, productId: 3, bg: "#4F46E5",
    tag: "한도", rate: "1억원", desc: "매출 있는 사장님을 위한 대출",
    title: "우리카드 가맹점 우대 대출", subtitle: "매출 있는 사장님을 위한 대출", minRate: 4.58,
  },
];
