/**
 * 사업자 정보 확인 컴포넌트
 *
 * ConfirmPage 공통 컴포넌트를 활용한 래퍼
 *
 * 사용처:
 * - 대출 신청 사업자 정보 확인 step
 * - 마이페이지 사업자 정보 확인
 */
import Lottie from "lottie-react";
import { ConfirmPage } from "@/components/common/ConfirmPage";
import type { InfoRow } from "@/components/common/ConfirmPage";
import type { ReactNode } from "react";
import verification from "@/assets/lottie/Verification.json";

// InfoRow 타입 re-export (기존 import 호환)
export type { InfoRow };

interface BizInfoConfirmProps {
  /** 타이틀 — ReactNode로 받아 일부 텍스트 강조 가능 */
  title: ReactNode;
  /** 타이틀 아래 설명 */
  description?: string;
  /** 정보 테이블 데이터 */
  rows: InfoRow[];
  /** 정보 로딩 중 여부 */
  isLoading?: boolean;
  /** 하단 버튼 레이블 (기본값: "확인하기") */
  buttonLabel?: string;
  /** 확인 버튼 클릭 시 호출 */
  onConfirm: () => void;
}

export function BizInfoConfirm({
  title,
  description,
  rows,
  isLoading,
  buttonLabel,
  onConfirm,
}: BizInfoConfirmProps) {
  return (
    <ConfirmPage
      icon={<Lottie animationData={verification} loop={1} className="w-28 mt-5" />}
      title={title}
      description={description}
      rows={rows}
      isLoading={isLoading}
      buttonLabel={buttonLabel}
      onConfirm={onConfirm}
    />
  );
}
