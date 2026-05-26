# Requirements Document

## Introduction

admin-front 앱의 대출 신청 상세 페이지를 구현합니다. ADMIN_BANK_TELLER(은행원)과 ADMIN_BANK_MANAGER(지점장)가 대출 신청 건의 상세 정보를 확인하고, 심사 결정(승인/거절)을 처리하며, 필요 시 지점장에게 추가 결재를 요청할 수 있는 페이지입니다. 또한 지점장 전용 결재 화면에서 추가 결재 요청된 건을 승인/거절 처리할 수 있습니다. CB 신용점수, 성장S등급, SCB 점수를 시각적으로 표시하고, SHAP 기반 특성 영향력 차트와 LLM 자연어 해석을 제공하여 은행원의 심사 판단을 지원합니다.

## Glossary

- **Loan_Detail_Page**: 대출 신청 상세 페이지 컴포넌트. `/loan/:id` 경로에 매핑된 은행원용 심사 화면
- **Manager_Approval_Page**: 지점장 결재 페이지 컴포넌트. `/manager-approval` 경로에 매핑된 지점장 전용 결재 화면
- **Customer_Info_Card**: 고객 기본 정보 카드 컴포넌트. 이름, 주민번호(마스킹), 연락처, 가입일시, 아이디를 표시
- **Business_Info_Card**: 사업자 정보 카드 컴포넌트. 사업자명, 사업자등록번호, 업종, 업태, 사업장 주소, 사업 개시일을 표시
- **Applicant_Input_Card**: 신청자 입력 정보 카드 컴포넌트. 사용자가 직접 입력/선택한 정보(연 소득, 신용점수, 소득 종류, 보유 대출액)를 표시. 심사에 직접적 영향이 적은 참고 정보
- **Application_Condition_Card**: 신청 조건 카드 컴포넌트. 희망 대출 금액, 대출 기간, 상환 방식, 자금 용도를 표시
- **System_Collected_Card**: 시스템 수집 정보(마이비즈데이터) 카드 컴포넌트. 전체 너비 카드로 내부를 재무 현황(annual_income, existing_loan_count, monthly_revenue, monthly_revenue_growth_rate, cash_flow, account_balance), 운영 신뢰도(business_age_months, vat_filing_status, tax_overdue, insurance_payment_status), 시장 포지션(industry_sales_rank, industry_profit_rank) 3개 섹션으로 구성
- **CB_Score_Card**: CB 신용점수 표시 카드. "820점/1000점" 형태로 점수를 시각적으로 표시
- **S_Grade_Card**: 성장S등급 표시 카드. S1~S10 등급을 시각적 게이지로 표시
- **SCB_Score_Card**: SCB 점수 표시 카드. CB 점수 + 성장S등급 가산점을 게이지 바 형태로 표시
- **SHAP_Explanation**: SHAP 기반 설명 영역. 등급 정보, 강점/개선 키워드, 강점/개선 상세(바 차트), AI 조언을 포함
- **SHAP_Result**: SHAP 분석 결과 데이터. grade(현재 등급), target_grade(목표 등급), strength_keywords(강점 키워드 배열), improvement_keywords(개선 키워드 배열), strength_details(강점 특성명-SHAP값 쌍), improvement_details(개선 특성명-SHAP값 쌍), advice(AI 조언 텍스트)를 포함
- **Approval_Modal**: 대출 승인 모달. 시스템 추천값(승인 금액, 확정 금리, 확정 기간, 상환 방식)을 GET API로 조회하여 초기값으로 표시하고, 은행원이 수정 가능. 의견 입력 칸 포함
- **Rejection_Modal**: 대출 거절 모달. 거절 사유와 의견을 입력받아 거절 처리
- **Escalation_Request**: 추가 결재 요청. 은행원이 지점장에게 결재를 요청하는 액션. 의견 입력 칸 포함
- **Review_Status**: 대출 심사 상태. UNDER_REVIEW(심사 중), MANAGER_REVIEW(추가 심사 중), APPROVED(승인 완료), REJECTED(거절 완료) 중 하나
- **SCB_Score**: CB 점수에 성장S등급 가산점이 반영된 최종 점수

## Requirements

### Requirement 1: 상세 페이지 헤더 및 기본 정보 표시

**User Story:** As a 은행원, I want 대출 신청 상세 페이지 진입 시 신청 건의 기본 식별 정보를 확인하고 싶다, so that 어떤 신청 건을 심사하고 있는지 즉시 파악할 수 있다.

#### Acceptance Criteria

