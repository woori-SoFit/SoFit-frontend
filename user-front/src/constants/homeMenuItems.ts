/**
 * 홈 화면 2×2 메뉴 그리드 아이템 정의
 */
import icon2 from "@/assets/icons/menu2.svg";
import icon3 from "@/assets/icons/menu3.svg";
import icon4 from "@/assets/icons/menu4.svg";
import icon5 from "@/assets/icons/menu5.svg";

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
    icon: icon2,
  },
  {
    id: "calculator",
    label: "대출 관리",
    to: "/calculate",
    icon: icon5,
  },
  {
    id: "biz-data",
    label: "마이 비즈 데이터",
    to: "/biz-data",
    icon: icon3,
  },
  {
    id: "grade-report",
    label: "S 분석 리포트",
    to: "/grade-report",
    icon: icon4,
  },
];
