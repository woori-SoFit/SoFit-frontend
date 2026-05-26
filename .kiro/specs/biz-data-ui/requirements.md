# Requirements Document

## Introduction

마이 비즈 데이터(My Biz Data) 페이지 UI를 user-front에 구현한다. 와이어프레임 기반 8개 화면을 구현하며, 기존 공통 컴포넌트(CustomerVerifyPage, TermsPage, TermsDetailSheet, LoadingScreen)를 최대한 재사용한다. 이번 작업은 UI 구현에 한정하며, 실제 API 호출 없이 mock 데이터만 사용한다.

## Glossary

- **BizDataPage**: 마이 비즈 데이터 메인 페이지 컴포넌트. 미연결 상태(소개)와 연결 완료 상태(대시보드)를 분기하여 렌더링한다.
- **BizDataCollectPage**: 마이 비즈 데이터 수집 흐름 페이지. step 기반으로 고객 인증 → 약관 동의 → 데이터 수집 로딩을 처리한다.
- **BizDataCollectStore**: BizDataCollectPage의 step 상태를 관리하는 Zustand 스토어.
- **LoadingScreen**: 항목별 진행 상태를 표시하는 공통 로딩 화면 컴포넌트.
- **CustomerVerifyPage**: 고객 정보 입력(이름, 주민등록번호, 휴대폰번호) + PIN 인증을 처리하는 공통 컴포넌트.
- **TermsPage**: 약관 동의 페이지 래퍼 컴포넌트. TermsAgreement + TermsDetailSheet + 하단 버튼을 조합한다.
- **TermsDetailSheet**: 약관 상세 내용을 Bottom Sheet로 표시하는 공통 컴포넌트.
- **Dashboard**: 마이 비즈 데이터 연결 완료 후 표시되는 통합 대시보드. 매출 요약, 업종 비교, 차트를 포함한다.
- **Mock_Data**: API 연동 전 UI 검증을 위한 더미 데이터. `mocks/bizData.ts`에서 관리한다.

## Requirements

### Requirement 1: 마이 비즈 데이터 소개 화면 (미연결 상태)

**User Story:** As a 소상공인 고객, I want to 마이 비즈 데이터 서비스의 혜택을 한눈에 확인하고 데이터 연결을 시작할 수 있다, so that 서비스 가치를 이해하고 연결 여부를 결정할 수 있다.

#### Acceptance Criteria

1. IF mock 데이터의 isConnected 플래그가 false이면, WHEN 사용자가 BizDataPage에 진입할 때, THE BizDataPage SHALL 서비스 소개 일러스트, 타이틀("내 사업의 모든 데이터를 한눈에 관리하세요"), 서브타이틀 텍스트, 그리고 3개 혜택 카드(다양한 데이터 연결 / 사업을 더 깊이 분석 / 금융 활용 기회 확대)를 표시한다.
2. THE 각 혜택 카드 SHALL 아이콘, 제목, 설명 텍스트로 구성되어 표시된다.
3. WHILE isConnected 플래그가 false인 상태에서 BizDataPage가 표시되는 동안, THE BizDataPage SHALL 화면 하단에 "데이터 연결 시작하기" 버튼을 viewport 기준 고정(sticky) 표시하여 스크롤 시에도 항상 보이도록 한다.
4. WHEN 사용자가 "데이터 연결 시작하기" 버튼을 클릭하면, THE BizDataPage SHALL `/biz-data/collect` 경로로 네비게이션한다.

### Requirement 2: 마이 비즈 데이터 수집 흐름 (Step 기반)

**User Story:** As a 소상공인 고객, I want to 고객 인증 → 약관 동의 → 데이터 수집 순서로 진행할 수 있다, so that 안전하게 사업 데이터를 연결할 수 있다.

#### Acceptance Criteria

1. THE BizDataCollectStore SHALL STEP_ORDER 배열을 CERT_INFO → PIN → TERMS → LOADING 순서로 정의하고, currentStep 상태와 nextStep, prevStep, setStep, reset 액션을 제공한다.
2. WHEN BizDataCollectPage에 진입하면, THE BizDataCollectPage SHALL useLayoutStore.setStepTitle()을 호출하여 "마이 비즈 데이터" 타이틀을 설정하고, setOnBack()을 호출하여 커스텀 뒤로가기 핸들러를 등록한다.
3. WHEN 사용자가 뒤로가기를 누르면, IF 현재 step이 첫 번째(CERT_INFO)이면, THEN THE BizDataCollectPage SHALL navigate(-1)로 이전 페이지로 이동한다.
4. WHEN 사용자가 뒤로가기를 누르면, IF 현재 step이 CERT_INFO가 아니면, THEN THE BizDataCollectPage SHALL prevStep()을 호출하여 이전 step으로 전환한다.
5. WHEN LOADING step이 완료되면, THE BizDataCollectPage SHALL `/biz-data` 경로로 네비게이션한다.
6. WHEN BizDataCollectPage에서 이탈하면, THE BizDataCollectPage SHALL useLayoutStore.setOnBack(null)을 호출하여 커스텀 뒤로가기 핸들러를 해제한다.

