import { Link2, BarChart3, ShieldCheck } from "lucide-react";
import bizDataIllust from "@/assets/icons/myBizData.svg";

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
    <section className="px-5 pt-6 flex flex-col flex-1">
      {/* 타이틀 */}
      <h1 className="text-2xl font-bold text-text-primary leading-tight mb-3 text-center">
        내 사업의 모든 데이터를<br />한눈에 관리하세요
      </h1>
      <p className="text-sm text-text-secondary mb-0 text-center">
        흩어진 정보를 연결하면 사업 분석과 금융 활용이 수월합니다.
      </p>

      {/* 일러스트레이션 — 남은 공간을 채움 */}
      <div className="flex-1 flex items-center justify-center">
        <img
          src={bizDataIllust}
          alt="마이 비즈 데이터 일러스트"
          className="w-full max-w-[280px] py-10"
        />
      </div>

      {/* 혜택 항목 목록 */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm divide-y divide-gray-100 mb-4">
        {BENEFIT_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="flex items-center gap-3 px-4 py-3">
              <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
                <Icon size={18} className={item.color} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-text-primary mb-0.5">{item.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
