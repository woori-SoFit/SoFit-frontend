import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAvailableMonths } from "@/hooks/useAvailableMonths";
import { useMenuHubStore } from "@/stores/menuHubStore";
import { MENU_ITEMS } from "@/types/menuHub";
import { MenuCard } from "./MenuCard";
import { GrowthBanner } from "./GrowthBanner";
import menuHubIllust from "@/assets/icons/Mybiz-MenuHub.png";

/**
 * 마이 비즈 데이터 메뉴 선택 화면 루트 컴포넌트
 *
 * - 헤더: "사장님, 무엇이 궁금하세요?"
 * - MonthNavigation: 조회 월 선택
 * - MenuCard 5개: 카테고리별 상세 대시보드로 네비게이션
 * - GrowthBanner: 성장 S등급 리포트 이동
 */
export function MenuHub() {
  const navigate = useNavigate();
  const { availableMonths } = useAvailableMonths();
  const { selectedMonth, setSelectedMonth } = useMenuHubStore();

  // 초기 로드 시 가장 최신 월을 selectedMonth로 설정
  useEffect(() => {
    if (availableMonths.length > 0 && !selectedMonth) {
      setSelectedMonth(availableMonths[0]);
    }
  }, [availableMonths, selectedMonth, setSelectedMonth]);

  const handleCardPress = (categoryId: string) => {
    navigate(`/biz-data/dashboard?category=${categoryId}`);
  };

  return (
    <div className="flex flex-col px-5 py-5 gap-4">
      {/* 헤더 영역 */}
      <div className="flex flex-col items-center gap-1 mb-2">
        <h1 className="text-xl font-bold text-text-primary">
          사장님, 무엇이 궁금하세요?
        </h1>
        <p className="text-sm text-text-secondary">
          궁금한 항목을 선택하면 핵심 내용을 요약해드릴게요
        </p>
        <img
          src={menuHubIllust}
          alt="마이 비즈 데이터 일러스트"
          className="w-full max-w-[220px] mt-2"
        />
      </div>

      {/* 메뉴 카드 리스트 */}
      <div className="flex flex-col gap-3">
        {MENU_ITEMS.map((item) => (
          <MenuCard
            key={item.id}
            title={item.title}
            description={item.description}
            icon={item.icon}
            iconBg={item.iconBg}
            iconColor={item.iconColor}
            onPress={() => handleCardPress(item.id)}
          />
        ))}
      </div>

      {/* 성장 S등급 배너 */}
      <GrowthBanner />
    </div>
  );
}