1. WHEN 사용자가 `/loan/:id` 경로에 진입하면, THE Loan_Detail_Page SHALL 상단 영역에 신청일(YYYY-MM-DD 형식), 신청자명, 사업자명을 표시한다
2. WHEN 사용자가 `/loan/:id` 경로에 진입하면, THE Loan_Detail_Page SHALL 상단 영역에 현재 심사 상태를 Status_Badge로 표시한다
3. WHEN 사용자가 `/loan/:id` 경로에 진입하면, THE Loan_Detail_Page SHALL 상단 우측에 "대출 승인", "대출 거절", "추가 결재 요청" 액션 버튼을 표시한다
4. WHILE Review_Status가 APPROVED 또는 REJECTED이면, THE Loan_Detail_Page SHALL "대출 승인", "대출 거절", "추가 결재 요청" 버튼을 비활성화(disabled) 상태로 표시한다
5. WHILE Review_Status가 MANAGER_REVIEW이면, THE Loan_Detail_Page SHALL "추가 결재 요청" 버튼을 비활성화(disabled) 상태로 표시하고, "대출 승인"과 "대출 거절" 버튼은 활성 상태를 유지한다
6. IF 대출 신청 상세 데이터 조회 API 호출이 실패하면, THEN THE Loan_Detail_Page SHALL 데이터를 불러올 수 없음을 나타내는 에러 메시지를 표시하고, 재시도 버튼을 제공한다
7. IF URL 파라미터 `:id`에 해당하는 대출 신청 건이 존재하지 않으면, THEN THE Loan_Detail_Page SHALL 해당 신청 건을 찾을 수 없음을 나타내는 안내 메시지를 표시하고, 목록 페이지로 돌아갈 수 있는 링크를 제공한다

### Requirement 2: 고객 기본 정보 카드 표시

**User Story:** As a 은행원, I want 신청자의 기본 개인 정보를 확인하고 싶다, so that 신청자의 신원을 파악하고 심사에 참고할 수 있다.

#### Acceptance Criteria

1. THE Customer_Info_Card SHALL 이름, 주민번호, 연락처, 가입일시, 아이디 항목을 각각 라벨과 값을 수평 방향으로 나란히 배치한 라벨-값 쌍으로 표시하며, 5개 항목을 수직으로 나열한다
2. THE Customer_Info_Card SHALL 주민번호를 앞 6자리와 뒷자리 첫 1자리만 노출하고 나머지를 마스킹("******") 처리하여 "YYMMDD-N******" 형식으로 표시한다
3. THE Customer_Info_Card SHALL 연락처를 "010-XXXX-XXXX" 형식으로 표시한다
4. THE Customer_Info_Card SHALL 가입일시를 "YYYY.MM.DD HH:mm" 형식으로 표시한다
5. IF 특정 항목의 값이 null 또는 빈 문자열이면, THEN THE Customer_Info_Card SHALL 해당 항목의 값 위치에 "-"(하이픈)을 표시한다

### Requirement 3: 사업자 정보 카드 표시

**User Story:** As a 은행원, I want 신청자의 사업자 정보를 확인하고 싶다, so that 사업 현황을 파악하여 대출 심사에 반영할 수 있다.

#### Acceptance Criteria

1. THE Business_Info_Card SHALL "사업자 정보" 제목을 카드 상단에 표시하고, 사업자명, 사업자등록번호, 업종, 업태, 사업장 주소, 사업 개시일 항목을 라벨-값 쌍으로 표시한다
2. THE Business_Info_Card SHALL 사업자등록번호를 "XXX-XX-XXXXX" 형식(3자리-2자리-5자리)으로 표시한다
3. THE Business_Info_Card SHALL 사업 개시일을 "YYYY.MM.DD" 형식으로 표시한다
4. IF 사업자 정보의 특정 항목 값이 존재하지 않으면, THEN THE Business_Info_Card SHALL 해당 항목의 값 영역에 "-"을 표시한다

### Requirement 4: 신청 조건 카드 표시

**User Story:** As a 은행원, I want 신청자의 희망 대출 조건을 확인하고 싶다, so that 신청자가 원하는 대출 조건을 파악하여 심사 판단에 활용할 수 있다.

#### Acceptance Criteria

1. THE Application_Condition_Card SHALL "신청 조건" 제목을 카드 상단에 표시하고, 희망 대출 금액, 대출 기간, 상환 방식, 자금 용도 항목을 라벨-값 쌍으로 표시한다
2. THE Application_Condition_Card SHALL 희망 대출 금액을 천 단위 콤마가 포함된 원화 형식("N,NNN만원")으로 표시한다
3. THE Application_Condition_Card SHALL 대출 기간을 "N개월" 형식으로 표시한다
4. THE Application_Condition_Card SHALL 상환 방식을 ENUM 값에 대응하는 한글 라벨(원리금균등, 원금균등, 만기일시)로 표시한다
5. IF 특정 항목의 값이 존재하지 않으면, THEN THE Application_Condition_Card SHALL 해당 항목의 값 영역에 "-"을 표시한다

### Requirement 5: 신청자 입력 정보 카드 표시

**User Story:** As a 은행원, I want 신청자가 직접 입력한 참고 정보를 별도로 확인하고 싶다, so that 사용자 자기 신고 정보와 시스템 수집 정보를 구분하여 심사 신뢰도를 판단할 수 있다.

#### Acceptance Criteria

