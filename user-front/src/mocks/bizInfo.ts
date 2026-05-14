/**
 * 사업자 정보 Mock 데이터
 *
 * TODO: API 연동 완료 후 이 파일 삭제
 */
import type { InfoRow } from "@/components/loan/BizInfoConfirm";

export const MOCK_BIZ_INFO_ROWS: InfoRow[] = [
  { label: "대표자 명", value: "홍길동" },
  { label: "주민등록번호", value: "030623-4******" },
  { label: "사업자등록번호", value: "123-45-67890" },
  { label: "업종명", value: "커피전문점" },
  { label: "업태", value: "서비스업" },
  { label: "사업장 소재지", value: "서울특별시 강남구 테헤란로 123" },
  { label: "사업 시작일", value: "2022.01.15" },
];
