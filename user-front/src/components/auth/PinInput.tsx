/**
 * 공동인증 PIN 입력 공통 컴포넌트
 *
 * 사용처:
 * - 대출 신청 PIN 인증
 * - My Biz Data PIN 인증
 * - 대출 약정 전자서명 PIN 인증
 * - 회원가입 PIN 인증
 *
 * 보안 규칙: 검증 요청 후 입력값 즉시 초기화
 */
import { useState, useCallback } from "react";
import { Delete } from "lucide-react";

const PIN_LENGTH = 6;

interface PinInputProps {
  /** PIN 입력 완료 시 호출 (검증 요청 후 내부에서 즉시 초기화) */
  onSubmit: (pin: string) => void;
  isLoading?: boolean;
  errorMessage?: string;
}

export function PinInput({ onSubmit, isLoading = false, errorMessage }: PinInputProps) {
  const [pin, setPin] = useState("");

  /** 숫자 입력 */
  const handlePress = useCallback(
    (digit: string) => {
      if (isLoading) return;
      const next = pin + digit;
      if (next.length === PIN_LENGTH) {
        onSubmit(next);
        setPin("");
      } else {
        setPin(next);
      }
    },
    [pin, isLoading, onSubmit]
  );

  /** 삭제 */
  const handleDelete = useCallback(() => {
    if (isLoading) return;
    setPin((prev) => prev.slice(0, -1));
  }, [isLoading]);

  return (
    <div data-testid="pin-input" className="flex flex-col items-center w-full">
      {/* PIN 도트 표시 */}
      <div className="flex gap-4 mb-12">
        {Array.from({ length: PIN_LENGTH }).map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-colors ${
              i < pin.length ? "bg-primary" : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      {/* 에러 메시지 */}
      {errorMessage && (
        <p className="text-sm text-error text-center mb-4">{errorMessage}</p>
      )}

      {/* 숫자 키패드 */}
      <div className="grid grid-cols-3 w-full mt-auto">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"].map(
          (key) => {
            if (key === "") {
              return <div key="empty" />;
            }
            if (key === "del") {
              return (
                <button
                  key="del"
                  type="button"
                  onClick={handleDelete}
                  disabled={isLoading}
                  aria-label="삭제"
                  className="h-16 flex items-center justify-center active:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  <Delete size={22} className="text-gray-600" />
                </button>
              );
            }
            return (
              <button
                key={key}
                type="button"
                onClick={() => handlePress(key)}
                disabled={isLoading}
                className="h-16 flex items-center justify-center text-xl font-medium text-text-primary active:bg-gray-100 transition-colors disabled:opacity-50"
              >
                {key}
              </button>
            );
          }
        )}
      </div>
    </div>
  );
}