1. THE Applicant_Input_Card SHALL "신청자 입력 정보" 제목을 카드 상단에 표시하고, 연 소득, 신용점수, 소득 종류, 보유 대출액 항목을 라벨-값 쌍으로 표시한다
2. THE Applicant_Input_Card SHALL 카드 상단 또는 제목 옆에 "사용자 직접 입력" 표시를 하여 시스템 수집 정보와 구분한다
3. THE Applicant_Input_Card SHALL 연 소득과 보유 대출액을 천 단위 콤마가 포함된 원화 형식("N,NNN만원")으로 표시한다
4. THE Applicant_Input_Card SHALL 신용점수를 "N점" 형식으로 표시한다
5. THE Applicant_Input_Card SHALL 소득 종류를 ENUM 값에 대응하는 한글 라벨(근로소득, 사업소득, 기타소득 등)로 표시한다
6. IF 특정 항목의 값이 존재하지 않으면, THEN THE Applicant_Input_Card SHALL 해당 항목의 값 영역에 "-"을 표시한다

### Requirement 6: 시스템 수집 정보(마이비즈데이터) 카드 표시

**User Story:** As a 은행원, I want 마이데이터(My Biz Data)를 통해 시스템이 자동 수집한 사업 현황 전반을 확인하고 싶다, so that 객관적으로 검증된 재무·운영·시장 데이터를 기반으로 심사 판단을 내릴 수 있다.

#### Acceptance Criteria

1. THE System_Collected_Card SHALL 전체 너비 카드로 표시하며, 카드 헤더에 "시스템 수집 정보" 제목과 "마이데이터 연동" 배지를 표시한다
2. THE System_Collected_Card SHALL 카드 내부를 "재무 현황", "운영 신뢰도", "시장 포지션" 3개 섹션으로 가로 배치하여 구성한다
3. THE System_Collected_Card SHALL 재무 현황 섹션에 annual_income(연 소득, "N,NNN만원"), existing_loan_count(보유 대출 건수, "N건"), monthly_revenue(월 매출액, "N,NNN만원"), monthly_revenue_growth_rate(전월 대비 증감률), cash_flow(현금흐름, "N,NNN만원"), account_balance(계좌 잔액, "N,NNN만원") 항목을 라벨-값 그리드로 표시한다
4. THE System_Collected_Card SHALL monthly_revenue_growth_rate를 양수일 때 파란색 "+N.N%" 형식으로, 음수일 때 빨간색 "-N.N%" 형식으로 표시한다
5. THE System_Collected_Card SHALL 운영 신뢰도 섹션에 business_age_months(업력, "N년 N개월"), vat_filing_status(부가세 신고 상태), tax_overdue(세금 체납 여부), insurance_payment_status(4대보험 납부 상태) 항목을 라벨-값 그리드로 표시한다
6. THE System_Collected_Card SHALL vat_filing_status를 FILED일 때 초록색 뱃지, PENDING일 때 노란색 뱃지, OVERDUE일 때 빨간색 경고 뱃지로 표시한다
7. THE System_Collected_Card SHALL tax_overdue가 true이면 빨간색 경고 뱃지("체납")로, false이면 "없음" 텍스트로 표시한다
8. THE System_Collected_Card SHALL insurance_payment_status를 PAID일 때 초록색 뱃지, PENDING일 때 노란색 뱃지, OVERDUE일 때 빨간색 경고 뱃지로 표시한다
9. THE System_Collected_Card SHALL 시장 포지션 섹션에 industry_sales_rank(업종 내 매출 상위 %, "상위 N.N%"), industry_profit_rank(업종 내 수익성 상위 %, "상위 N.N%") 항목을 라벨-값 그리드로 표시한다
10. THE System_Collected_Card SHALL vat_filing_status OVERDUE, tax_overdue true, insurance_payment_status OVERDUE 항목을 빨간색 경고 뱃지로 강조하여 은행원이 즉시 인지할 수 있도록 한다
11. IF 마이데이터 연동이 되지 않은 경우(데이터 null), THEN THE System_Collected_Card SHALL 카드 전체에 "마이데이터 미연동" 안내 메시지를 표시한다
12. IF 특정 항목의 값이 null이면, THEN THE System_Collected_Card SHALL 해당 항목의 값 영역에 "-"을 표시한다

### Requirement 7: CB 신용점수 표시

**User Story:** As a 은행원, I want CB사에서 제공한 신용점수를 확인하고 싶다, so that 신청자의 기본 신용도를 파악할 수 있다.

#### Acceptance Criteria

1. THE CB_Score_Card SHALL "CB 신용점수" 라벨을 카드 상단에 표시한다
2. THE CB_Score_Card SHALL CB 신용점수를 "N점/1000점" 형식으로 표시한다
3. THE CB_Score_Card SHALL 0~1000 범위를 기준으로 현재 점수의 비율(점수/1000)을 반영하는 시각적 게이지를 표시한다
4. IF CB 신용점수 데이터가 존재하지 않거나 null이면, THEN THE CB_Score_Card SHALL 점수 영역에 "점수 정보 없음"을 표시하고 게이지를 0% 상태로 표시한다

### Requirement 8: 성장S등급 표시

