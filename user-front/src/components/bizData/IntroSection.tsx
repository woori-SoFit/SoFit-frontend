import { Link2, BarChart3, ShieldCheck } from "lucide-react";
import bizDataIllust from "@/assets/icons/menu-mybiz-data.svg";

const BENEFIT_ITEMS = [
  {
    icon: Link2,
    bg: "bg-blue-50",
    color: "text-blue-500",
    title: "다양한 데이터를 연결",
    description: "은행, 카드, 세무 등 흩어진 데이터를 한곳에 연결해 정확하게 관리할 수 있어요.",
  },
  {
    icon: BarChart3,
    bg: "bg-green-50",
    color: "text-green-600",
    title: "사업을 더 깊이 분석",
    description: "연결된 데이터를 기반으로 매출, 지출, 수익성 등 사업 상태를 한눈에 파악할 수 있어요.",
  },
  {
    icon: ShieldCheck,
    bg: "bg-purple-50",
    color: "text-purple-500",
    title: "금융 활용 기회 확대",
    description: "신뢰할 수 있는 데이터로 금융 서비스 심사와 한도 신청에 유리하게 활용할 수 있어요.",
  },
] as const;

export function IntroSection() {
  return (
    <section className="px-5 pt-6 pb-28">
      {/* 타이틀 */}
      <h1 className="text-2xl font-bold text-text-primary leading-tight mb-2">
        내 사업의 모든 데이터를<br />한눈에 관리하세요
      </h1>
      <p className="text-sm text-text-secondary mb-8">
        흩어진 정보를 연결하면 사업 분석과 금융 활용이 수월합니다.
      </p>

      {/* 일러스트레이션 */}
      <div className="flex items-center justify-center mb-10">
        <img
          src={bizDataIllust}
          alt="마이 비즈 데이터 일러스트"
          className="w-full max-w-xs"
        />
      </div>

      {/* 혜택 항목 목록 (borderless) */}
      <div className="flex flex-col gap-6">
        {BENEFIT_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center shrink-0`}>
                <Icon size={22} className={item.color} />
              </div>
              <div className="flex-1 pt-1">
                <h3 className="text-base font-bold text-text-primary mb-1">{item.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
