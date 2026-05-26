/**
 * 사업자 정보 Mock 데이터
 *
 * TODO: API 연동 완료 후 이 파일 삭제
 */
import type { InfoRow } from "@/components/loan/BizInfoConfirm";

export const MOCK_BIZ_INFO_ROWS: InfoRow[] = [
  { label: "사업자등록번호", value: "123-45-67890" },
  { label: "상호명", value: "홍길동 감자탕" },
  { label: "대표자명", value: "홍길동" },
  { label: "개업일", value: "2019.05.01" },
  { label: "업종/업태", value: "한식/음식점업" },
  { label: "사업장 주소", value: "서울특별시 강남구 테헤란로 123, 4층" },
];
