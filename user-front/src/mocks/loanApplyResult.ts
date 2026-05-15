/**
 * 대출 신청 완료 결과 Mock 데이터
 *
 * label은 고정값, value는 API 연동 시 응답으로 교체
 *
 * TODO: API 연동 완료 후 이 파일 삭제
 */
import type { InfoRow } from "@/components/common/ConfirmPage";

export const MOCK_LOAN_APPLY_RESULT_ROWS: InfoRow[] = [
  { label: "신청 상품", value: "우리 사장님 대출" },
  { label: "신청 금액", value: "3,000만원" },
  { label: "신청 일시", value: "2025.05.15 14:35" },
  { label: "상환 방식", value: "원리금균등" },
];
