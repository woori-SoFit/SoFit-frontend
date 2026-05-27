/**
 * 마이 비즈 데이터 Mock 데이터
 *
 * TODO: API 연동 완료 후 이 파일 삭제
 */
import type { TermsItem } from "@/types/common";
import type { CollectStep } from "@/types/bizData";
import { Home, CreditCard, Landmark, MapPin, Star, FileText } from "lucide-react";

/** 마이 비즈 데이터 연결 상태 플래그 — TODO: API 연동 시 useQuery로 대체 */
export const MOCK_IS_CONNECTED: boolean = false;

/** 마이 비즈니스 데이터 약관 (필수 3개 + 선택 1개) */
export const MOCK_BIZ_DATA_TERMS: TermsItem[] = [
  {
    id: 301,
    title: "마이 비즈니스 데이터 수집 및 이용 동의",
    required: true,
    content:
      "1. 수집 항목\n사업자등록번호, 월별 매출액, 매입액, 부가세 신고 내역, 카드 매출 정보, 현금영수증 발행 내역\n\n2. 수집 목적\n소상공인 사업 현황 분석 및 성장S등급 산출을 위한 기초 데이터 수집\n\n3. 보유 기간\n서비스 이용 종료일로부터 5년간 보유 후 파기\n\n4. 제공받는 자\n우리은행 여신심사부, AI 분석 시스템\n\n5. 동의 거부 권리\n귀하는 본 동의를 거부할 권리가 있습니다. 다만, 동의를 거부하실 경우 마이 비즈니스 데이터 서비스 이용이 불가합니다.",
  },
  {
    id: 302,
    title: "개인정보 제3자 제공 동의",
    required: true,
    content:
      "1. 수집 항목\n성명, 사업자등록번호, 사업장 주소, 업종 정보, 매출 데이터, 신용 정보\n\n2. 수집 목적\n신용평가 및 대출 심사를 위한 제3자 정보 제공\n\n3. 보유 기간\n제공 목적 달성 시까지 또는 동의 철회 시까지\n\n4. 제공받는 자\n한국신용정보원, 나이스평가정보, 코리아크레딧뷰로\n\n5. 동의 거부 권리\n귀하는 본 동의를 거부할 권리가 있습니다. 다만, 동의를 거부하실 경우 성장S등급 산출 및 대출 서비스 이용이 제한될 수 있습니다.",
  },
  {
    id: 303,
    title: "개인정보 처리 위탁 동의",
    required: true,
    content:
      "1. 수집 항목\n사업자 매출 정보, 거래 내역, 업종 분류 데이터, 리뷰 및 평점 정보\n\n2. 수집 목적\n데이터 분석 처리 및 AI 기반 성장S등급 산출 업무 위탁\n\n3. 보유 기간\n위탁 계약 종료 시까지 또는 위탁 목적 달성 시까지\n\n4. 제공받는 자\n(주)소핏데이터랩 (데이터 분석), (주)클라우드시스템즈 (시스템 운영)\n\n5. 동의 거부 권리\n귀하는 본 동의를 거부할 권리가 있습니다. 다만, 동의를 거부하실 경우 마이 비즈니스 데이터 분석 서비스 이용이 불가합니다.",
  },
  {
    id: 304,
    title: "맞춤형 서비스 제공을 위한 정보 수신 동의",
    required: false,
    content:
      "1. 수집 항목\n사업 분석 결과, 업종 트렌드 정보, 매출 변동 알림 데이터\n\n2. 수집 목적\n맞춤형 금융 상품 안내, 사업 성장 팁 제공, 업종 동향 알림 발송\n\n3. 보유 기간\n동의 철회 시까지 또는 서비스 탈퇴 시까지\n\n4. 제공받는 자\n우리은행 마케팅부\n\n5. 동의 거부 권리\n귀하는 본 동의를 거부할 권리가 있으며, 거부하더라도 마이 비즈니스 데이터 서비스 이용에는 영향이 없습니다.",
  },
];

/**
 * 데이터 수집 단계 (6개)
 */
export const MOCK_BIZ_DATA_COLLECT_STEPS: CollectStep[] = [
  { label: "홈택스 연결 완료",       status: "done",    icon: Home,      activeBg: "bg-red-50",    activeColor: "text-red-500"   },
  { label: "카드 매출 수집 완료",     status: "done",    icon: CreditCard, activeBg: "bg-green-50",  activeColor: "text-green-600" },
  { label: "계좌 정보 분석 중",       status: "loading", icon: Landmark,  activeBg: "bg-blue-50",   activeColor: "text-blue-500"  },
  { label: "상권 정보 수집 중",       status: "pending", icon: MapPin,    activeBg: "bg-primary/10", activeColor: "text-primary"   },
  { label: "리뷰/평점 분석 중",       status: "pending", icon: Star,      activeBg: "bg-amber-50",  activeColor: "text-amber-500" },
  { label: "최종 분석 리포트 생성 중", status: "pending", icon: FileText,  activeBg: "bg-slate-100", activeColor: "text-slate-500" },
];
