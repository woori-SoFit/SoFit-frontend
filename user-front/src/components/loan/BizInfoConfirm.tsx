/**
 * 사업자 정보 확인 컴포넌트
 *
 * ConfirmPage 공통 컴포넌트를 활용한 래퍼
 *
 * 사용처:
 * - 대출 신청 사업자 정보 확인 step
 * - 마이페이지 사업자 정보 확인
 */
import { ConfirmPage } from "@/components/common/ConfirmPage";
import type { InfoRow } from "@/components/common/ConfirmPage";
import type { ReactNode } from "react";

// InfoRow 타입 re-export (기존 import 호환)
export type { InfoRow };

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
  buttonLabel,
  onConfirm,
}: BizInfoConfirmProps) {
  return (
    <ConfirmPage
      title={title}
      description={description}
      rows={rows}
      buttonLabel={buttonLabel}
      onConfirm={onConfirm}
    />
  );
}