### Requirement 3: 고객 정보 입력 및 PIN 인증

**User Story:** As a 소상공인 고객, I want to 이름, 주민등록번호, 휴대폰번호를 입력하고 PIN 인증을 완료할 수 있다, so that 본인 확인 후 데이터 수집을 진행할 수 있다.

#### Acceptance Criteria

1. WHEN step이 CERT_INFO 또는 PIN이면, THE BizDataCollectPage SHALL CustomerVerifyPage 컴포넌트를 onSuccess 콜백(step을 TERMS로 전환하는 함수)을 전달하여 렌더링한다.
2. WHEN CustomerVerifyPage에서 onSuccess 콜백이 호출되면, THE BizDataCollectPage SHALL step을 TERMS로 전환한다.
3. IF PIN 인증이 실패하면(onVerify가 false를 반환하거나 예외가 발생하면), THEN THE CustomerVerifyPage SHALL PIN 입력을 초기화하고 인증 실패를 나타내는 에러 메시지를 표시하여 재입력을 허용한다.

### Requirement 4: 마이 비즈니스 데이터 약관 동의

**User Story:** As a 소상공인 고객, I want to 마이 비즈니스 데이터 관련 약관에 동의할 수 있다, so that 데이터 수집에 대한 법적 동의를 완료할 수 있다.

#### Acceptance Criteria

1. WHEN step이 TERMS이면, THE BizDataCollectPage SHALL TermsPage 컴포넌트를 title "마이 비즈니스 데이터 약관 동의", terms에 5개 약관(마이 비즈니스 데이터 수집 및 이용 동의(필수) / 개인정보 제3자 제공 동의(필수) / 개인정보 처리 위탁 동의(필수) / 맞춤형 서비스 제공을 위한 정보 수신 동의(선택)), submitLabel "동의하고 계속하기"와 함께 렌더링한다.
2. WHEN 사용자가 약관 항목의 상세 보기를 클릭하면, THE TermsDetailSheet SHALL 해당 약관의 상세 내용(수집 항목 / 수집 목적 / 보유 기간 / 제공받는 자 / 동의 거부 권리 5개 섹션)을 Bottom Sheet로 표시한다.
3. WHEN 사용자가 필수 약관 4개에 모두 동의하고 제출 버튼을 클릭하면, THE BizDataCollectPage SHALL onSubmit 콜백을 통해 동의한 약관 ID 배열(agreedIds)을 전달하고 step을 LOADING으로 전환한다.
4. IF 필수 약관 4개 중 하나라도 미동의 상태이면, THEN THE TermsPage SHALL 제출 버튼을 비활성화(disabled) 상태로 표시한다.
5. WHEN 사용자가 전체 동의 체크박스를 클릭하면, THE TermsPage SHALL 미동의 약관을 순차적으로 상세 시트에 표시하고, 각 시트에서 동의 시 해당 약관을 동의 처리한다.

### Requirement 5: 데이터 수집 중 로딩 화면

**User Story:** As a 소상공인 고객, I want to 데이터 수집 진행 상황을 항목별로 확인할 수 있다, so that 수집이 정상적으로 진행되고 있음을 알 수 있다.

#### Acceptance Criteria

1. WHEN step이 LOADING이면, THE BizDataCollectPage SHALL LoadingScreen 컴포넌트를 title "사업 데이터를 분석하고 있어요", description "AI가 다양한 데이터를 안전하게 수집 분석합니다.", 그리고 6개 수집 항목(홈택스 연결 완료 / 카드 매출 수집 완료 / 거래 정보 분석 중 / 상권 정보 수집 중 / 리뷰·평점 분석 중 / 최종 분석 리포트 생성 중)을 steps prop으로 전달하여 렌더링한다.
2. THE LoadingScreen SHALL 각 항목의 상태를 pending, loading, done 중 하나로 표시하며, done 상태는 체크 아이콘, loading 상태는 스피너 아이콘, pending 상태는 회색 비활성 아이콘으로 구분한다.
3. WHEN LoadingScreen이 최초 렌더링되면, THE LoadingScreen SHALL 첫 번째 항목을 loading 상태로, 나머지 항목을 pending 상태로 표시한다.
4. WHEN 모든 항목이 done 상태가 되면, THE LoadingScreen SHALL onComplete 콜백을 호출한다.