**User Story:** As a 은행원, I want ML 모델이 산출한 성장S등급을 확인하고 싶다, so that 소상공인의 성장 가능성을 심사에 반영할 수 있다.

#### Acceptance Criteria

1. THE S_Grade_Card SHALL "성장S등급" 라벨을 카드 상단에 표시한다
2. THE S_Grade_Card SHALL 현재 등급을 "S{N}" 형식(예: "S3")의 텍스트로 표시하고, S1~S10 전체 등급을 수평 스케일로 나열하여 현재 등급 위치를 나타낸다
3. THE S_Grade_Card SHALL 수평 스케일에서 왼쪽을 S1(최고 등급), 오른쪽을 S10(최저 등급)으로 배치하여 등급 순서를 나타낸다
4. THE S_Grade_Card SHALL 현재 등급에 해당하는 스케일 항목의 배경색 또는 크기를 다른 항목과 다르게 적용하여 시각적으로 구분한다
5. IF 성장S등급 데이터가 아직 산출되지 않은 경우(null), THEN THE S_Grade_Card SHALL 등급 스케일 대신 "성장S등급이 아직 산출되지 않았습니다" 안내 메시지를 표시한다

### Requirement 9: SCB 점수 표시

**User Story:** As a 은행원, I want CB 점수에 성장S등급 가산점이 반영된 SCB 점수를 확인하고 싶다, so that 최종 신용 평가 점수를 기반으로 심사 판단을 내릴 수 있다.

#### Acceptance Criteria

1. THE SCB_Score_Card SHALL SCB 점수를 "N점/1000점" 형식으로 표시한다
2. THE SCB_Score_Card SHALL SCB 점수를 0~1000 범위의 수평 게이지 바 형태로 시각화하며, 점수 위치에 비례하여 게이지를 채워 표시한다
3. THE SCB_Score_Card SHALL "SCB 점수" 라벨과 함께 "가산 반영" 표시를 카드 상단에 표시한다
4. THE SCB_Score_Card SHALL 게이지 바에서 CB 점수까지의 영역과 가산점이 추가된 영역을 서로 다른 색상으로 구분하여 표시한다
5. THE SCB_Score_Card SHALL 적용된 성장S등급과 가산점 수치를 "S{N} 등급 가산 +{점수}점 반영" 형식의 주석으로 표시한다

### Requirement 10: SHAP 분석 결과 표시

**User Story:** As a 은행원, I want 성장S등급 산출에 기여한 강점과 개선점을 확인하고 싶다, so that 등급 산출 근거를 이해하고 심사 판단에 활용할 수 있다.

#### Acceptance Criteria

1. THE SHAP_Explanation SHALL 왼쪽 영역 상단에 현재 등급(grade)을 "S{N}" 형식으로, 목표 등급(target_grade)을 "목표: S{N}" 형식으로 표시한다
2. THE SHAP_Explanation SHALL 강점 키워드(strength_keywords)를 태그 형태로 나열하고, 개선 키워드(improvement_keywords)를 별도 태그 형태로 나열하여 한눈에 파악할 수 있도록 한다
3. THE SHAP_Explanation SHALL 왼쪽 영역에 강점 상세(strength_details)를 양수 SHAP 값의 수평 바 차트로 표시하며, 파란색 계열 바로 표현한다
4. THE SHAP_Explanation SHALL 왼쪽 영역에 개선 상세(improvement_details)를 음수 SHAP 값의 수평 바 차트로 표시하며, 빨간색 계열 바로 표현한다
5. THE SHAP_Explanation SHALL 각 바 차트 항목에 특성명을 바 왼쪽에, 영향력 수치를 소수점 이하 4자리까지 바 오른쪽에 표시한다
6. THE SHAP_Explanation SHALL 강점 상세와 개선 상세 각각을 영향력 크기 순서(절대값 기준 내림차순)로 정렬하여 표시한다
7. THE SHAP_Explanation SHALL 특성명이 20자를 초과하는 경우 말줄임(...) 처리하고 마우스 호버 시 전체 이름을 툴팁으로 표시한다
8. IF 해당 신청 건에 대한 SHAP 데이터가 존재하지 않으면, THEN THE SHAP_Explanation SHALL 바 차트 영역에 "SHAP 분석 데이터가 아직 생성되지 않았습니다." 안내 메시지를 표시한다

### Requirement 11: AI 조언 및 자연어 해석 표시

**User Story:** As a 은행원, I want SHAP 결과를 자연어로 해석한 AI 조언을 확인하고 싶다, so that 기술적 수치를 쉽게 이해하고 심사 보고서 작성에 활용할 수 있다.

#### Acceptance Criteria

