/**
 * 홈 화면 2×2 메뉴 그리드 아이템 정의
 */
import iconLoanList from "@/assets/icons/menu-loan-list.svg";
import iconBizData from "@/assets/icons/menu-mybiz-data.svg";
import iconSReport from "@/assets/icons/menu-s-report.svg";
import iconCalculator from "@/assets/icons/menu-calculator.svg";

export interface MenuItem {
  id: string;
  label: string;
  to: string;
  icon: string;
}

export const HOME_MENU_ITEMS: MenuItem[] = [
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
