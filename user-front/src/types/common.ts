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
}
