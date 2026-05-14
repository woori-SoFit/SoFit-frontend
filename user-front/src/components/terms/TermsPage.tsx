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
import { useState } from "react";
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

  /** 필수 약관을 모두 동의했는지 확인 */
  const requiredTermIds = terms.filter((t) => t.required).map((t) => t.id);
  const allRequiredAgreed = requiredTermIds.every((id) => agreedIds.includes(id));

  const handleSubmit = () => {
    if (!allRequiredAgreed) return;
    onSubmit(agreedIds);
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
        onClose={() => setDetailTerm(null)}
        onAgree={(term) => {
          if (!agreedIds.includes(term.id)) {
            setAgreedIds((prev) => [...prev, term.id]);
          }
        }}
      />
    </div>
  );
}