1. THE SHAP_Explanation SHALL 오른쪽 영역에 SHAP_Result의 advice 필드에 담긴 AI 조언 텍스트를 표시한다
2. THE SHAP_Explanation SHALL AI 조언을 "•" 기호로 구분된 항목별 단락 형태로 표시하며, 각 항목 사이에 시각적 간격을 둔다
3. THE SHAP_Explanation SHALL "AI 분석 요약" 라벨을 오른쪽 영역 상단에 표시한다
4. WHILE SHAP 데이터를 로딩 중이면, THE SHAP_Explanation SHALL 로딩 스피너를 해당 영역에 표시한다
5. IF advice 데이터가 존재하지 않거나 빈 문자열이면, THEN THE SHAP_Explanation SHALL 오른쪽 영역에 "AI 분석 요약이 아직 준비되지 않았습니다." 안내 메시지를 표시한다
6. IF SHAP 데이터 조회 중 오류가 발생하면, THEN THE SHAP_Explanation SHALL 오류 메시지와 "다시 시도" 버튼을 해당 영역에 표시한다

### Requirement 12: 대출 승인 처리

**User Story:** As a 은행원, I want 대출 신청 건을 승인 처리하고 싶다, so that 적합한 조건으로 대출을 실행할 수 있다.

#### Acceptance Criteria

1. WHEN 사용자가 "대출 승인" 버튼을 클릭하면, THE Loan_Detail_Page SHALL Approval_Modal을 표시한다
2. WHEN Approval_Modal이 표시되면, THE Approval_Modal SHALL 시스템 추천값 조회 API(GET)를 호출하여 승인 금액, 확정 금리(%), 확정 기간(개월), 상환 방식의 추천값을 각 입력 필드의 초기값으로 설정하여 표시한다
3. THE Approval_Modal SHALL 승인 금액(원, 정수), 확정 금리(%, 소수점 둘째 자리까지), 확정 기간(개월, 정수), 상환 방식(원리금균등, 원금균등, 만기일시 중 선택) 입력 필드를 수정 가능한 상태로 표시한다
4. THE Approval_Modal SHALL 의견 입력 필드(텍스트 영역, 최대 500자)를 표시하여 은행원이 승인 사유나 참고 의견을 기록할 수 있도록 한다
5. WHILE Approval_Modal의 필수 입력 필드(승인 금액, 확정 금리, 확정 기간, 상환 방식) 중 하나라도 비어 있거나 유효 범위를 벗어나면, THE Approval_Modal SHALL "승인" 확인 버튼을 비활성화 상태로 표시한다
6. WHEN 사용자가 모든 필수 필드를 유효하게 입력하고 "승인" 확인 버튼을 클릭하면, THE Approval_Modal SHALL "승인" 확인 버튼을 로딩 상태로 전환하고 승인 API를 호출하여 해당 신청 건의 상태를 APPROVED로 변경한다
7. WHEN 승인 API 호출이 성공하면, THE Loan_Detail_Page SHALL 모달을 닫고 상세 페이지의 심사 상태를 APPROVED로 갱신하여 표시한다
8. IF 승인 API 호출이 실패하면, THEN THE Approval_Modal SHALL 오류 메시지를 모달 내부에 표시하고 "승인" 확인 버튼을 다시 활성화 상태로 복원하며 모달을 유지한다
9. IF 시스템 추천값 조회 API가 실패하면, THEN THE Approval_Modal SHALL 입력 필드를 빈 상태로 표시하고 "추천값을 불러올 수 없습니다" 안내 메시지를 표시한다
10. THE Approval_Modal SHALL 승인 금액은 10만 원 이상 10억 원 이하의 정수, 확정 금리는 0.01% 이상 20.00% 이하(소수점 둘째 자리까지), 확정 기간은 1개월 이상 360개월 이하의 정수만 유효한 입력으로 허용한다

### Requirement 13: 대출 거절 처리

**User Story:** As a 은행원, I want 대출 신청 건을 거절 처리하고 싶다, so that 부적합한 신청 건에 대해 사유를 기록하고 거절할 수 있다.

#### Acceptance Criteria

1. WHEN 사용자가 "대출 거절" 버튼을 클릭하면, THE Loan_Detail_Page SHALL Rejection_Modal을 표시한다
2. THE Rejection_Modal SHALL 거절 사유 텍스트 입력 필드를 최대 500자 제한으로 표시한다
3. THE Rejection_Modal SHALL 의견 입력 필드(텍스트 영역, 최대 500자)를 표시하여 은행원이 추가 의견이나 참고 사항을 기록할 수 있도록 한다
4. WHILE Rejection_Modal의 거절 사유 필드가 비어 있거나 공백 문자만 포함하고 있으면, THE Rejection_Modal SHALL "거절" 확인 버튼을 비활성화 상태로 표시한다
5. WHEN 사용자가 거절 사유를 입력하고 "거절" 확인 버튼을 클릭하면, THE Rejection_Modal SHALL "거절" 확인 버튼을 비활성화하고 거절 API를 호출하여 해당 신청 건의 상태를 REJECTED로 변경한다
6. WHEN 거절 API 호출이 성공하면, THE Loan_Detail_Page SHALL 모달을 닫고 상세 페이지의 심사 상태를 REJECTED로 갱신하여 표시한다
7. IF 거절 API 호출이 실패하면, THEN THE Rejection_Modal SHALL "거절" 확인 버튼을 다시 활성화하고, 거절 처리에 실패했음을 나타내는 오류 메시지를 모달 내부에 표시하며 사용자가 입력한 거절 사유와 의견을 유지한다
8. WHILE 해당 신청 건의 심사 상태가 APPROVED 또는 REJECTED이면, THE Loan_Detail_Page SHALL "대출 거절" 버튼을 비활성화 상태로 표시한다
9. WHEN 사용자가 Rejection_Modal의 닫기 또는 취소 버튼을 클릭하면, THE Rejection_Modal SHALL 모달을 닫고 입력된 거절 사유와 의견을 초기화한다

