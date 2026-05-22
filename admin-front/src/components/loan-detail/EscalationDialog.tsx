import { useState, useEffect, useCallback } from 'react';
import type { EscalationPayload } from '@/types';

interface EscalationDialogProps {
  /** 다이얼로그 열림 여부 */
  isOpen: boolean;
  /** 다이얼로그 닫기 핸들러 */
  onClose: () => void;
  /** 추가 결재 요청 핸들러 */
  onSubmit: (payload: EscalationPayload) => void;
  /** 요청 처리 중 여부 */
  isSubmitting: boolean;
  /** 요청 처리 에러 */
  error: Error | null;
}

/**
 * 추가 결재 요청 다이얼로그 컴포넌트.
 * 지점장에게 추가 결재를 요청하는 확인 다이얼로그로,
 * 의견 입력(선택)과 요청/취소 버튼을 제공한다.
 * 에러 발생 시 토스트 형태로 3초간 표시한다.
 */
export default function EscalationDialog({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  error,
}: EscalationDialogProps) {
  const [comment, setComment] = useState('');
  const [showToast, setShowToast] = useState(false);

  // 모달 닫힐 때 입력값 초기화
  useEffect(() => {
    if (!isOpen) {
      setComment('');
      setShowToast(false);
    }
  }, [isOpen]);

  // 에러 발생 시 토스트 3초 표시
  useEffect(() => {
    if (error) {
      setShowToast(true);
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const isCommentValid = comment.trim().length > 0;

  const handleSubmit = useCallback(() => {
    if (!isCommentValid) return;
    const payload: EscalationPayload = {
      comment: comment.trim(),
    };
    onSubmit(payload);
  }, [comment, isCommentValid, onSubmit]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 오버레이 */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* 다이얼로그 본체 */}
      <div className="relative w-full max-w-md rounded-xl bg-bg-surface p-6 shadow-lg">
        {/* 안내 문구 */}
        <div className="mb-5">
          <h2 className="mb-2 text-lg font-semibold text-text-primary">추가 결재 요청</h2>
          <p className="text-sm text-text-secondary">
            해당 건을 지점장에게 추가 결재 요청하시겠습니까?
          </p>
        </div>

        {/* 의견 입력 */}
        <div className="mb-5">
          <label htmlFor="escalationComment" className="mb-1 block text-xs font-medium text-text-secondary">
            의견 (필수, 최대 500자)
          </label>
          <textarea
            id="escalationComment"
            value={comment}
            onChange={(e) => setComment(e.target.value.slice(0, 500))}
            maxLength={500}
            rows={3}
            placeholder="지점장에게 전달할 의견을 입력해 주세요."
            className="w-full resize-none rounded-md border border-border-default px-3 py-2 text-sm outline-none transition-colors focus:border-border-focus"
          />
          <p className="mt-1 text-right text-xs text-text-disabled">{comment.length}/500</p>
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-md border border-border-default px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isCommentValid || isSubmitting}
            className="rounded-md bg-info px-4 py-2 text-sm font-medium text-text-inverse transition-colors hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '요청 중...' : '요청'}
          </button>
        </div>
      </div>

      {/* 에러 토스트 */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 z-60 -translate-x-1/2 rounded-lg bg-gray-800 px-4 py-3 text-sm text-white shadow-lg">
          추가 결재 요청에 실패했습니다. 다시 시도해 주세요.
        </div>
      )}
    </div>
  );
}
