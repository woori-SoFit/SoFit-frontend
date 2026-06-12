/**
 * 약관 동의 페이지 레벨 래퍼 컴포넌트
 *
 * TermsAgreement + TermsDetailSheet + 다음 버튼을 하나의 페이지 단위로 묶음
 *
 * 사용처:
 * - 대출 신청 약관 동의 step (LOAN_APPLICATION)
 * - 마이데이터 약관 동의 step (MYDATA)
 * - 마이 비즈 데이터 약관 동의 (MYBIZDATA)
 * - 대출 약정 약관 동의 (LOAN_AGREEMENT)
 * - 회원가입 약관 동의 (PERSONAL_INFO)
 *
 * termType을 전달하면 API에서 약관 목록을 자동 조회합니다.
 * terms를 직접 전달하면 기존처럼 정적 데이터를 사용합니다.
 */
import { useState, useRef, lazy, Suspense } from "react";
import type { TermsItem, TermType } from "@/types/common";
import { TermsAgreement } from "./TermsAgreement";
import { BottomButton } from "@/components/common/BottomButton";
import { EmptyError } from "@/components/common/EmptyError";
import { CharacterLoadingSpinner } from "@/components/common/CharacterLoadingSpinner";
import { useTerms } from "@/hooks/useTerms";

// react-pdf(~944KB)를 메인 번들에서 분리하기 위해 지연 로딩
const TermsDetailSheet = lazy(() =>
  import("./TermsDetailSheet").then((m) => ({ default: m.TermsDetailSheet }))
);

interface TermsPageBaseProps {
  /** 페이지 상단 타이틀 */
  title: string;
  /** 페이지 상단 설명 (선택) */
  description?: string;
  /** 다음 버튼 레이블 (기본값: "다음") */
  submitLabel?: string;
  /** 필수 약관 전체 동의 후 다음 버튼 클릭 시 호출 */
  onSubmit: (agreedIds: number[]) => void;
}

interface TermsPageWithType extends TermsPageBaseProps {
  /** API에서 조회할 약관 유형 */
  termType: TermType;
  terms?: never;
}

interface TermsPageWithTerms extends TermsPageBaseProps {
  /** 직접 전달하는 약관 목록 (기존 호환) */
  terms: TermsItem[];
  termType?: never;
}

type TermsPageProps = TermsPageWithType | TermsPageWithTerms;

export function TermsPage({
  title,
  description,
  terms: staticTerms,
  termType,
  submitLabel = "다음",
  onSubmit,
}: TermsPageProps) {
  const { terms: apiTerms, isLoading, isError } = useTerms(
    termType ?? ("PERSONAL_INFO" as TermType)
  );

  // termType이 있으면 API 데이터 사용, 없으면 정적 데이터 사용
  const terms = termType ? apiTerms : (staticTerms ?? []);

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

    const queue = allAgreeQueueRef.current;
    if (queue.length > 0) {
      // 큐에 다음 항목이 있으면 — 시트 닫힘 애니메이션(300ms) 후 다음 시트 열기
      const next = queue[0];
      allAgreeQueueRef.current = queue.slice(1);
      setDetailTerm(null); // 현재 시트 닫기 (큐는 건드리지 않음)
      setTimeout(() => setDetailTerm(next), 350);
    } else {
      // 큐가 비었으면 그냥 닫기
      setDetailTerm(null);
      allAgreeQueueRef.current = [];
    }
  };

  /** X 버튼 / 딤 클릭으로 닫기 — 큐도 함께 초기화 */
  const handleSheetClose = () => {
    setDetailTerm(null);
    allAgreeQueueRef.current = [];
  };

  // termType 모드에서 로딩/에러 처리
  if (termType && isLoading) {
    return <CharacterLoadingSpinner text="약관을 불러오는 중..." />;
  }

  if (termType && isError) {
    return <EmptyError message="약관을 불러오지 못했습니다." />;
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* 본문 */}
      <div className="flex-1 px-5 pt-7 pb-4">
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
      {detailTerm !== null && (
        <Suspense fallback={null}>
          <TermsDetailSheet
            term={detailTerm}
            isOpen={detailTerm !== null}
            onClose={handleSheetClose}
            onAgree={handleSheetAgree}
          />
        </Suspense>
      )}
    </div>
  );
}