### Requirement 14: 추가 결재 요청

**User Story:** As a 은행원, I want 판단이 어려운 건에 대해 지점장에게 추가 결재를 요청하고 싶다, so that 상위 결재권자의 판단을 받아 심사를 진행할 수 있다.

#### Acceptance Criteria

1. WHEN 사용자가 "추가 결재 요청" 버튼을 클릭하면, THE Loan_Detail_Page SHALL "해당 건을 지점장에게 추가 결재 요청하시겠습니까?" 의미의 안내 문구와 의견 입력 필드(텍스트 영역, 최대 500자), "요청" 및 "취소" 버튼을 포함하는 확인 다이얼로그를 표시한다
2. WHEN 사용자가 확인 다이얼로그에서 "취소" 버튼을 클릭하면, THE Loan_Detail_Page SHALL 다이얼로그를 닫고 아무 상태 변경 없이 상세 페이지를 유지한다
3. WHEN 사용자가 확인 다이얼로그에서 "요청" 버튼을 클릭하면, THE Loan_Detail_Page SHALL "요청" 버튼을 비활성화하고 추가 결재 요청 API를 호출하여 해당 신청 건의 상태를 MANAGER_REVIEW로 변경하며, 입력된 의견을 함께 전송한다
4. WHEN 추가 결재 요청 API 호출이 성공하면, THE Loan_Detail_Page SHALL 다이얼로그를 닫고 상세 페이지의 심사 상태를 MANAGER_REVIEW로 갱신하여 표시한다
5. WHILE Review_Status가 MANAGER_REVIEW이면, THE Loan_Detail_Page SHALL "추가 결재 요청" 버튼을 비활성화 상태로 표시한다
6. IF 추가 결재 요청 API 호출이 실패하면, THEN THE Loan_Detail_Page SHALL 요청 실패를 나타내는 오류 메시지를 토스트 형태로 3초간 표시하고, 다이얼로그를 닫아 재시도할 수 있도록 한다

### Requirement 15: 지점장 결재 목록 표시

**User Story:** As a 지점장, I want 추가 결재 요청된 대출 신청 건 목록을 확인하고 싶다, so that 결재가 필요한 건을 파악하고 처리할 수 있다.

#### Acceptance Criteria

1. WHEN ADMIN_BANK_MANAGER 역할의 사용자가 `/manager-approval` 경로에 진입하면, THE Manager_Approval_Page SHALL MANAGER_REVIEW 상태인 대출 신청 건 목록을 신청일 기준 내림차순(최신순)으로 표시한다
2. WHILE 목록이 1건 이상 존재하면, THE Manager_Approval_Page SHALL 각 건에 대해 신청일, 신청자명, 사업자명, 요청 은행원명, 신청 금액을 테이블 형태로 표시한다
3. IF 추가 결재 요청된 건이 0건이면, THEN THE Manager_Approval_Page SHALL "결재 대기 중인 건이 없습니다." 메시지를 표시한다
4. THE Manager_Approval_Page SHALL 각 건에 대해 "상세보기" 버튼을 표시하여 해당 건의 상세 페이지(`/loan/:id`)로 이동할 수 있도록 한다
5. WHILE 목록 데이터를 서버에서 불러오는 중이면, THE Manager_Approval_Page SHALL 로딩 인디케이터를 표시한다
6. IF 목록 데이터 조회 중 서버 오류가 발생하면, THEN THE Manager_Approval_Page SHALL 오류 발생을 알리는 메시지와 "다시 시도" 버튼을 표시한다

### Requirement 16: 지점장 결재 승인/거절 처리

**User Story:** As a 지점장, I want 추가 결재 요청된 건을 승인 또는 거절 처리하고 싶다, so that 은행원의 심사 요청에 대해 최종 판단을 내릴 수 있다.

#### Acceptance Criteria

