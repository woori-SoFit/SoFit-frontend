import type {
  LoanDetailData,
  RecommendationData,
  ManagerApprovalItem,
  ShapResult,
} from '@/types';

// ─── Mock 상세 데이터 ───────────────────────────────────────────

const MOCK_LOAN_DETAILS: LoanDetailData[] = [
  {
    id: 1,
    applicationDate: '2024-05-24',
    reviewStatus: 'UNDER_REVIEW',
    assigneeName: '김은행',
    productInfo: {
      productName: '소상공인 성장 지원 대출',
      minAmount: 500,
      maxAmount: 10000,
      minInterestRate: 3.0,
      maxInterestRate: 8.0,
      minTermMonths: 12,
      maxTermMonths: 60,
      availableRepaymentMethods: ['EQUAL_PRINCIPAL_INTEREST', 'EQUAL_PRINCIPAL', 'BULLET'],
      availablePurposes: ['FACILITY', 'WORKING_CAPITAL'],
    },
    customerInfo: {
      name: '이정훈',
      residentNumber: '8503151234567',
      phoneNumber: '01012345678',
      registeredAt: '2024-01-15T09:30:00',
      loginId: 'junghoon85',
    },
    businessInfo: {
      businessName: '카페나무 주식회사',
      businessNumber: '1234567890',
      industry: '음식점업',
      businessType: '커피 전문점',
      address: '서울특별시 강남구 테헤란로 123, 1층',
      startDate: '2019-03-15',
    },
    applicationCondition: {
      desiredAmount: 5000,
      loanTermMonths: 36,
      repaymentMethod: 'EQUAL_PRINCIPAL_INTEREST',
      purpose: 'FACILITY',
    },
    applicantInput: {
      annualIncome: 4800,
      creditScore: 720,
      incomeType: 'BUSINESS',
      existingLoanAmount: 2000,
    },
    termsAgreements: [
      { termName: '대출 이용 약관 (필수)', agreed: true, agreedAt: '2024-05-24T10:12:00' },
      { termName: '개인정보 수집·이용 동의 (필수)', agreed: true, agreedAt: '2024-05-24T10:12:05' },
      { termName: '마이데이터 서비스 이용 약관 (필수)', agreed: true, agreedAt: '2024-05-24T10:12:10' },
      { termName: '마케팅 정보 수신 동의 (선택)', agreed: false, agreedAt: null },
    ],
    systemCollectedData: {
      annualIncome: 5200,
      existingLoanCount: 2,
      monthlyRevenue: 850,
      monthlyRevenueGrowthRate: 5.3,
      cashFlow: 320,
      accountBalance: 1500,
      businessAgeMonths: 62,
      vatFilingStatus: 'FILED',
      taxOverdue: false,
      insurancePaymentStatus: 'PAID',
      industrySalesRank: 15.2,
      industryProfitRank: 22.8,
    },
    cbScore: 720,
    sGrade: 'S3',
    scbScore: 780,
    bonusPoints: 60,
    shapResult: {
      grade: 'S3',
      targetGrade: 'S2',
      strengthKeywords: ['온라인 정보 접근성 점수', '온라인 플랫폼 활동 지수', '업종 평균 대비 매출 비율'],
      improvementKeywords: ['업력 대비 매출증가율(3개월)', '직원당 매출증가율(6개월)'],
      strengthDetails: [
        { featureName: '연간 매출 증가율', shapValue: 0.41286 },
        { featureName: '배달앱 평점', shapValue: 0.345518 },
        { featureName: '온라인 리뷰 수', shapValue: 0.28934 },
        { featureName: '월 평균 카드 결제 건수', shapValue: 0.21567 },
        { featureName: '소셜미디어 팔로워 증가율', shapValue: 0.18423 },
      ],
      improvementDetails: [
        { featureName: '업력(개월)', shapValue: -0.247369 },
        { featureName: '직원 1인당 매출액', shapValue: -0.18234 },
        { featureName: '최근 3개월 매출 변동성', shapValue: -0.12456 },
        { featureName: '전통시장 여부', shapValue: -0.050283 },
        { featureName: '임대료 대비 매출 비율', shapValue: -0.03891 },
      ],
      advice:
        '• 온라인에서 고객과 활발하게 소통하며 높은 평점을 유지하고 있어 디지털 경쟁력이 우수합니다.\n• 연간 매출 증가율이 업종 평균을 크게 상회하여 성장세가 뚜렷합니다.\n• 최근 매출이 조금 주춤한 상황이니 계절적 요인을 고려한 프로모션 전략을 검토해보세요.\n• 직원 생산성 향상을 위한 업무 프로세스 개선을 권장합니다.',
    },
  },
  {
    id: 2,
    applicationDate: '2024-05-23',
    reviewStatus: 'MANAGER_REVIEW',
    assigneeName: '이담당',
    productInfo: {
      productName: '소상공인 성장 지원 대출',
      minAmount: 500,
      maxAmount: 10000,
      minInterestRate: 3.0,
      maxInterestRate: 8.0,
      minTermMonths: 12,
      maxTermMonths: 60,
      availableRepaymentMethods: ['EQUAL_PRINCIPAL_INTEREST', 'EQUAL_PRINCIPAL', 'BULLET'],
      availablePurposes: ['FACILITY', 'WORKING_CAPITAL'],
    },
    customerInfo: {
      name: '박지은',
      residentNumber: '9012252345678',
      phoneNumber: '01098765432',
      registeredAt: '2023-11-20T14:15:00',
      loginId: 'jieun_park90',
    },
    businessInfo: {
      businessName: '지은테크',
      businessNumber: '2345678901',
      industry: '정보통신업',
      businessType: '소프트웨어 개발',
      address: '경기도 성남시 분당구 판교로 256, 5층',
      startDate: '2021-07-01',
    },
    applicationCondition: {
      desiredAmount: 10000,
      loanTermMonths: 60,
      repaymentMethod: 'EQUAL_PRINCIPAL',
      purpose: 'WORKING_CAPITAL',
    },
    applicantInput: {
      annualIncome: 8500,
      creditScore: 680,
      incomeType: 'BUSINESS',
      existingLoanAmount: 5000,
    },
    termsAgreements: [
      { termName: '대출 이용 약관 (필수)', agreed: true, agreedAt: '2024-05-23T09:05:00' },
      { termName: '개인정보 수집·이용 동의 (필수)', agreed: true, agreedAt: '2024-05-23T09:05:03' },
      { termName: '마이데이터 서비스 이용 약관 (필수)', agreed: true, agreedAt: '2024-05-23T09:05:07' },
      { termName: '마케팅 정보 수신 동의 (선택)', agreed: true, agreedAt: '2024-05-23T09:05:10' },
    ],
    systemCollectedData: {
      annualIncome: 9200,
      existingLoanCount: 3,
      monthlyRevenue: 1200,
      monthlyRevenueGrowthRate: -2.1,
      cashFlow: 450,
      accountBalance: 3200,
      businessAgeMonths: 35,
      vatFilingStatus: 'PENDING',
      taxOverdue: false,
      insurancePaymentStatus: 'PAID',
      industrySalesRank: 32.5,
      industryProfitRank: 28.1,
    },
    cbScore: 680,
    sGrade: 'S5',
    scbScore: 720,
    bonusPoints: 40,
    shapResult: {
      grade: 'S5',
      targetGrade: 'S4',
      strengthKeywords: ['기술 인력 비율', '특허 보유 건수', 'R&D 투자 비율'],
      improvementKeywords: ['업력 대비 매출 안정성', '현금흐름 변동성'],
      strengthDetails: [
        { featureName: '기술 인력 비율', shapValue: 0.38921 },
        { featureName: '특허 보유 건수', shapValue: 0.31245 },
        { featureName: 'R&D 투자 비율', shapValue: 0.27834 },
        { featureName: '정부 과제 수행 이력', shapValue: 0.19567 },
        { featureName: '고객사 다변화 지수', shapValue: 0.15234 },
      ],
      improvementDetails: [
        { featureName: '현금흐름 변동성', shapValue: -0.31245 },
        { featureName: '업력(개월)', shapValue: -0.22134 },
        { featureName: '매출 집중도(상위 고객 비율)', shapValue: -0.15678 },
        { featureName: '부채비율', shapValue: -0.09823 },
        { featureName: '인건비 대비 매출 비율', shapValue: -0.07456 },
      ],
      advice:
        '• 기술 인력 비율과 R&D 투자가 높아 기술 경쟁력이 우수한 기업입니다.\n• 특허 보유와 정부 과제 수행 이력이 사업 안정성을 뒷받침합니다.\n• 현금흐름 변동성이 높으니 매출 수금 주기를 단축하는 방안을 검토해보세요.\n• 매출 집중도를 낮추기 위해 신규 고객 확보 전략을 수립하시길 권장합니다.',
    },
  },
  {
    id: 3,
    applicationDate: '2024-05-22',
    reviewStatus: 'APPROVED',
    assigneeName: '김은행',
    productInfo: {
      productName: '소상공인 운전자금 대출',
      minAmount: 300,
      maxAmount: 5000,
      minInterestRate: 4.0,
      maxInterestRate: 9.0,
      minTermMonths: 6,
      maxTermMonths: 36,
      availableRepaymentMethods: ['EQUAL_PRINCIPAL_INTEREST', 'BULLET'],
      availablePurposes: ['WORKING_CAPITAL'],
    },
    customerInfo: {
      name: '최상호',
      residentNumber: '7808083456789',
      phoneNumber: '01055556666',
      registeredAt: '2023-06-10T11:00:00',
      loginId: 'sangho_choi',
    },
    businessInfo: {
      businessName: '상호푸드',
      businessNumber: '3456789012',
      industry: '음식점업',
      businessType: '한식 전문점',
      address: '부산광역시 해운대구 해운대로 789',
      startDate: '2015-09-20',
    },
    applicationCondition: {
      desiredAmount: 3000,
      loanTermMonths: 24,
      repaymentMethod: 'BULLET',
      purpose: 'WORKING_CAPITAL',
    },
    applicantInput: {
      annualIncome: 6000,
      creditScore: 810,
      incomeType: 'BUSINESS',
      existingLoanAmount: 1000,
    },
    termsAgreements: [
      { termName: '대출 이용 약관 (필수)', agreed: true, agreedAt: '2024-05-22T14:30:00' },
      { termName: '개인정보 수집·이용 동의 (필수)', agreed: true, agreedAt: '2024-05-22T14:30:04' },
      { termName: '마이데이터 서비스 이용 약관 (필수)', agreed: true, agreedAt: '2024-05-22T14:30:08' },
      { termName: '마케팅 정보 수신 동의 (선택)', agreed: false, agreedAt: null },
    ],
    systemCollectedData: {
      annualIncome: 6500,
      existingLoanCount: 1,
      monthlyRevenue: 980,
      monthlyRevenueGrowthRate: 8.7,
      cashFlow: 520,
      accountBalance: 2800,
      businessAgeMonths: 104,
      vatFilingStatus: 'FILED',
      taxOverdue: false,
      insurancePaymentStatus: 'PAID',
      industrySalesRank: 8.5,
      industryProfitRank: 12.3,
    },
    cbScore: 810,
    sGrade: 'S2',
    scbScore: 880,
    bonusPoints: 70,
    shapResult: {
      grade: 'S2',
      targetGrade: 'S1',
      strengthKeywords: ['업력 안정성', '매출 성장률', '업종 내 상위 포지션'],
      improvementKeywords: ['디지털 전환 지수', '온라인 채널 활용도'],
      strengthDetails: [
        { featureName: '업력(개월)', shapValue: 0.52134 },
        { featureName: '매출 성장률(연간)', shapValue: 0.43567 },
        { featureName: '업종 내 매출 순위', shapValue: 0.38912 },
        { featureName: '현금흐름 안정성', shapValue: 0.31245 },
        { featureName: '세금 납부 이력', shapValue: 0.24567 },
      ],
      improvementDetails: [
        { featureName: '온라인 채널 매출 비율', shapValue: -0.18923 },
        { featureName: '디지털 마케팅 활동 지수', shapValue: -0.14567 },
        { featureName: '배달앱 등록 여부', shapValue: -0.09234 },
        { featureName: '홈페이지 운영 여부', shapValue: -0.06789 },
        { featureName: 'SNS 활동 빈도', shapValue: -0.04123 },
      ],
      advice:
        '• 9년 가까운 업력과 안정적인 매출 성장으로 사업 안정성이 매우 높습니다.\n• 업종 내 매출 상위 8.5%에 위치하여 시장 경쟁력이 뛰어납니다.\n• 온라인 채널 활용도를 높이면 추가 매출 성장이 기대됩니다.\n• 배달앱 입점이나 자체 홈페이지 구축을 통해 디지털 전환을 추진해보세요.',
    },
  },
  {
    id: 7,
    applicationDate: '2024-05-21',
    reviewStatus: 'REJECTED',
    assigneeName: '김은행',
    rejectionComment: '신용등급 기준 미달 및 기존 대출 과다로 추가 대출이 어렵습니다. 부채 비율 개선 후 재신청을 권장합니다.',
    productInfo: {
      productName: '시설자금 대출',
      minAmount: 500,
      maxAmount: 8000,
      minInterestRate: 3.5,
      maxInterestRate: 8.5,
      minTermMonths: 12,
      maxTermMonths: 60,
      availableRepaymentMethods: ['EQUAL_PRINCIPAL_INTEREST', 'EQUAL_PRINCIPAL'],
      availablePurposes: ['FACILITY'],
    },
    customerInfo: {
      name: '김도현',
      residentNumber: '8811154567890',
      phoneNumber: '01033334444',
      registeredAt: '2023-09-05T10:00:00',
      loginId: 'dohyun_kim88',
    },
    businessInfo: {
      businessName: '도현건설',
      businessNumber: '4567890123',
      industry: '건설업',
      businessType: '인테리어 시공',
      address: '서울특별시 마포구 홍익로 45, 3층',
      startDate: '2020-04-10',
    },
    applicationCondition: {
      desiredAmount: 6000,
      loanTermMonths: 48,
      repaymentMethod: 'EQUAL_PRINCIPAL_INTEREST',
      purpose: 'FACILITY',
    },
    applicantInput: {
      annualIncome: 3800,
      creditScore: 580,
      incomeType: 'BUSINESS',
      existingLoanAmount: 8500,
    },
    termsAgreements: [
      { termName: '대출 이용 약관 (필수)', agreed: true, agreedAt: '2024-05-21T11:20:00' },
      { termName: '개인정보 수집·이용 동의 (필수)', agreed: true, agreedAt: '2024-05-21T11:20:04' },
      { termName: '마이데이터 서비스 이용 약관 (필수)', agreed: true, agreedAt: '2024-05-21T11:20:08' },
      { termName: '마케팅 정보 수신 동의 (선택)', agreed: false, agreedAt: null },
    ],
    systemCollectedData: {
      annualIncome: 4100,
      existingLoanCount: 5,
      monthlyRevenue: 620,
      monthlyRevenueGrowthRate: -4.2,
      cashFlow: 85,
      accountBalance: 420,
      businessAgeMonths: 49,
      vatFilingStatus: 'PENDING',
      taxOverdue: true,
      insurancePaymentStatus: 'OVERDUE',
      industrySalesRank: 68.3,
      industryProfitRank: 72.1,
    },
    cbScore: 580,
    sGrade: 'S8',
    scbScore: 600,
    bonusPoints: 20,
    shapResult: {
      grade: 'S8',
      targetGrade: 'S7',
      strengthKeywords: ['사업 지속성', '고정 거래처 보유'],
      improvementKeywords: ['현금흐름 부족', '부채 비율 과다', '세금 체납'],
      strengthDetails: [
        { featureName: '업력(개월)', shapValue: 0.18234 },
        { featureName: '고정 거래처 수', shapValue: 0.12456 },
        { featureName: '사업자등록 유지 기간', shapValue: 0.09123 },
        { featureName: '월 평균 카드 결제 건수', shapValue: 0.07234 },
        { featureName: '업종 내 생존율', shapValue: 0.05678 },
      ],
      improvementDetails: [
        { featureName: '부채비율', shapValue: -0.48923 },
        { featureName: '현금흐름', shapValue: -0.38456 },
        { featureName: '세금 납부 이력', shapValue: -0.29134 },
        { featureName: '매출 성장률(연간)', shapValue: -0.21567 },
        { featureName: '보험료 납부 이력', shapValue: -0.15234 },
      ],
      advice:
        '• 부채 비율이 매우 높아 추가 대출 상환 능력에 우려가 있습니다.\n• 현금흐름이 낮아 월 상환금 부담이 클 수 있습니다.\n• 세금 및 보험료 체납 이력이 신용도에 부정적 영향을 미치고 있습니다.\n• 기존 대출 일부 상환 후 부채 비율을 낮추고 재신청하시길 권장합니다.',
    },
  },
];

