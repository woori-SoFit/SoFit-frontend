/**
 * MenuHub 관련 타입 및 상수 정의
 */
import type { LucideIcon } from "lucide-react";
import { BarChart3, Wallet, Users, Trophy, ClipboardCheck } from "lucide-react";

/** 메뉴 카테고리 식별자 */
export type MenuCategory =
  | "sales"
  | "profit"
  | "customer"
  | "industry"
  | "loan-check";

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
    iconColor: "text-blue-500",
  },
  {
    id: "profit",
    title: "실제로 얼마나 남았나요?",
    description: "수익과 현금 흐름을 정리해 핵심만 보여드려요.",
    icon: Wallet,
    iconBg: "bg-green-50",
    iconColor: "text-green-500",
  },
  {
    id: "customer",
    title: "손님들은 다시 찾아오고 있나요?",
    description: "재방문과 고객 반응이 어떤지 요약해드려요.",
    icon: Users,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-500",
  },
  {
    id: "industry",
    title: "우리 가게는 다른 가게보다 잘하고 있나요?",
    description: "업종 안에서 우리 가게 위치를 쉽게 보여드려요.",
    icon: Trophy,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
  },
  {
    id: "loan-check",
    title: "지금 챙기면 좋을 것들",
    description: "대출 심사 전에 살펴보면 좋은 항목을 정리해드려요.",
    icon: ClipboardCheck,
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-500",
  },
];
