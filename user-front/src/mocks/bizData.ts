/**
 * 마이 비즈 데이터 Mock 데이터
 *
 * TODO: API 연동 완료 후 이 파일 삭제
 */
import type { CollectStep } from "@/types/bizData";
import { Home, CreditCard, Landmark, MapPin, Star } from "lucide-react";

/** 마이 비즈 데이터 연결 상태 플래그 — TODO: API 연동 시 useQuery로 대체 */
export const MOCK_IS_CONNECTED: boolean = false;

/**
 * 데이터 수집 단계 (6개)
 */
export const MOCK_BIZ_DATA_COLLECT_STEPS: CollectStep[] = [
  { label: "홈택스 연결",       status: "done",    icon: Home,      activeBg: "bg-red-50",    activeColor: "text-red-500"   },
  { label: "카드 매출 수집",     status: "done",    icon: CreditCard, activeBg: "bg-green-50",  activeColor: "text-green-600" },
  { label: "계좌 정보 분석",       status: "loading", icon: Landmark,  activeBg: "bg-blue-50",   activeColor: "text-blue-500"  },
  { label: "상권 정보 수집",       status: "pending", icon: MapPin,    activeBg: "bg-primary/10", activeColor: "text-primary"   },
  { label: "리뷰/평점 분석",       status: "pending", icon: Star,      activeBg: "bg-amber-50",  activeColor: "text-amber-500" },
];