// ─── Mock 추천값 데이터 ───────────────────────────────────────────

const MOCK_RECOMMENDATIONS: Record<number, RecommendationData> = {
  1: {
    approvedAmount: 4500,
    interestRate: 4.5,
    loanTermMonths: 36,
    repaymentMethod: 'EQUAL_PRINCIPAL_INTEREST',
  },
  2: {
    approvedAmount: 8000,
    interestRate: 5.2,
    loanTermMonths: 48,
    repaymentMethod: 'EQUAL_PRINCIPAL',
  },
  3: {
    approvedAmount: 3000,
    interestRate: 3.8,
    loanTermMonths: 24,
    repaymentMethod: 'BULLET',
  },
};

// ─── Mock 지점장 결재 목록 데이터 ───────────────────────────────────

const MOCK_MANAGER_APPROVALS: ManagerApprovalItem[] = [
  {
    id: 2,
    applicationDate: '2024-05-23',
    applicantName: '박지은',
    businessName: '지은테크',
    requestedByName: '이담당',
    desiredAmount: 10000,
  },
  {
    id: 4,
    applicationDate: '2024-05-23',
    applicantName: '장유진',
    businessName: '유진상사',
    requestedByName: '김은행',
    desiredAmount: 7000,
  },
  {
    id: 10,
    applicationDate: '2024-05-20',
    applicantName: '장미영',
    businessName: '미영식품',
    requestedByName: '김은행',
    desiredAmount: 4500,
  },
];

