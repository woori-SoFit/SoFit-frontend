/**
 * 대출 관리 페이지
 * Route: /loan-management
 * Layout: StepLayout
 *
 * 실행 완료된 대출 정보를 카드 형태로 표시
 * - 상품명, 실행일, 실행 금액, 적용 금리, 다음 상환일, 매월 납부 금액
 */
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLayoutStore } from "@/stores/layoutStore";
import { fetchLoanManagementList } from "@/api/loanApi";
import { LOAN_KEYS } from "@/constants/queryKeys";
import { CharacterLoadingSpinner } from "@/components/common/CharacterLoadingSpinner";
import { LoanManagementCard } from "@/components/loan/LoanManagementCard";
import type { LoanManagementItem } from "@/types/loan";
import checkIcon from "@/assets/icons/menu5.svg";
import nonewibee1 from "@/assets/icons/None-BizData.svg";

export default function LoanManagementPage() {
  useEffect(() => {
    useLayoutStore.getState().setStepTitle("실행 대출 관리");
  }, []);

  const { data: executions = [], isLoading } = useQuery({
    queryKey: LOAN_KEYS.management(),
    queryFn: fetchLoanManagementList,
    staleTime: 30_000,
  });

  if (isLoading) {
    return <CharacterLoadingSpinner text="대출 정보를 불러오는 중..." />;
  }

  return (
    <div className="flex flex-col gap-4 pb-8" data-testid="loan-management-page">
      {/* 상단 안내 영역 */}
      <section className="bg-white mx-5 px-3 py-1 rounded-xl flex items-center gap-1">
        <div className="w-14 h-14 flex items-center justify-center">
          <img src={checkIcon} alt="" aria-hidden="true" className="w-10 h-10" />
        </div>
        <div className="flex flex-col gap-1 text-text-secondary text-sm font-semibold">
          <p>실행 완료된 대출 정보를 확인하고 관리해보세요.</p>
        </div>
      </section>

      {/* 내 대출 목록 헤더 */}
      <section className="px-6 pt-1">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-text-primary">내 대출 목록</h2>
          <span className="text-sm font-semibold text-primary">
            {executions.length}개 실행 중
          </span>
        </div>
      </section>

      {/* 대출 카드 목록 */}
      <section className="px-5 flex flex-col gap-4">
        {executions.length === 0 ? (
          <div className="fixed inset-0 flex flex-col items-center justify-center gap-2 pointer-events-none">
            <img
              src={nonewibee1}
              alt=""
              aria-hidden="true"
              className="w-40 object-contain opacity-60"
            />
            <p className="text-text-secondary text-sm">실행 중인 대출이 없습니다.</p>
          </div>
        ) : (
          executions.map((item: LoanManagementItem) => (
            <LoanManagementCard key={item.executionId} item={item} />
          ))
        )}
      </section>
    </div>
  );
}
