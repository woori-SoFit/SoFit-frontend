import type { LoanApplication, LoanApplicationParams, PaginatedResponse } from '@/types';

const MOCK_DATA: LoanApplication[] = [
  {
    id: 1,
    applicationDate: '2024-05-24',
    applicantName: '이정훈',
    businessName: '카페나무 주식회사',
    productName: '소상공인 성장 지원 대출',
    reviewStatus: 'UNDER_REVIEW',
    assigneeName: '김은행',
  },
  {
    id: 2,
    applicationDate: '2024-05-24',
    applicantName: '박지은',
    businessName: '지은테크',
    productName: '소상공인 성장 지원 대출',
    reviewStatus: 'UNDER_REVIEW',
    assigneeName: '이담당',
  },
  {
    id: 3,
    applicationDate: '2024-05-23',
    applicantName: '최상호',
    businessName: '상호푸드',
    productName: '소상공인 운전자금 대출',
    reviewStatus: 'UNDER_REVIEW',
    assigneeName: '김은행',
  },
  {
    id: 4,
    applicationDate: '2024-05-23',
    applicantName: '장유진',
    businessName: '유진상사',
    productName: '사업자 신용대출',
    reviewStatus: 'MANAGER_REVIEW',
    assigneeName: '김은행',
  },
  {
    id: 5,
    applicationDate: '2024-05-22',
    applicantName: '한민석',
    businessName: '민석이네 커피',
    productName: '운전자금 대출',
    reviewStatus: 'APPROVED',
    assigneeName: '김은행',
  },
  {
    id: 6,
    applicationDate: '2024-05-22',
    applicantName: '오세영',
    businessName: '세영패션',
    productName: '사업자 신용대출',
    reviewStatus: 'APPROVED',
    assigneeName: '이담당',
  },
  {
    id: 7,
    applicationDate: '2024-05-21',
    applicantName: '김도현',
    businessName: '도현건설',
    productName: '시설자금 대출',
    reviewStatus: 'REJECTED',
    assigneeName: '김은행',
  },
  {
    id: 8,
    applicationDate: '2024-05-21',
    applicantName: '이수빈',
    businessName: '수빈뷰티',
    productName: '운전자금 대출',
    reviewStatus: 'UNDER_REVIEW',
    assigneeName: '이담당',
  },
  {
    id: 9,
    applicationDate: '2024-05-20',
    applicantName: '조현우',
    businessName: '현우이노베이션',
    productName: '사업자 신용대출',
    reviewStatus: 'REJECTED',
    assigneeName: '이담당',
  },
  {
    id: 10,
    applicationDate: '2024-05-20',
    applicantName: '장미영',
    businessName: '미영식품',
    productName: '운전자금 대출',
    reviewStatus: 'MANAGER_REVIEW',
    assigneeName: '김은행',
  },
  {
    id: 11,
    applicationDate: '2024-05-19',
    applicantName: '송태민',
    businessName: '태민물류',
    productName: '시설자금 대출',
    reviewStatus: 'UNDER_REVIEW',
    assigneeName: '김은행',
  },
  {
    id: 12,
    applicationDate: '2024-05-19',
    applicantName: '윤서현',
    businessName: '서현디자인',
    productName: '사업자 신용대출',
    reviewStatus: 'APPROVED',
    assigneeName: '이담당',
  },
  {
    id: 13,
    applicationDate: '2024-05-18',
    applicantName: '강민재',
    businessName: '민재전자',
    productName: '운전자금 대출',
    reviewStatus: 'MANAGER_REVIEW',
    assigneeName: '김은행',
  },
  {
    id: 14,
    applicationDate: '2024-05-18',
    applicantName: '임하영',
    businessName: '하영베이커리',
    productName: '시설자금 대출',
    reviewStatus: 'UNDER_REVIEW',
    assigneeName: '이담당',
  },
  {
    id: 15,
    applicationDate: '2024-05-17',
    applicantName: '정우성',
    businessName: '우성모터스',
    productName: '사업자 신용대출',
    reviewStatus: 'APPROVED',
    assigneeName: '김은행',
  },
  {
    id: 16,
    applicationDate: '2024-05-17',
    applicantName: '배수지',
    businessName: '수지플라워',
    productName: '운전자금 대출',
    reviewStatus: 'REJECTED',
    assigneeName: '김은행',
  },
  {
    id: 17,
    applicationDate: '2024-05-16',
    applicantName: '홍길동',
    businessName: '길동유통',
    productName: '시설자금 대출',
    reviewStatus: 'MANAGER_REVIEW',
    assigneeName: '이담당',
  },
  {
    id: 18,
    applicationDate: '2024-05-16',
    applicantName: '나영희',
    businessName: '영희네 반찬',
    productName: '사업자 신용대출',
    reviewStatus: 'UNDER_REVIEW',
    assigneeName: '김은행',
  },
];

/**
 * 서버 페이징 응답을 시뮬레이션하는 Mock 함수.
 * 필터링 + 정렬 + 페이징을 처리합니다.
 */
export function getMockLoanApplications(
  params: LoanApplicationParams
): PaginatedResponse<LoanApplication> {
  let filtered = [...MOCK_DATA];

  // 상태 필터
  if (params.status) {
    filtered = filtered.filter((app) => app.reviewStatus === params.status);
  }

  // 담당자 필터
  if (params.assigneeName) {
    filtered = filtered.filter((app) => app.assigneeName === params.assigneeName);
  }

  // 신청일 기준 내림차순 정렬
  filtered.sort((a, b) => b.applicationDate.localeCompare(a.applicationDate));

  const totalElements = filtered.length;
  const totalPages = Math.ceil(totalElements / params.size);
  const start = params.page * params.size;
  const content = filtered.slice(start, start + params.size);

  return {
    content,
    totalElements,
    totalPages,
    page: params.page,
    size: params.size,
  };
}
