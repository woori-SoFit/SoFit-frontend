/**
 * 약관 상세 보기 공통 컴포넌트 (Bottom Sheet)
 *
 * 사용처:
 * - 대출 약관 상세
 * - My Biz Data 약관 상세
 * - 회원가입 약관 상세
 */
import { useEffect, useState } from "react";
import type { TermsItem } from "@/types/common";
import { X } from "lucide-react";

interface TermsDetailSheetProps {
  term: TermsItem | null;
  isOpen: boolean;
  /** 이미 동의한 항목인지 여부 — 버튼 상태에 반영 */
  isAgreed?: boolean;
  onClose: () => void;
  /** 동의 버튼 클릭 시 호출 — 미전달 시 확인 버튼만 표시 */
  onAgree?: (term: TermsItem) => void;
}

export function TermsDetailSheet({
  term,
  isOpen,
  isAgreed = false,
  onClose,
  onAgree,
}: TermsDetailSheetProps) {
  /**
   * visible: DOM에 마운트 여부 (애니메이션 끝난 후 언마운트)
   * animate: 실제 슬라이드 클래스 전환 트리거
   */
  const [visible, setVisible] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isOpen && term) {
      // 마운트 → 다음 프레임에 animate ON (translate-y-full → translate-y-0)
      setVisible(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimate(true));
      });
      document.body.style.overflow = "hidden";
    } else {
      // animate OFF → transition 끝나면 언마운트
      setAnimate(false);
      document.body.style.overflow = "";
    }
  }, [isOpen, term]);

  /** transition 종료 후 언마운트 */
  const handleTransitionEnd = () => {
    if (!animate) setVisible(false);
  };

  if (!visible || !term) return null;

  const handleAgree = () => {
    onAgree?.(term);
    onClose();
  };

  return (
    <>
      {/* 딤 배경 */}
      <div
        className={`fixed inset-0 z-100 bg-black/40 transition-opacity duration-300 ${
          animate ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 시트 본체 */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={term.title}
        data-testid="terms-detail-sheet"
        onTransitionEnd={handleTransitionEnd}
        className={`fixed bottom-0 left-1/2 -translate-x-1/2 z-100 w-full max-w-[430px] bg-white rounded-t-2xl flex flex-col max-h-[80vh] transition-transform duration-300 ease-out ${
          animate ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* 핸들 바 */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-border-default" />
        </div>

        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border-default shrink-0">
          <h2 className="text-base font-semibold text-text-primary">
            {term.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-text-secondary"
          >
            <X size={18} />
          </button>
        </div>

        {/* 약관 본문 */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
            {term.content}
          </p>
        </div>

        {/* 하단 버튼 */}
        <div className="px-5 py-4 shrink-0">
          {onAgree ? (
            <button
              type="button"
              onClick={handleAgree}
              disabled={isAgreed}
              className="w-full h-12 rounded-xl text-base font-semibold transition-colors disabled:bg-bg-muted disabled:text-text-disabled bg-primary text-white hover:bg-primary-dark active:bg-primary-dark"
            >
              {isAgreed ? "동의 완료" : "동의"}
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="w-full h-12 rounded-xl bg-primary text-white text-base font-semibold hover:bg-primary-dark active:bg-primary-dark transition-colors"
            >
              확인
            </button>
          )}
        </div>
      </div>
    </>
  );
}