### Requirement 6: LoadingScreen 공통 컴포넌트 UI 구현

**User Story:** As a 개발자, I want to LoadingScreen 컴포넌트의 UI를 구현한다, so that 마이 비즈 데이터 수집, 대출 마이데이터 로딩 등 여러 곳에서 재사용할 수 있다.

#### Acceptance Criteria

1. THE LoadingScreen SHALL title(필수), description(선택), steps(선택), onComplete(선택) props를 받아, 화면 중앙에 title과 description을 상단에, 일러스트레이션 영역을 중간에, step 리스트를 하단에 수직 배치하여 렌더링한다.
2. WHEN steps prop이 전달되면, THE LoadingScreen SHALL 각 step을 수직 리스트로 표시하되, done 상태 항목에는 체크 아이콘을, loading 상태 항목에는 스피너 애니메이션을, pending 상태 항목에는 비활성 원형 아이콘을 label 왼쪽에 표시한다.
3. WHEN steps prop이 전달되면, THE LoadingScreen SHALL 첫 번째 항목부터 순차적으로 pending → loading → done 상태를 자동 전환하되, 각 단계별 전환 간격은 기본 2초로 한다.
4. WHEN 모든 step 항목이 done 상태로 전환 완료되면, THE LoadingScreen SHALL onComplete 콜백이 전달된 경우에 한하여 해당 콜백을 1회 호출한다.
5. IF steps prop이 전달되지 않으면, THE LoadingScreen SHALL 자동 전환 로직을 실행하지 않고 title과 description만 표시한다.
6. IF LoadingScreen이 자동 전환 진행 중 언마운트되면, THE LoadingScreen SHALL 진행 중인 타이머를 정리하여 메모리 누수를 방지한다.

### Requirement 7: 통합 대시보드 요약 영역

**User Story:** As a 소상공인 고객, I want to 이번 달 매출, 전월 대비 변동률, 현금 흐름, 순이익, 업종 평균 비교를 한눈에 확인할 수 있다, so that 사업 현황을 빠르게 파악할 수 있다.

#### Acceptance Criteria

1. WHEN mock 데이터의 isConnected 플래그가 true인 상태에서 BizDataPage에 진입하면, THE BizDataPage SHALL 통합 대시보드를 표시한다.
2. THE BizDataPage SHALL 상단에 월 선택 드롭다운을 표시하며, 기본값은 mock 데이터의 현재 월("YYYY.MM (이번 달)" 형식)로 선택된 상태로 표시한다.
3. THE BizDataPage SHALL 이번 달 매출 금액을 천 단위 콤마가 포함된 원화 형식으로 카드에 표시하고, 전월 대비 증감률(%)을 소수점 첫째 자리까지 표시하되, 양수일 경우 "+" 접두사와 녹색 텍스트를, 음수일 경우 "-" 접두사와 적색 텍스트를 적용한다.
4. THE BizDataPage SHALL 현금 흐름과 순이익(추정) 금액을 각각 천 단위 콤마가 포함된 원화 형식으로 가로 배치된 2개의 카드에 표시한다.
5. THE BizDataPage SHALL 업종 평균과 비교하여 매출, 수익성, 안정성 각각의 상위 퍼센트를 0%에서 100% 범위의 게이지 바로 표시하며, 게이지 바의 채움 너비는 해당 퍼센트 값에 비례하고 각 항목 옆에 "상위 N%" 텍스트를 표시한다.
6. THE BizDataPage SHALL 업종 비교 섹션 상단에 mock 데이터의 업종명을 "OOO 기준" 형식의 부제목으로 표시한다.

### Requirement 8: 통합 대시보드 상세 영역

**User Story:** As a 소상공인 고객, I want to 업종 매출 추이, 객단가 변동률, 대출 잔액, 리뷰·평점, 고객 비율 등 상세 데이터를 확인할 수 있다, so that 사업 성과를 심층적으로 분석할 수 있다.

#### Acceptance Criteria

1. THE BizDataPage SHALL 대시보드 요약 영역 하단에 스크롤하여 상세 영역을 표시한다.
2. THE BizDataPage SHALL "업종 매출 추이" 섹션에 SVG 기반 라인 차트를 표시하며, x축에 월(1월~5월), y축에 매출 금액을 표시하고, 최신 데이터 포인트에 금액 툴팁을 표시한다.
3. THE BizDataPage SHALL "입출금 흐름 (지난 3개월)" 섹션에 div 기반 그룹 바 차트를 표시하며, 각 월별로 입금과 출금 막대를 색상으로 구분하고 범례를 포함한다.
4. THE BizDataPage SHALL "대출 현황" 섹션에 대출 잔액 금액과 대출 상환일을 카드 형태로 표시한다.
5. THE BizDataPage SHALL "리뷰/평점 현황" 섹션에 평균 평점(별점 포함), 리뷰 수, 평점 추이 라인 차트(SVG 기반)를 카드 형태로 표시한다.
6. THE BizDataPage SHALL 하단에 재구매율(추정)과 추천 건수(추정)를 카드 형태로 표시한다.
7. THE BizDataPage SHALL 모든 차트와 데이터를 MOCK_BIZ_DASHBOARD에서 읽어 렌더링한다.

