/**
 * 사업자 정보 확인 공통 컴포넌트
 *
 * 사용처:
 * - 대출 신청 사업자 정보 확인 step
 * - 마이페이지 사업자 정보 확인
 *
 * 상단 텍스트, 정보 테이블 데이터를 props로 받아 범용적으로 사용 가능
 */
import { BottomButton } from "@/components/common/BottomButton";
import checkIcon from "@/assets/icons/check.svg";
import type { ReactNode } from "react";

/** 정보 테이블 행 */
export interface InfoRow {
  label: string;
  value: string;
}

interface BizInfoConfirmProps {
  /** 타이틀 — ReactNode로 받아 일부 텍스트 강조 가능 */
  title: ReactNode;
  /** 타이틀 아래 설명 */
  description?: string;
  /** 정보 테이블 데이터 */
  rows: InfoRow[];
  /** 하단 버튼 레이블 (기본값: "확인하기") */
  buttonLabel?: string;
  /** 확인 버튼 클릭 시 호출 */
  onConfirm: () => void;
}

export function BizInfoConfirm({
  title,
  description,
  rows,
  buttonLabel = "확인하기",
  onConfirm,
}: BizInfoConfirmProps) {
  return (
    <div className="flex flex-col min-h-full">
      {/* 상단 안내 */}
      <div className="flex flex-col items-center pb-6 px-5">
        <div className="flex items-center justify-center mb-4">
          <img src={checkIcon} alt="" className="w-52" />
        </div>

        <h1 className="text-xl font-bold text-text-primary mb-2 text-center">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-text-secondary text-center">
            {description}
          </p>
        )}
      </div>

      {/* 정보 테이블 */}
      <div className="flex-1 mx-5 mb-4 border border-border-default rounded-xl overflow-hidden">
        <table className="w-full">
          <tbody>
            {rows.map((row, idx) => (
              <tr
                key={row.label}
                className={idx < rows.length - 1 ? "border-b border-border-default" : ""}
              >
                <td className="px-4 py-5 text-sm text-text-secondary whitespace-nowrap align-middle">
                  {row.label}
                </td>
                <td className="px-4 py-5 text-sm font-medium text-text-primary text-right align-middle">
                  {row.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 하단 버튼 */}
      <BottomButton label={buttonLabel} onClick={onConfirm} />
    </div>
  );
}
