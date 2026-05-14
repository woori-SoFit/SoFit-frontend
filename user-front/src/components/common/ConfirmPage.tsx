/**
 * 완료/확인용 공통 페이지 컴포넌트
 *
 * 사용처:
 * - 사업자 정보 확인
 * - 대출 신청 완료
 * - 약정 완료
 * - 기타 확인/완료 화면
 *
 * 구조: 아이콘 + 타이틀 + 설명 + 정보 테이블(선택) + 하단 버튼
 */
import type { ReactNode } from "react";
import { BottomButton } from "./BottomButton";
import checkIcon from "@/assets/icons/check.svg";

/** 정보 테이블 행 */
export interface InfoRow {
  label: string;
  value: string;
}

interface ConfirmPageProps {
  /** 상단 아이콘 이미지 경로 (기본: check.svg) */
  icon?: string;
  /** 타이틀 — ReactNode로 받아 일부 텍스트 강조 가능 */
  title: ReactNode;
  /** 타이틀 아래 설명 */
  description?: string;
  /** 정보 테이블 데이터 (선택) */
  rows?: InfoRow[];
  /** 하단 버튼 레이블 (기본값: "확인하기") */
  buttonLabel?: string;
  /** 하단 버튼 클릭 시 호출 */
  onConfirm: () => void;
  /** 추가 콘텐츠 (테이블 아래, 버튼 위) */
  children?: ReactNode;
}

export function ConfirmPage({
  icon = checkIcon,
  title,
  description,
  rows,
  buttonLabel = "확인하기",
  onConfirm,
  children,
}: ConfirmPageProps) {
  return (
    <div className="flex flex-col min-h-full">
      {/* 상단 안내 */}
      <div className="flex flex-col items-center pb-6 px-5">
        {/* 아이콘 */}
        <div className="w-52 flex items-center justify-center mb-3">
          <img src={icon} />
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
      {rows && rows.length > 0 && (
        <div className="mx-5 mb-4 border border-border-default rounded-xl overflow-hidden">
          <table className="w-full">
            <tbody>
              {rows.map((row, idx) => (
                <tr
                  key={row.label}
                  className={idx < rows.length - 1 ? "border-b border-border-default" : ""}
                >
                  <td className="px-4 py-4.5 text-sm text-text-secondary whitespace-nowrap align-middle">
                    {row.label}
                  </td>
                  <td className="px-4 py-4.5 text-sm font-medium text-text-primary text-right align-middle">
                    {row.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 추가 콘텐츠 */}
      {children && <div className="flex-1 px-5">{children}</div>}

      {/* 여백 채우기 (children 없을 때) */}
      {!children && <div className="flex-1" />}

      {/* 하단 버튼 */}
      <BottomButton label={buttonLabel} onClick={onConfirm} />
    </div>
  );
}
