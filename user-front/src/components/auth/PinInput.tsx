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
 * 6자리 입력 완료 시 자동으로 onSubmit 호출
 */
import { useState, useCallback, useMemo } from "react";
import { LockKeyhole, Delete } from "lucide-react";

const PIN_LENGTH = 6;

/** Fisher-Yates 셔플 (crypto 기반 보안 난수) */
function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const randomValue = crypto.getRandomValues(new Uint32Array(1))[0];
    const j = randomValue % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

interface PinInputProps {
  /** PIN 6자리 입력 완료 시 자동 호출 */
  onSubmit: (pin: string) => void;
  isLoading?: boolean;
  errorMessage?: string;
}

export function PinInput({ onSubmit, isLoading = false, errorMessage }: PinInputProps) {
  const [pin, setPin] = useState("");

  // 마운트 시 1회 숫자 0~9 셔플 → 키패드 배열 생성
  const keypadLayout = useMemo(() => {
    const shuffled = shuffleArray(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);
    const topNine = shuffled.slice(0, 9);
    const lastOne = shuffled[9];
    return [...topNine, "", lastOne, "del"];
  }, []);

  /** 숫자 입력 — 6자리 완성 시 자동 제출 */
  const handlePress = useCallback(
    (digit: string) => {
      if (isLoading || pin.length >= PIN_LENGTH) return;
      const next = pin + digit;
      setPin(next);
      if (next.length === PIN_LENGTH) {
        requestAnimationFrame(() => {
          onSubmit(next);
          setPin("");
        });
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
    <div data-testid="pin-input" className="flex flex-col items-center h-full">
      <div className="flex flex-col items-center pt-6">
        {/* 자물쇠 아이콘 */}
        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-6">
          <LockKeyhole size={28} className="text-primary" />
        </div>

        {/* 타이틀 */}
        <h2 className="text-lg font-bold text-text-primary mb-10">
          금융인증서 PIN을 입력해주세요
        </h2>

        {/* PIN 도트 표시 */}
        <div className="flex gap-4">
          {Array.from({ length: PIN_LENGTH }).map((_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full transition-colors ${
                i < pin.length ? "bg-gray-800" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* 에러 메시지 */}
        {errorMessage && (
          <p className="text-sm text-error text-center mt-4">{errorMessage}</p>
        )}
      </div>

      {/* 숫자 키패드 */}
      <div className="flex-1 flex items-end w-full pb-6">
        <div className="grid grid-cols-3 gap-y-5 w-full">
          {keypadLayout.map(
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
                    className="h-14 flex items-center justify-center active:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    <Delete size={24} className="text-gray-600" />
                  </button>
                );
              }
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handlePress(key)}
                  disabled={isLoading}
                  className="h-14 flex items-center justify-center text-2xl font-medium text-text-primary"
                >
                  {key}
                </button>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
}
