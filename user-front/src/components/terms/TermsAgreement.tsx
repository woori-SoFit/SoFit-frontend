/**
 * 약관 동의 공통 컴포넌트
 *
 * 사용처:
 * - 대출 신청 약관 동의
 * - My Biz Data 약관 동의
 * - 회원가입 약관 동의
 */
import type { TermsItem } from "@/types/common";
import { ChevronRight, Circle, CircleCheckBig } from "lucide-react";

interface TermsAgreementProps {
  terms: TermsItem[];
  agreedIds: number[];
  onChange: (agreedIds: number[]) => void;
  onViewDetail: (term: TermsItem) => void;
}

export function TermsAgreement({
  terms,
  agreedIds,
  onChange,
  onViewDetail,
}: TermsAgreementProps) {
  const allChecked = terms.length > 0 && terms.every((t) => agreedIds.includes(t.id));

  /** 전체 동의 토글 */
  const handleAllChange = () => {
    if (allChecked) {
      onChange([]);
    } else {
      onChange(terms.map((t) => t.id));
    }
  };

  /** 개별 약관 토글 */
  const handleItemChange = (id: number) => {
    if (agreedIds.includes(id)) {
      onChange(agreedIds.filter((v) => v !== id));
    } else {
      onChange([...agreedIds, id]);
    }
  };

  return (
    <div data-testid="terms-agreement" className="flex flex-col gap-3 px-5 py-6 border border-border-default rounded-lg">
      {/* 전체 동의 */}
      <label
        className="flex items-center gap-3 rounded-xl cursor-pointer"
        onClick={handleAllChange}
      >
        <Checkbox checked={allChecked} />
        <span className="text-base font-semibold text-text-primary">
          전체 동의
        </span>
      </label>

      {/* 구분선 */}
      <div className="h-px bg-border-default" />

      {/* 개별 약관 목록 */}
      <ul className="flex flex-col">
        {terms.map((term) => {
          const isAgreed = agreedIds.includes(term.id);
          return (
            <li key={term.id}>
              <label
                className="flex items-center gap-3 py-3 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  if (isAgreed) {
                    // 이미 동의한 항목: 시트 없이 바로 취소
                    handleItemChange(term.id);
                  } else {
                    // 미동의 항목: 약관 열람 후 동의
                    onViewDetail(term);
                  }
                }}
              >
                <Checkbox checked={isAgreed} />
                <span className="flex-1 text-sm text-text-primary">
                  <span className="text-text-primary mr-1">
                    {term.required ? "(필수)" : "(선택)"}
                  </span>
                  {term.title}
                </span>
                {/* 상세 보기 — label 클릭 전파 차단 */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onViewDetail(term);
                  }}
                  aria-label={`${term.title} 상세 보기`}
                  className="flex items-center justify-center w-7 h-7 text-text-disabled hover:text-text-secondary transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** 내부 체크박스 컴포넌트 — 클릭은 부모 label이 처리 */
function Checkbox({ checked }: { checked: boolean }) {
  return (
    <span
      role="checkbox"
      aria-checked={checked}
      className="shrink-0 transition-colors"
    >
      {checked ? (
        <CircleCheckBig size={22} className="text-primary" />
      ) : (
        <Circle size={22} className="text-gray-400" />
      )}
    </span>
  );
}
