/**
 * 약관 상세 보기 공통 컴포넌트 (Bottom Sheet)
 *
 * 사용처:
 * - 대출 약관 상세
 * - My Biz Data 약관 상세
 * - 회원가입 약관 상세
 *
 * PDF 표시:
 * - fileUrl이 있으면 react-pdf로 렌더링 (모바일 대응)
 */
import { useEffect, useState, useCallback, useRef } from "react";
import type { TermsItem } from "@/types/common";
import { X, ZoomIn, ZoomOut } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

const BASE_WIDTH = Math.min(window.innerWidth - 32, 398);
const MIN_SCALE = 0.75;
const MAX_SCALE = 3.0;
const SCALE_STEP = 0.25;
const DEFAULT_SCALE = 1.25;

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

interface TermsDetailSheetProps {
  term: TermsItem | null;
  isOpen: boolean;
  onClose: () => void;
  /** 동의 버튼 클릭 시 호출 — 미전달 시 확인 버튼만 표시 */
  onAgree?: (term: TermsItem) => void;
}

export function TermsDetailSheet({
  term,
  isOpen,
  onClose,
  onAgree,
}: TermsDetailSheetProps) {
  const [visible, setVisible] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [numPages, setNumPages] = useState<number>(0);
  const [pdfError, setPdfError] = useState(false);
  const [scale, setScale] = useState(DEFAULT_SCALE);
  const pinchRef = useRef<{ dist: number; scale: number } | null>(null);

  const handleDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => {
      setNumPages(numPages);
      setPdfError(false);
    },
    [],
  );

  const handleDocumentLoadError = useCallback(() => {
    setPdfError(true);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length !== 2) return;
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    pinchRef.current = { dist: Math.hypot(dx, dy), scale };
  }, [scale]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length !== 2 || !pinchRef.current) return;
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    const newDist = Math.hypot(dx, dy);
    const next = pinchRef.current.scale * (newDist / pinchRef.current.dist);
    setScale(Math.min(MAX_SCALE, Math.max(MIN_SCALE, next)));
  }, []);

  const handleTouchEnd = useCallback(() => {
    pinchRef.current = null;
  }, []);

  useEffect(() => {
    if (isOpen && term) {
      setNumPages(0);
      setPdfError(false);
      setScale(DEFAULT_SCALE);
      setVisible(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimate(true));
      });
      document.body.style.overflow = "hidden";
    } else {
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
        <div
          className="flex-1 overflow-auto py-4"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {term.fileUrl ? (
            pdfError ? (
              <div className="flex flex-col items-center justify-center py-10 gap-3">
                <p className="text-sm text-text-secondary text-center">
                  PDF를 불러올 수 없습니다.
                </p>
                <a
                  href={term.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary underline"
                >
                  새 탭에서 열기
                </a>
              </div>
            ) : (
              <Document
                file={term.fileUrl}
                onLoadSuccess={handleDocumentLoadSuccess}
                onLoadError={handleDocumentLoadError}
                loading={
                  <div className="flex justify-center py-10">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                }
                className="flex flex-col items-center gap-2"
              >
                {Array.from({ length: numPages }, (_, i) => (
                  <Page
                    key={`page_${i + 1}`}
                    pageNumber={i + 1}
                    width={BASE_WIDTH * scale}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                ))}
              </Document>
            )
          ) : (
            <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap px-5">
              {term.content}
            </p>
          )}
        </div>

        {/* 줌 컨트롤 — PDF 있을 때만 표시 */}
        {term.fileUrl && !pdfError && (
          <div className="flex items-center justify-center gap-4 py-2 border-t border-border-default shrink-0">
            <button
              type="button"
              onClick={() => setScale((s) => Math.max(MIN_SCALE, s - SCALE_STEP))}
              disabled={scale <= MIN_SCALE}
              aria-label="축소"
              className="w-8 h-8 flex items-center justify-center rounded-full disabled:text-text-disabled text-text-secondary hover:bg-gray-100 transition-colors"
            >
              <ZoomOut size={18} />
            </button>
            <span className="text-xs text-text-secondary w-10 text-center tabular-nums">
              {Math.round((scale / DEFAULT_SCALE) * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setScale((s) => Math.min(MAX_SCALE, s + SCALE_STEP))}
              disabled={scale >= MAX_SCALE}
              aria-label="확대"
              className="w-8 h-8 flex items-center justify-center rounded-full disabled:text-text-disabled text-text-secondary hover:bg-gray-100 transition-colors"
            >
              <ZoomIn size={18} />
            </button>
          </div>
        )}

        {/* 하단 버튼 */}
        <div className="px-5 py-4 shrink-0">
          {onAgree ? (
            <button
              type="button"
              onClick={handleAgree}
              className="w-full h-12 rounded-xl text-base font-semibold bg-primary text-white hover:bg-primary-dark active:bg-primary-dark transition-colors"
            >
              동의
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
