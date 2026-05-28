/**
 * 약관 동의 공통 컴포넌트
 *
 * 사용처:
 * - 대출 신청 약관 동의
 * - My Biz Data 약관 동의
 * - 회원가입 약관 동의
 *
 * 동작:
 * - 체크 영역(아이콘+텍스트) 클릭: 동의 토글 (이미 동의 → 취소, 미동의 → 시트 열기)
 * - 상세보기(>) 버튼: 시트만 열기 (동의 상태 변경 없음)
 * - 전체 동의: onAllAgree 콜백 호출 (부모에서 시트 순차 표시 처리)
 */
import type { TermsItem } from "@/types/common";
import { ChevronRight, Circle, CircleCheckBig } from "lucide-react";

interface TermsAgreementProps {
  terms: TermsItem[];
  agreedIds: number[];
  onChange: (agreedIds: number[]) => void;
  /** 개별 약관 상세 보기 (시트 열기만, 동의 상태 변경 없음) */
  onViewDetail: (term: TermsItem) => void;
  /** 전체 동의 클릭 시 호출 (이미 전체 동의 상태면 전체 해제) */
  onAllAgree: () => void;
}

export function TermsAgreement({
  terms,
  agreedIds,
  onChange,
  onViewDetail,
  onAllAgree,
}: TermsAgreementProps) {
  const allChecked = terms.length > 0 && terms.every((t) => agreedIds.includes(t.id));

  /** 전체 동의 토글 */
  const handleAllChange = () => {
    if (allChecked) {
      // 이미 전체 동의 → 전체 해제
      onChange([]);
    } else {
      // 미동의 항목 있음 → 부모에서 시트 순차 표시
      onAllAgree();
    }
  };

  /** 개별 약관 토글 */
  const handleItemChange = (term: TermsItem) => {
    const isAgreed = agreedIds.includes(term.id);
    if (isAgreed) {
      // 동의 상태 → 바로 취소
      onChange(agreedIds.filter((v) => v !== term.id));
    } else {
      // 미동의 → 시트 열어서 동의 유도
      onViewDetail(term);
    }
  };

  return (
    <div data-testid="terms-agreement" className="flex flex-col gap-3 px-5 py-6 border border-border-default rounded-lg">
      {/* 전체 동의 */}
      <div
        className="flex items-center gap-3 rounded-xl cursor-pointer"
        onClick={handleAllChange}
      >
        <Checkbox checked={allChecked} />
        <span className="text-base font-semibold text-text-primary">
          전체 동의
        </span>
      </div>

      {/* 구분선 */}
      <div className="h-px bg-border-default" />

      {/* 개별 약관 목록 */}
      <ul className="flex flex-col">
        {terms.map((term) => {
          const isAgreed = agreedIds.includes(term.id);
          return (
            <li key={term.id} className="flex items-center py-4">
              {/* 체크 영역 (아이콘 + 텍스트) — 클릭 시 동의 토글 */}
              <div
                className="flex items-center gap-3 flex-1 cursor-pointer"
                onClick={() => handleItemChange(term)}
              >
                <Checkbox checked={isAgreed} />
                <span className="flex-1 text-sm text-text-primary">
                  <span className="text-text-primary mr-1">
                    {term.required ? "(필수)" : "(선택)"}
                  </span>
                  {term.title}
                </span>
              </div>

              {/* 상세 보기 — 시트만 열기, 동의 상태 변경 없음 */}
              <button
                type="button"
                onClick={() => onViewDetail(term)}
                aria-label={`${term.title} 상세 보기`}
                className="flex items-center justify-center w-4 h-7 pt-0.5 text-text-disabled hover:text-text-secondary transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** 내부 체크박스 컴포넌트 */
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
