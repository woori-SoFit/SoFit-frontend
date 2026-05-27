/**
 * 공통 타입 정의
 */

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface TermsItem {
  id: number;
  title: string;
  content: string;
  required: boolean;
  /** 약관 PDF URL (API 연동 시 사용) */
  fileUrl?: string;
}

/** 약관 유형 */
export type TermType =
  | "PERSONAL_INFO"
  | "MYDATA"
  | "MYBIZDATA"
  | "LOAN_APPLICATION"
  | "LOAN_AGREEMENT";
