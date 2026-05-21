import { useState, useEffect, useCallback } from 'react';
import type { RejectionPayload } from '@/types';
import { isWhitespaceOnly } from '@/utils/validators';

interface RejectionModalProps {
  /** 모달 열림 여부 */
  isOpen: boolean;
  /** 모달 닫기 핸들러 */
  onClose: () => void;
  /** 거절 처리 핸들러 */
  onSubmit: (payload: RejectionPayload) => void;
  /** 거절 처리 중 여부 */
  isSubmitting: boolean;
  /** 거절 처리 에러 */
  error: Error | null;
}

/**
 * 대출 거절 모달 컴포넌트.
 * 거절 사유(필수)와 의견(선택)을 입력받아 거절 처리를 수행한다.
 * 거절 사유가 비어있거나 공백만일 때 확인 버튼이 비활성화된다.
 * API 에러 시 입력값을 유지하며, 취소 시 입력값을 초기화한다.
 */
export default function RejectionModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  error,
}: RejectionModalProps) {
  const [reason, setReason] = useState('');
  const [comment, setComment] = useState('');

  // 모달 닫힐 때 입력값 초기화
  useEffect(() => {
    if (!isOpen) {
      setReason('');
      setComment('');
    }
  }, [isOpen]);

  const isReasonValid = reason !== '' && !isWhitespaceOnly(reason);
  const isFormValid = isReasonValid;

  const handleSubmit = useCallback(() => {
    if (!isFormValid) return;

    const payload: RejectionPayload = {
      reason: reason.trim(),
      comment: comment.trim() || undefined,
    };
    onSubmit(payload);
  }, [isFormValid, reason, comment, onSubmit]);

  const handleClose = useCallback(() => {
    // 취소 시 입력값 초기화
    setReason('');
    setComment('');
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 오버레이 */}
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      {/* 모달 본체 */}
      <div className="relative w-full max-w-lg rounded-xl bg-bg-surface p-6 shadow-lg">
        <h2 className="mb-5 text-lg font-semibold text-text-primary">대출 거절</h2>

        <div className="space-y-4">
          {/* 거절 사유 (필수) */}
          <div>
            <label htmlFor="rejectionReason" className="mb-1 block text-xs font-medium text-text-secondary">
              거절 사유 <span className="text-error">*</span> (최대 500자)
            </label>
            <textarea
              id="rejectionReason"
              value={reason}
              onChange={(e) => setReason(e.target.value.slice(0, 500))}
              maxLength={500}
              rows={4}
              placeholder="거절 사유를 입력해 주세요."
              className={`w-full resize-none rounded-md border px-3 py-2 text-sm outline-none transition-colors ${
                reason && !isReasonValid
                  ? 'border-error focus:border-error'
                  : 'border-border-default focus:border-border-focus'
              }`}
            />
            <div className="mt-1 flex items-center justify-between">
              {reason && !isReasonValid && (
                <p className="text-xs text-error">공백만으로는 거절 사유를 입력할 수 없습니다.</p>
              )}
              <p className="ml-auto text-xs text-text-disabled">{reason.length}/500</p>
            </div>
          </div>

          {/* 의견 (선택) */}
          <div>
            <label htmlFor="rejectionComment" className="mb-1 block text-xs font-medium text-text-secondary">
              의견 (선택, 최대 500자)
            </label>
            <textarea
              id="rejectionComment"
              value={comment}
              onChange={(e) => setComment(e.target.value.slice(0, 500))}
              maxLength={500}
              rows={3}
              placeholder="추가 의견을 입력해 주세요."
              className="w-full resize-none rounded-md border border-border-default px-3 py-2 text-sm outline-none transition-colors focus:border-border-focus"
            />
            <p className="mt-1 text-right text-xs text-text-disabled">{comment.length}/500</p>
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <p className="mt-3 text-sm text-error">거절 처리에 실패했습니다. 다시 시도해 주세요.</p>
        )}

        {/* 버튼 영역 */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="rounded-md border border-border-default px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            className="rounded-md bg-error px-4 py-2 text-sm font-medium text-text-inverse transition-colors hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '처리 중...' : '거절'}
          </button>
        </div>
      </div>
    </div>
  );
}
