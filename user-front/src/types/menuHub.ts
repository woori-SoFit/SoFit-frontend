/**
 * MenuHub 관련 타입 및 상수 정의
 */
import type { LucideIcon } from "lucide-react";
import { BarChart3, Wallet, Users, Trophy } from "lucide-react";

/** 메뉴 카테고리 식별자 */
export type MenuCategory =
  | "sales"
  | "profit"
  | "customer"
  | "industry";

/** 메뉴 카드 아이템 정의 */
export interface MenuItem {
  id: MenuCategory;
  title: string;
  description: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}

/** 상세 대시보드 쿼리 파라미터 */
export interface DashboardSearchParams {
  category: MenuCategory;
}

/** 메뉴 카드 목록 (하드코딩 상수) */
export const MENU_ITEMS: MenuItem[] = [
  {
    id: "sales",
    title: "이번 달 장사는 어땠나요?",
    description: "매출 흐름과 주요 변화를 한눈에 요약해드려요.",
    icon: BarChart3,
    iconBg: "bg-blue-50",
    iconColor: "text-primary",
  },
  {
    id: "profit",
    title: "실제로 얼마나 남았나요?",
    description: "수익과 현금 흐름을 정리해 핵심만 보여드려요.",
    icon: Wallet,
    iconBg: "bg-blue-50",
    iconColor: "text-primary",
  },
  {
    id: "customer",
    title: "손님들은 다시 찾아오고 있나요?",
    description: "재방문과 고객 반응이 어떤지 요약해드려요.",
    icon: Users,
    iconBg: "bg-blue-50",
    iconColor: "text-primary",
  },
  {
    id: "industry",
    title: "우리 가게는 다른 가게보다 잘하고 있나요?",
    description: "업종 안에서 우리 가게 위치를 쉽게 보여드려요.",
    icon: Trophy,
    iconBg: "bg-blue-50",
    iconColor: "text-primary",
  },
];
