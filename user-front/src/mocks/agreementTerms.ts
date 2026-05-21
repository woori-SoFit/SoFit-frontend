import type { TermsItem } from "@/types/common";

/** 대출 약정 약관 목록 */
export const MOCK_AGREEMENT_TERMS: TermsItem[] = [
  {
    id: 10,
    title: "대출 약정서",
    content:
      "본 약정서는 대출 실행에 관한 제반 조건을 규정합니다.\n\n1. 대출금은 약정된 계좌로 입금됩니다.\n2. 상환은 약정된 방식에 따라 진행됩니다.\n3. 연체 시 연체이자가 부과됩니다.",
    required: true,
  },
  {
    id: 11,
    title: "전자서명 동의",
    content:
      "금융인증서를 이용한 전자서명에 동의합니다.\n\n전자서명은 본인의 의사에 따른 것이며, 서면 서명과 동일한 법적 효력을 가집니다.",
    required: true,
  },
  {
    id: 12,
    title: "자동이체 동의",
    content:
      "대출 원리금 상환을 위한 자동이체에 동의합니다.\n\n매월 약정일에 등록된 계좌에서 자동으로 출금됩니다. 잔액 부족 시 연체 처리될 수 있습니다.",
    required: true,
  },
];
