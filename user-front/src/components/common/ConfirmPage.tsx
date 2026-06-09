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
import checkIcon from "@/assets/icons/check.svg";

/** 정보 테이블 행 */
export interface InfoRow {
  label: string;
  value: string;
}

interface ConfirmPageProps {
  /** 상단 아이콘 — 이미지 경로(string) 또는 커스텀 ReactNode. null이면 숨김 */
  icon?: string | ReactNode | null;
  /** 타이틀 — ReactNode로 받아 일부 텍스트 강조 가능 */
  title: ReactNode;
  /** 타이틀 아래 설명 */
  description?: ReactNode;
  /** 정보 테이블 데이터 (선택) */
  rows?: InfoRow[];
  /** 정보 테이블 로딩 중 여부 — true면 스켈레톤 표시 */
  isLoading?: boolean;
  /** 하단 버튼 레이블 (기본값: "확인하기") */
  buttonLabel?: string;
  /** 하단 버튼 클릭 시 호출 */
  onConfirm: () => void;
  /** 보조 버튼 레이블 (있으면 메인 버튼 위에 아웃라인 버튼 추가) */
  secondaryButtonLabel?: string;
  /** 보조 버튼 클릭 시 호출 */
  onSecondary?: () => void;
  /** 추가 콘텐츠 (테이블 아래, 버튼 위) */
  children?: ReactNode;
}

/** 정보 테이블 스켈레톤 — rows 개수만큼 플레이스홀더 행 표시 */
function TableSkeleton({ rowCount }: { rowCount: number }) {
  return (
    <div className="mx-5 mb-4 border border-border-default bg-white rounded-lg overflow-hidden">
      <table className="w-full">
        <tbody>
          {Array.from({ length: rowCount }).map((_, idx) => (
            <tr
              key={idx}
              className={idx < rowCount - 1 ? "border-b border-border-default" : ""}
            >
              <td className="px-4 py-4.5 align-middle">
                <div className="h-4 w-20 rounded bg-gray-200 animate-pulse" />
              </td>
              <td className="px-4 py-4.5 align-middle">
                <div className="h-4 w-28 rounded bg-gray-200 animate-pulse ml-auto" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ConfirmPage({
  icon = checkIcon,
  title,
  description,
  rows,
  isLoading = false,
  buttonLabel = "확인하기",
  onConfirm,
  secondaryButtonLabel,
  onSecondary,
  children,
}: ConfirmPageProps) {
  return (
    <div className="flex flex-col min-h-full">
      {/* 상단 안내 */}
      <div className="flex flex-col items-center pb-6 px-5">
        {/* 아이콘 */}
        {icon && (
          <div className="w-52 flex items-center justify-center mb-3">
            {typeof icon === 'string' ? <img src={icon} /> : icon}
          </div>
        )}

        <h1 className="text-xl font-bold text-text-primary mb-2 text-center">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-text-secondary text-center">
            {description}
          </p>
        )}
      </div>

      {/* 정보 테이블 — 로딩 중이면 스켈레톤 */}
      {isLoading ? (
        <TableSkeleton rowCount={rows?.length ?? 4} />
      ) : rows && rows.length > 0 ? (
        <div className="mx-5 mb-4 border border-border-default bg-white rounded-lg overflow-hidden">
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
                  <td className="px-4 py-4.5 text-sm font-semibold text-text-primary text-right align-middle">
                    {row.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {/* 추가 콘텐츠 */}
      {children && <div className="flex-1 px-5">{children}</div>}

      {/* 여백 채우기 (children 없을 때) */}
      {!children && <div className="flex-1" />}

      {/* 하단 버튼 */}
      <div className="sticky bottom-0 p-5 flex flex-col gap-3">
        {secondaryButtonLabel && onSecondary && (
          <button
            type="button"
            onClick={onSecondary}
            className="w-full h-12 rounded-lg text-base font-semibold bg-gray-150 cursor-pointer"
          >
            {secondaryButtonLabel}
          </button>
        )}
        <button
          type="button"
          onClick={onConfirm}
          disabled={isLoading}
          className="w-full h-12 rounded-lg text-base font-semibold bg-primary text-white hover:bg-primary-dark active:bg-primary-dark transition-colors cursor-pointer disabled:opacity-50"
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}