1. WHEN ADMIN_BANK_MANAGER 역할의 사용자가 MANAGER_REVIEW 상태인 건의 상세 페이지에 진입하면, THE Loan_Detail_Page SHALL "결재 승인"과 "결재 거절" 버튼을 표시한다
2. WHEN 지점장이 "결재 승인" 버튼을 클릭하면, THE Loan_Detail_Page SHALL Approval_Modal을 표시하여 승인 금액, 확정 금리(%), 확정 기간(개월), 상환 방식 입력 필드를 제공한다
3. WHILE Approval_Modal의 필수 입력 필드(승인 금액, 확정 금리, 확정 기간, 상환 방식) 중 하나라도 비어 있으면, THE Approval_Modal SHALL "승인" 확인 버튼을 비활성화 상태로 표시한다
4. WHEN 지점장이 모든 필수 필드를 입력하고 "승인" 확인 버튼을 클릭하면, THE Approval_Modal SHALL 결재 승인 API를 호출하여 해당 신청 건의 상태를 APPROVED로 변경한다
5. WHEN 지점장이 "결재 거절" 버튼을 클릭하면, THE Loan_Detail_Page SHALL Rejection_Modal을 표시하여 거절 사유 텍스트 입력 필드를 제공한다
6. WHILE Rejection_Modal의 거절 사유 필드가 비어 있으면, THE Rejection_Modal SHALL "거절" 확인 버튼을 비활성화 상태로 표시한다
7. WHEN 지점장이 거절 사유를 입력하고 "거절" 확인 버튼을 클릭하면, THE Rejection_Modal SHALL 결재 거절 API를 호출하여 해당 신청 건의 상태를 REJECTED로 변경한다
8. WHEN 결재 승인 또는 거절 API 호출이 성공하면, THE Loan_Detail_Page SHALL 모달을 닫고 상세 페이지의 심사 상태를 변경된 상태(APPROVED 또는 REJECTED)로 갱신하며, Manager_Approval_Page의 결재 목록 데이터를 무효화하여 해당 건이 목록에서 제거되도록 한다
9. IF 결재 승인 또는 거절 API 호출이 실패하면, THEN THE Loan_Detail_Page SHALL 오류 메시지를 모달 내부에 표시하고 모달을 유지하여 재시도할 수 있도록 한다

### Requirement 17: 상세 페이지 데이터 로딩 및 오류 처리

**User Story:** As a 은행원, I want 상세 페이지 데이터 로딩 상태와 오류를 인지하고 싶다, so that 시스템 상태를 파악하고 적절히 대응할 수 있다.

#### Acceptance Criteria

1. WHILE 대출 신청 상세 데이터를 로딩 중이면, THE Loan_Detail_Page SHALL 전체 콘텐츠 영역에 로딩 스피너를 표시하고, 다른 인터랙션 요소를 비활성화한다
2. IF 상세 데이터 조회 중 네트워크 오류 또는 서버 오류(5xx)가 발생하면, THEN THE Loan_Detail_Page SHALL 오류 원인을 나타내는 메시지와 "다시 시도" 버튼을 표시한다
3. WHEN 사용자가 "다시 시도" 버튼을 클릭하면, THE Loan_Detail_Page SHALL 로딩 스피너를 표시하며 상세 데이터를 다시 조회한다
4. IF 존재하지 않는 신청 건 ID로 접근하면(404 응답), THEN THE Loan_Detail_Page SHALL "해당 신청 건을 찾을 수 없습니다." 메시지와 목록 페이지로 돌아갈 수 있는 버튼을 표시한다
5. IF 데이터 로딩이 30초 이내에 완료되지 않으면, THEN THE Loan_Detail_Page SHALL 로딩을 중단하고 타임아웃 오류 메시지와 "다시 시도" 버튼을 표시한다

### Requirement 18: 페이지 레이아웃 구성

**User Story:** As a 은행원, I want 상세 정보가 체계적으로 배치된 화면을 보고 싶다, so that 필요한 정보를 빠르게 찾아 심사 효율을 높일 수 있다.

#### Acceptance Criteria

1. THE Loan_Detail_Page SHALL 고객 기본 정보, 사업자 정보, 신청 조건, 신청자 입력 정보를 동일 너비의 4열 카드 레이아웃으로 첫 번째 행에 배치한다
2. THE Loan_Detail_Page SHALL 시스템 수집 정보(마이비즈데이터) 카드를 전체 너비로 두 번째 행에 배치하며, 카드 내부는 재무 현황, 운영 신뢰도, 시장 포지션 3개 섹션을 가로로 배치한다
3. THE Loan_Detail_Page SHALL CB 신용점수, 성장S등급, SCB 점수를 동일 너비의 3열 카드 레이아웃으로 세 번째 행에 배치한다
4. THE Loan_Detail_Page SHALL SHAP 설명 영역을 전체 너비로 네 번째 행에 배치하며, 바 차트(왼쪽 50%)와 AI 조언(오른쪽 50%)을 2열로 구성한다
5. WHILE 화면 너비가 768px 미만이면, THE Loan_Detail_Page SHALL 모든 다열 카드 레이아웃을 1열로 변경하고, 시스템 수집 정보 카드 내부 3섹션도 세로로 쌓으며, SHAP 설명 영역의 2열 구성도 1열로 변경하여 바 차트를 상단에, AI 조언을 하단에 세로로 쌓아 표시한다
6. THE Loan_Detail_Page SHALL 각 행 사이에 16px 이상의 간격을 두어 행 간 시각적 구분을 제공한다

### Requirement 19: 권한 기반 접근 제어