// ─── 공개 함수 ───────────────────────────────────────────────────

/**
 * 신청 건 ID로 대출 상세 데이터를 반환합니다.
 * 존재하지 않는 ID인 경우 undefined를 반환합니다.
 */
export function getMockLoanDetail(id: number): LoanDetailData | undefined {
  return MOCK_LOAN_DETAILS.find((item) => item.id === id);
}

/**
 * 신청 건 ID에 대한 시스템 추천값을 반환합니다.
 */
export function getMockRecommendation(id: number): RecommendationData {
  return (
    MOCK_RECOMMENDATIONS[id] ?? {
      approvedAmount: 0,
      interestRate: 0,
      loanTermMonths: 0,
      repaymentMethod: 'EQUAL_PRINCIPAL_INTEREST',
    }
  );
}

/**
 * MANAGER_REVIEW 상태인 건 목록을 반환합니다.
 */
export function getMockManagerApprovals(): ManagerApprovalItem[] {
  return MOCK_MANAGER_APPROVALS;
}

/**
 * 신청 건 ID에 대한 SHAP 분석 결과를 반환합니다.
 * 존재하지 않는 ID인 경우 undefined를 반환합니다.
 */
export function getMockShapResult(id: number): ShapResult | undefined {
  const detail = MOCK_LOAN_DETAILS.find((item) => item.id === id);
  return detail?.shapResult ?? undefined;
}