### Requirement 9: Mock 데이터 구성

**User Story:** As a 개발자, I want to 마이 비즈 데이터 UI에 필요한 모든 mock 데이터를 한 파일에서 관리한다, so that API 연동 시 교체가 용이하다.

#### Acceptance Criteria

1. THE Mock_Data SHALL `mocks/bizData.ts` 파일에서 MOCK_BIZ_DATA_TERMS(TermsItem[] 타입, 5개 항목: 필수 4개 + 선택 1개), MOCK_BIZ_DATA_COLLECT_STEPS(6개 step 객체, 각 객체는 label: string과 status: 'pending' | 'loading' | 'done' 필드를 포함하며 초기값은 모두 'pending'), MOCK_BIZ_DASHBOARD(대시보드 데이터 객체)를 named export한다.
2. THE Mock_Data SHALL MOCK_IS_CONNECTED 상수를 boolean 타입으로 named export하며, 기본값은 true로 설정하여 BizDataPage 컴포넌트가 이 값에 따라 미연결 화면과 연결완료(대시보드) 화면을 분기 렌더링할 수 있도록 한다.
3. THE Mock_Data SHALL 모든 export 상수에 TypeScript 타입 어노테이션을 명시하며, 파일 내 `any` 타입을 사용하지 않는다.
4. WHEN MOCK_BIZ_DATA_TERMS의 각 TermsItem content를 구성할 때, THE Mock_Data SHALL 수집 항목, 수집 목적, 보유 기간, 제공받는 자, 동의 거부 권리의 5개 섹션을 포함하는 문자열을 제공한다.
5. THE Mock_Data SHALL MOCK_BIZ_DASHBOARD 객체에 월 매출(monthlyRevenue: number), 전월 대비 변동률(monthOverMonthChange: number), 현금흐름(cashFlow: number), 순이익(netProfit: number), 업종 비교 데이터(industryComparison 객체), 매출 추이 차트 데이터(revenueTrend: 5개월분 배열), 거래 흐름 차트 데이터(transactionFlow: 3개월분 배열), 대출 잔액(loanBalance: number), 리뷰/평점 데이터(review 객체), 고객 비율 데이터(customerRatio 객체)를 포함한다.

### Requirement 10: 코드 품질 및 빌드

**User Story:** As a 개발자, I want to 구현된 코드가 프로젝트 컨벤션을 준수하고 빌드에 성공한다, so that CI/CD 파이프라인에서 문제가 발생하지 않는다.

#### Acceptance Criteria

1. THE BizDataPage 및 BizDataCollectPage SHALL TypeScript strict 모드에서 `any` 타입, `@ts-ignore`, 타입 단언(`as any`) 없이 컴파일된다.
2. THE BizDataPage 및 BizDataCollectPage SHALL Tailwind CSS 유틸리티 클래스만 사용하며, 인라인 style 속성 및 Tailwind 임의값(arbitrary value, 예: `text-[#xxx]`)으로 색상을 지정하지 않는다.
3. THE BizDataPage 및 BizDataCollectPage SHALL `src/index.css`의 `@theme` 블록에 정의된 디자인 토큰 색상만 사용하며, `@theme` 블록에 새로운 색상 변수를 추가하지 않는다.
4. WHEN `npm run -w user-front build` 명령을 실행하면, THE 빌드 프로세스 SHALL exit code 0으로 완료되며 TypeScript 컴파일 에러 및 Vite 번들링 에러가 발생하지 않는다.
5. THE BizDataCollectPage SHALL 기존 라우터 설정 파일(`src/router/` 디렉토리)의 경로(path), 컴포넌트 매핑, 중첩 구조를 변경하지 않는다.
6. WHEN `npm run -w user-front lint` 명령을 실행하면, THE BizDataPage 및 BizDataCollectPage 관련 파일 SHALL ESLint 에러 없이 통과한다.
7. THE BizDataPage 및 BizDataCollectPage SHALL 컴포넌트 파일명은 PascalCase, 훅 파일명은 camelCase에 `use` 접두사를 사용하며, 컴포넌트 내부에서 직접 axios/fetch를 호출하지 않는다.
