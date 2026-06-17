/**
 * 대출 심사 상태별 배지 및 스텝퍼 매핑
 */
import type { LoanApplicationStatus } from "@/types/loan";

/** 상태 배지 정보 */
export interface StatusBadgeInfo {
  label: string;
  color: string;
}

/** 상태별 배지 매핑 */
export const STATUS_BADGE: Record<LoanApplicationStatus, StatusBadgeInfo> = {
  DRAFT: { label: "초안", color: "bg-gray-100 text-gray-600" },
  SUBMITTED: { label: "심사 중", color: "bg-gray-100 text-gray-600" },
  CB_CHECKING: { label: "심사 중", color: "bg-gray-100 text-gray-600" },
  BASIC_REVIEW: { label: "심사 중", color: "bg-gray-100 text-gray-600" },
  S_CALCULATING: { label: "심사 중", color: "bg-gray-100 text-gray-600" },
  S_COMPLETED: { label: "심사 중", color: "bg-gray-100 text-gray-600" },
  SYSTEM_APPROVED: { label: "심사 중", color: "bg-gray-100 text-gray-600" },
  SYSTEM_REJECTED: { label: "심사 중", color: "bg-gray-100 text-gray-600" },
  MANAGER_REVIEW: { label: "심사 중", color: "bg-gray-100 text-gray-600" },
  APPROVED: { label: "대출 승인", color: "bg-green-100 text-green-700" },
  REJECTED: { label: "대출 거절", color: "bg-red-100 text-red-700" },
  CONTRACTED: { label: "약정 완료", color: "bg-green-100 text-green-700" },
  EXECUTED: { label: "실행 완료", color: "bg-blue-100 text-primary" },
  CANCELLED: { label: "취소", color: "bg-gray-100 text-gray-600" },
};

/** 상태별 스텝퍼 인덱스 (0: 신청접수, 1: 서류확인, 2: 심사 중, 3: 심사 완료) */
export const STATUS_STEP_INDEX: Record<LoanApplicationStatus, number> = {
  DRAFT: 0,
  SUBMITTED: 2,
  CB_CHECKING: 1,
  BASIC_REVIEW: 1,
  S_CALCULATING: 2,
  S_COMPLETED: 2,
  SYSTEM_APPROVED: 2,
  SYSTEM_REJECTED: 2,
  MANAGER_REVIEW: 2,
  APPROVED: 3,
  REJECTED: 3,
  CONTRACTED: 3,
  EXECUTED: 3,
  CANCELLED: 3,
};
