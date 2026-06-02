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
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

import { ProductCardSlider } from "@/components/home/ProductCardSlider";
import { MOCK_PRODUCT_CARDS } from "@/mocks/productCards";
import { useMe } from "@/hooks/useMe";

import iconLoanHistory from "@/assets/icons/menu-loan-history.svg";
import iconLoanList from "@/assets/icons/menu-loan-list.svg";
import iconBizData from "@/assets/icons/menu-mybiz-data.svg";
import iconSReport from "@/assets/icons/menu-s-report.svg";
import iconCalculator from "@/assets/icons/menu-calculator.svg";

// ── 메뉴 그리드 아이템 ──────────────────────────────────────────
const MENU_ITEMS = [
  {
    id: "loan-list",
    label: "대출 상품",
    to: "/loan",
    icon: iconLoanList,
  },
  {
    id: "biz-data",
    label: "마이 비즈 데이터",
    to: "/biz-data",
    icon: iconBizData,
  },
  {
    id: "grade-report",
    label: "S 분석 리포트",
    to: "/grade-report",
    icon: iconSReport,
  },
  {
    id: "calculator",
    label: "사전 계산기",
    to: "/calculate",
    icon: iconCalculator,
  },
];

export default function HomePage() {
  const { me } = useMe();
  const userName = me?.name ?? "";

  return (
    <div className="pb-8">
      {/* ── 히어로 섹션 ── */}
      <section className="px-5 pt-2 pb-4 text-center">
        <h1 className="text-[21px] font-bold leading-snug text-[--color-text-primary]">
          <span className="text-primary">{userName}{" "}</span>
          사장님의 성장을 <br />
          <span className="text-primary">SoFit</span>이 함께할게요
        </h1>

        <p className="mt-1 text-sm text-[--color-text-secondary]">
          개인사업자를 위한 특별한 상품을 만나보세요
        </p>
      </section>

      {/* ── 상품 카드 슬라이더 ── */}
      <ProductCardSlider cards={MOCK_PRODUCT_CARDS} />

      {/* ── 대출진행관리 배너 ── */}
      <section className="px-5 mt-2">
        <Link
          to="/loan-applications"
          className="flex items-center justify-between w-full bg-white rounded-2xl px-5 py-4 shadow-[--shadow-card] border border-border-default active:scale-[0.98] transition-transform"
        >
          <div>
            <p className="text-base font-bold text-[--color-text-primary]">
              나의 대출 현황
            </p>
            <p className="mt-0.5 text-sm text-[--color-text-secondary]">
              신청중인 대출 바로 확인하기
            </p>
          </div>
          <img src={iconLoanHistory} alt="" aria-hidden="true" className="w-14 h-14 object-contain" />
        </Link>
      </section>

      {/* ── 2×2 메뉴 그리드 ── */}
      <section className="px-5 mt-2">
        <div className="grid grid-cols-2 gap-2">
          {MENU_ITEMS.map((item) => (
            <Link
              key={item.id}
              to={item.to}
              className="flex items-center justify-between bg-white rounded-2xl px-2 py-4 shadow-[--shadow-card] border border-border-default active:scale-[0.97] transition-transform"
            >
              <div className="flex items-center gap-1">
                <img src={item.icon} alt="" aria-hidden="true" className="w-9 h-9 object-contain" />
                <span className="text-sm font-medium text-text-primary">
                  {item.label}
                </span>
              </div>
              <ChevronRight size={16} className="text-gray-400 flex-none" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