**User Story:** As a 시스템 관리자, I want 역할에 따라 페이지 접근과 기능을 제한하고 싶다, so that 권한이 없는 사용자가 심사 기능에 접근하는 것을 방지할 수 있다.

#### Acceptance Criteria

1. THE Loan_Detail_Page SHALL ADMIN_DEV, ADMIN_BANK_TELLER, ADMIN_BANK_MANAGER 역할의 사용자만 접근을 허용한다
2. THE Manager_Approval_Page SHALL ADMIN_DEV, ADMIN_BANK_MANAGER 역할의 사용자만 접근을 허용한다
3. WHILE 사용자 역할이 ADMIN_BANK_TELLER이고 Review_Status가 UNDER_REVIEW이면, THE Loan_Detail_Page SHALL "대출 승인", "대출 거절", "추가 결재 요청" 버튼을 표시한다
4. WHILE 사용자 역할이 ADMIN_BANK_MANAGER이고 Review_Status가 MANAGER_REVIEW이면, THE Loan_Detail_Page SHALL "결재 승인", "결재 거절" 버튼을 표시한다
5. IF 허용되지 않은 역할의 사용자가 페이지에 접근하면, THEN THE System SHALL 403 Forbidden 페이지를 렌더링하고 대시보드 이동 및 이전 페이지 버튼을 제공한다
6. WHILE 사용자 역할이 ADMIN_DEV이면, THE Loan_Detail_Page SHALL 심사 처리 버튼("대출 승인", "대출 거절", "추가 결재 요청", "결재 승인", "결재 거절")을 표시하지 않는다
7. IF Review_Status가 APPROVED 또는 REJECTED이면, THEN THE Loan_Detail_Page SHALL 모든 역할의 사용자에게 심사 처리 버튼을 비활성화하거나 표시하지 않는다

### Requirement 20: 목 데이터 레이어 구성

**User Story:** As a 개발자, I want 상세 페이지용 목 데이터를 분리하여 관리하고 싶다, so that 실제 API 연동 시 목 데이터 모듈만 교체하면 된다.

#### Acceptance Criteria

1. THE Mock_Data_Layer SHALL `src/mocks` 디렉토리에 대출 신청 상세 데이터를 반환하는 함수를 export하며, 해당 함수는 신청 건 ID(number)를 매개변수로 받아 해당 건의 상세 데이터 객체를 반환하여 React Query의 queryFn에서 직접 호출할 수 있도록 제공한다
2. THE Mock_Data_Layer SHALL 상세 데이터 반환 시 고객 기본 정보(이름, 주민번호, 연락처, 가입일시, 아이디), 사업자 정보(사업자명, 사업자등록번호, 업종, 업태, 사업장 주소, 사업 개시일), 신청 조건(희망 대출 금액, 대출 기간, 상환 방식, 자금 용도), 신청자 입력 정보(연 소득, 신용점수, 소득 종류, 보유 대출액), 시스템 수집 정보(SystemCollectedData 인터페이스: annual_income, existing_loan_count, monthly_revenue, monthly_revenue_growth_rate, cash_flow, account_balance, business_age_months, vat_filing_status, tax_overdue, insurance_payment_status, industry_sales_rank, industry_profit_rank), CB 점수(0~1000 범위 정수), 성장S등급(S1~S10 중 하나), SCB 점수(0~1000 범위 정수), SHAP 결과(grade, target_grade, strength_keywords, improvement_keywords, strength_details, improvement_details, advice)를 포함하는 객체를 반환한다
3. THE Mock_Data_Layer SHALL `src/types`에 SystemCollectedData 인터페이스를 별도 정의하며, annual_income(number), existing_loan_count(number), monthly_revenue(number), monthly_revenue_growth_rate(number), cash_flow(number), account_balance(number), business_age_months(number), vat_filing_status('FILED' | 'PENDING' | 'OVERDUE'), tax_overdue(boolean), insurance_payment_status('PAID' | 'PENDING' | 'OVERDUE'), industry_sales_rank(number), industry_profit_rank(number) 필드를 포함한다
4. THE Mock_Data_Layer SHALL 시스템 추천값 조회 함수를 export하며, 해당 함수는 신청 건 ID를 매개변수로 받아 승인 금액, 확정 금리, 확정 기간, 상환 방식의 추천값 객체를 반환한다
5. THE Mock_Data_Layer SHALL 지점장 결재 목록용 함수를 export하며, 해당 함수는 MANAGER_REVIEW 상태인 건의 배열을 반환하고 각 항목은 신청 건 ID, 신청일, 신청자명, 사업자명, 요청 은행원명, 신청 금액을 포함한다
6. THE Mock_Data_Layer SHALL 반환하는 모든 데이터가 `src/types`에 정의된 TypeScript 인터페이스를 함수 반환 타입으로 명시하여, 컴파일 시점에 타입 불일치를 감지할 수 있도록 한다
7. IF 존재하지 않는 신청 건 ID가 상세 데이터 함수에 전달되면, THEN THE Mock_Data_Layer SHALL undefined를 반환한다
