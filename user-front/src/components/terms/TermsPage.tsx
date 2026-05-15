/**
 * 약관 동의 페이지 레벨 래퍼 컴포넌트
 *
 * TermsAgreement + TermsDetailSheet + 다음 버튼을 하나의 페이지 단위로 묶음
 *
 * 사용처:
 * - 대출 신청 약관 동의 step (TERMS)
 * - 마이데이터 약관 동의 step (MYDATA_TERMS)
 * - 대출 약정 약관 동의
 */
import { useState, useRef } from "react";
import type { TermsItem } from "@/types/common";
import { TermsAgreement } from "./TermsAgreement";
import { TermsDetailSheet } from "./TermsDetailSheet";
import { BottomButton } from "@/components/common/BottomButton";

interface TermsPageProps {
  /** 페이지 상단 타이틀 */
  title: string;
  /** 페이지 상단 설명 (선택) */
  description?: string;
  /** 표시할 약관 목록 */
  terms: TermsItem[];
  /** 다음 버튼 레이블 (기본값: "다음") */
  submitLabel?: string;
  /** 필수 약관 전체 동의 후 다음 버튼 클릭 시 호출 */
  onSubmit: (agreedIds: number[]) => void;
}

export function TermsPage({
  title,
  description,
  terms,
  submitLabel = "다음",
  onSubmit,
}: TermsPageProps) {
  const [agreedIds, setAgreedIds] = useState<number[]>([]);
  const [detailTerm, setDetailTerm] = useState<TermsItem | null>(null);

  /** 전체 동의 모드: 순차적으로 시트를 보여줄 약관 큐 */
  const allAgreeQueueRef = useRef<TermsItem[]>([]);

  /** 필수 약관을 모두 동의했는지 확인 */
  const requiredTermIds = terms.filter((t) => t.required).map((t) => t.id);
  const allRequiredAgreed = requiredTermIds.every((id) => agreedIds.includes(id));

  const handleSubmit = () => {
    if (!allRequiredAgreed) return;
    onSubmit(agreedIds);
  };

  /** 전체 동의 클릭 → 미동의 약관을 순차적으로 시트에 표시 */
  const handleAllAgree = () => {
    const unagreed = terms.filter((t) => !agreedIds.includes(t.id));
    if (unagreed.length === 0) return;

    // 큐에 미동의 약관 저장 후 첫 번째 시트 열기
    allAgreeQueueRef.current = unagreed.slice(1);
    setDetailTerm(unagreed[0]);
  };

  /** 시트에서 동의 클릭 시 */
  const handleSheetAgree = (term: TermsItem) => {
    if (!agreedIds.includes(term.id)) {
      setAgreedIds((prev) => [...prev, term.id]);
    }

    // 전체 동의 큐에 다음 항목이 있으면 이어서 표시
    const queue = allAgreeQueueRef.current;
    if (queue.length > 0) {
      const next = queue[0];
      allAgreeQueueRef.current = queue.slice(1);
      // 약간의 딜레이로 시트 전환 자연스럽게
      setTimeout(() => setDetailTerm(next), 200);
    } else {
      // 큐 비었으면 시트 닫기
      setDetailTerm(null);
    }
  };

  /** 시트 닫기 (전체 동의 큐도 초기화) */
  const handleSheetClose = () => {
    setDetailTerm(null);
    allAgreeQueueRef.current = [];
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* 본문 */}
      <div className="flex-1 px-5 pt-10 pb-4">
        {/* 타이틀 */}
        <h1 className="text-xl font-bold text-text-primary mb-2">
          {title}
        </h1>

        {/* 설명 */}
        {description && (
          <p className="text-sm text-text-secondary mb-6">
            {description}
          </p>
        )}

        {/* 약관 동의 컴포넌트 */}
        <TermsAgreement
          terms={terms}
          agreedIds={agreedIds}
          onChange={setAgreedIds}
          onViewDetail={setDetailTerm}
          onAllAgree={handleAllAgree}
        />
      </div>

      {/* 하단 고정 버튼 */}
      <BottomButton
        label={submitLabel}
        onClick={handleSubmit}
        disabled={!allRequiredAgreed}
      />

      {/* 약관 상세 시트 */}
      <TermsDetailSheet
        term={detailTerm}
        isOpen={detailTerm !== null}
        isAgreed={detailTerm !== null && agreedIds.includes(detailTerm.id)}
        onClose={handleSheetClose}
        onAgree={handleSheetAgree}
      />
    </div>
  );
}
