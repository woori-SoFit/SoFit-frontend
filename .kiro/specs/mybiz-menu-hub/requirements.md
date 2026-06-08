# Requirements Document

## Introduction

마이 비즈 데이터 대시보드 앞에 "메뉴 선택 화면(Menu Hub)"을 추가한다. 현재 흐름에서 데이터 수집 스텝 완료 후 곧바로 통합 대시보드로 진입하는 구조를, 메뉴 선택 화면을 거쳐 원하는 카테고리의 상세 데이터를 확인하는 구조로 변경한다.

변경 전 흐름: 메인 화면 → 마이비즈 데이터 탭 → 스텝(PIN 인증, 약관 동의 등) → 마이비즈 데이터 대시보드

변경 후 흐름: 메인 화면 → 마이비즈 데이터 탭 → 스텝(PIN 인증, 약관 동의 등) → **메뉴 선택 화면** → 선택한 항목의 상세 데이터/대시보드

이 화면은 My Biz Data가 이미 수집된 경우에만 표시된다(수집 스텝을 거친 후).

## Glossary

- **MenuHub**: 마이 비즈 데이터 메뉴 선택 화면 컴포넌트. 사장님이 원하는 데이터 카테고리를 선택할 수 있는 허브 역할을 한다.
- **MenuCard**: MenuHub 내 개별 메뉴 항목을 표시하는 카드 컴포넌트. 제목과 설명으로 구성된다.
- **MonthNavigation**: 월 단위 네비게이션 컴포넌트. 좌우 화살표로 조회 월을 변경한다.
- **GrowthBanner**: 하단 배너 컴포넌트. "내 성장 S 등급 보러가기" CTA를 표시한다.
- **BizDataPage**: 마이 비즈 데이터 메인 페이지. 연결 여부에 따라 소개 화면 또는 MenuHub를 표시한다.
- **BizDashboard**: 기존 통합 대시보드 컴포넌트. MenuHub에서 선택한 카테고리에 따라 해당 상세 데이터를 표시한다.

## Requirements

### Requirement 1: 메뉴 선택 화면 진입 조건

**User Story:** As a 소상공인 고객, I want to 데이터 수집이 완료된 경우에만 메뉴 선택 화면을 볼 수 있다, so that 의미 있는 데이터가 준비된 상태에서 원하는 정보를 선택할 수 있다.

#### Acceptance Criteria

1. WHEN My Biz Data 연결 상태가 true이고 사용자가 BizDataPage에 진입하면, THE BizDataPage SHALL 기존 통합 대시보드 대신 MenuHub 화면을 표시한다.
2. WHEN My Biz Data 연결 상태가 false이고 사용자가 BizDataPage에 진입하면, THE BizDataPage SHALL 기존 서비스 소개 화면(IntroSection)과 "데이터 연결 시작하기" 버튼을 표시한다.
3. WHEN BizDataCollectPage에서 데이터 수집 로딩의 모든 단계가 완료되고 사용자가 완료 버튼을 탭하면, THE BizDataCollectPage SHALL returnTo 상태가 없는 경우 `/biz-data` 경로로 네비게이션하여 MenuHub 화면을 표시한다.
4. IF BizDataPage 진입 시 My Biz Data 연결 상태 조회 API 호출이 실패하면, THEN THE BizDataPage SHALL 미연결 상태(IntroSection)를 표시한다.
5. WHILE BizDataPage가 My Biz Data 연결 상태를 조회하는 동안, THE BizDataPage SHALL 로딩 인디케이터를 표시하며 MenuHub 또는 IntroSection을 표시하지 않는다.

### Requirement 2: 메뉴 선택 화면 헤더 영역

**User Story:** As a 소상공인 고객, I want to 인사말과 조회 월을 확인할 수 있다, so that 어떤 기간의 데이터를 보고 있는지 명확히 알 수 있다.

#### Acceptance Criteria

1. THE MenuHub SHALL 상단에 "사장님, 무엇이 궁금하세요?" 텍스트를 헤더 타이틀로 표시한다.
2. WHEN MenuHub 화면이 최초 로드되면, THE MenuHub SHALL 헤더 아래에 MonthNavigation 컴포넌트를 표시하며, 서버에서 제공하는 사용 가능한 월 목록(availableMonths) 중 가장 최신 월을 초기 조회 월로 선택하여 "YYYY.MM" 형식으로 표시한다.
3. WHEN 사용자가 MonthNavigation의 왼쪽 화살표를 탭하면, THE MonthNavigation SHALL 조회 월을 서버에서 제공하는 사용 가능한 월 목록 기준으로 1개월 이전으로 변경하고, 변경된 월을 "YYYY.MM" 형식으로 표시한다.
4. WHEN 사용자가 MonthNavigation의 오른쪽 화살표를 탭하면, THE MonthNavigation SHALL 조회 월을 서버에서 제공하는 사용 가능한 월 목록 기준으로 1개월 이후로 변경하고, 변경된 월을 "YYYY.MM" 형식으로 표시한다.
5. IF 조회 월이 서버에서 제공하는 사용 가능한 월 목록(availableMonths)의 가장 과거 월이면, THEN THE MonthNavigation SHALL 왼쪽 화살표를 비활성화(disabled) 상태로 표시하여 탭해도 동작하지 않도록 한다.
6. IF 조회 월이 서버에서 제공하는 사용 가능한 월 목록(availableMonths)의 가장 최신 월이면, THEN THE MonthNavigation SHALL 오른쪽 화살표를 비활성화(disabled) 상태로 표시하여 탭해도 동작하지 않도록 한다.
7. IF 사용 가능한 월 목록 조회에 실패하면, THEN THE MonthNavigation SHALL 현재 시스템 날짜 기준의 월을 단독으로 표시하고, 좌우 화살표를 모두 비활성화(disabled) 상태로 표시한다.

### Requirement 3: 메뉴 카드 리스트

**User Story:** As a 소상공인 고객, I want to 궁금한 데이터 항목을 직관적인 카드 UI에서 선택할 수 있다, so that 원하는 정보에 빠르게 접근할 수 있다.

#### Acceptance Criteria

1. THE MenuHub SHALL 5개의 MenuCard를 수직 리스트로 표시하며, 각 카드는 제목과 설명 텍스트로 구성되고, 카드 간 간격은 8dp 이상으로 시각적으로 구분된다.
2. THE MenuHub SHALL 첫 번째 MenuCard에 제목 "이번 달 장사는 어땠나요?"와 설명 "매출 흐름과 주요 변화를 한눈에 요약"을 표시한다.
3. THE MenuHub SHALL 두 번째 MenuCard에 제목 "실제로 얼마나 남았나요?"와 설명 "수익과 현금 흐름을 정리해 핵심만 표시"를 표시한다.
4. THE MenuHub SHALL 세 번째 MenuCard에 제목 "손님들은 다시 찾아오고 있나요?"와 설명 "재방문과 고객 반응이 어떤지 요약"을 표시한다.
5. THE MenuHub SHALL 네 번째 MenuCard에 제목 "우리 가게는 다른 가게보다 잘하고 있나요?"와 설명 "업종 안에서 우리 가게 위치를 쉽게 표시"를 표시한다.
6. THE MenuHub SHALL 다섯 번째 MenuCard에 제목 "지금 챙기면 좋을 것들"과 설명 "대출 심사 전에 살펴보면 좋은 항목을 정리"를 표시한다.
7. WHEN 사용자가 MenuCard를 탭하면, THE MenuHub SHALL 해당 카드의 카테고리에 대응하는 상세 데이터 화면으로 네비게이션하며, 각 카드와 네비게이션 대상 화면의 매핑은 고정된 1:1 관계로 정의된다.
8. WHEN 사용자가 MenuCard를 탭하면, THE MenuHub SHALL 탭 후 300ms 이내에 화면 전환을 시작하고, 탭 시 카드에 눌림 상태(pressed state)를 시각적으로 표시한다.
9. IF MenuHub 데이터 로딩에 실패하면, THEN THE MenuHub SHALL 5개의 MenuCard를 정적 콘텐츠(제목, 설명)로 표시하여 네비게이션 기능을 유지한다.

### Requirement 4: 메뉴 카드 개별 UI

**User Story:** As a 소상공인 고객, I want to 각 메뉴 항목이 탭 가능한 카드로 시각적으로 구분되어 있다, so that 어떤 항목을 선택할 수 있는지 쉽게 인지할 수 있다.

#### Acceptance Criteria

1. THE MenuCard SHALL 둥근 모서리(rounded), 배경색, 좌우 패딩을 가진 카드 형태로 렌더링한다.
2. THE MenuCard SHALL 제목을 볼드 텍스트로, 설명을 보조 색상(text-secondary)의 작은 텍스트로 표시한다.
3. IF MenuCard에 설명 텍스트가 제공되지 않으면, THEN THE MenuCard SHALL 제목만 단독으로 수직 중앙 정렬하여 표시한다.
4. THE MenuCard SHALL 탭 가능한 영역임을 나타내기 위해 우측에 화살표(chevron) 아이콘을 표시한다.
5. WHILE 사용자가 MenuCard를 누르고 있는 동안, THE MenuCard SHALL 배경색 변경(예: gray-50)을 통해 눌림 상태를 표시한다.
6. THE MenuCard SHALL 접근성을 위해 role="button"과 메뉴 항목의 제목 텍스트를 값으로 하는 aria-label을 포함한다.

### Requirement 5: 성장 S등급 배너

**User Story:** As a 소상공인 고객, I want to 메뉴 선택 화면 하단에서 성장 S등급 리포트로 바로 이동할 수 있다, so that 추가 메뉴 탐색 없이 성장 분석 결과를 빠르게 확인할 수 있다.

#### Acceptance Criteria

1. THE MenuHub SHALL 메뉴 카드 리스트 하단에 GrowthBanner 컴포넌트를 표시한다.
2. THE GrowthBanner SHALL "내 성장 S 등급 보러가기" 텍스트를 CTA로 표시한다.
3. WHEN 사용자가 GrowthBanner를 탭하면, THE GrowthBanner SHALL `/grade-report` 경로로 네비게이션한다.
4. THE GrowthBanner SHALL MenuCard와 다른 배경색 클래스를 적용하여 시각적으로 구분되도록 렌더링한다.
5. WHEN 사용자가 GrowthBanner를 누르고 있으면, THE GrowthBanner SHALL 눌림 상태(active state)를 시각적 피드백으로 표시한다.
6. THE GrowthBanner SHALL 접근성을 위해 role="button"과 aria-label="내 성장 S 등급 보러가기"를 포함한다.

### Requirement 6: 카테고리별 상세 화면 네비게이션

**User Story:** As a 소상공인 고객, I want to 선택한 메뉴에 해당하는 상세 데이터만 집중해서 볼 수 있다, so that 불필요한 정보 없이 원하는 분석 결과를 확인할 수 있다.

#### Acceptance Criteria

1. WHEN 사용자가 "이번 달 장사는 어땠나요?" 카드를 탭하면, THE MenuHub SHALL 매출 관련 상세 데이터(월 매출, 전월 대비 변동률, 매출 추이 차트)를 표시하는 BizDashboard 화면으로 네비게이션하며, 네비게이션은 카드 탭 후 1초 이내에 화면 전환을 완료한다.
2. WHEN 사용자가 "실제로 얼마나 남았나요?" 카드를 탭하면, THE MenuHub SHALL 수익/현금흐름 관련 상세 데이터(현금흐름, 순이익, 입출금 흐름 차트)를 표시하는 BizDashboard 화면으로 네비게이션하며, 네비게이션은 카드 탭 후 1초 이내에 화면 전환을 완료한다.
3. WHEN 사용자가 "손님들은 다시 찾아오고 있나요?" 카드를 탭하면, THE MenuHub SHALL 고객 관련 상세 데이터(리뷰/평점, 재구매율, 추천 건수)를 표시하는 BizDashboard 화면으로 네비게이션하며, 네비게이션은 카드 탭 후 1초 이내에 화면 전환을 완료한다.
4. WHEN 사용자가 "우리 가게는 다른 가게보다 잘하고 있나요?" 카드를 탭하면, THE MenuHub SHALL 업종 비교 상세 데이터(업종 평균 대비 매출·수익성·안정성 비교)를 표시하는 BizDashboard 화면으로 네비게이션하며, 네비게이션은 카드 탭 후 1초 이내에 화면 전환을 완료한다.
5. WHEN 사용자가 "지금 챙기면 좋을 것들" 카드를 탭하면, THE MenuHub SHALL 대출 심사 대비 체크 항목 데이터(대출 현황, 개선 가능 항목)를 표시하는 BizDashboard 화면으로 네비게이션하며, 네비게이션은 카드 탭 후 1초 이내에 화면 전환을 완료한다.
6. WHEN 사용자가 상세 화면 상단의 뒤로가기 버튼을 탭하면, THE BizDashboard SHALL MenuHub 화면(`/biz-data` 경로)으로 복귀한다.
7. IF 상세 화면에서 해당 카테고리의 데이터 로딩에 실패하면, THEN THE BizDashboard SHALL 데이터를 불러올 수 없음을 나타내는 에러 메시지와 재시도 버튼을 표시한다.
8. WHILE 상세 화면의 데이터가 로딩 중이면, THE BizDashboard SHALL 로딩 인디케이터를 표시하여 사용자에게 데이터 로딩 상태를 안내한다.

### Requirement 7: 선택된 월 상태 전달

**User Story:** As a 소상공인 고객, I want to 메뉴 선택 화면에서 선택한 조회 월이 상세 화면에도 그대로 적용된다, so that 월을 다시 선택할 필요 없이 일관된 기간의 데이터를 확인할 수 있다.

#### Acceptance Criteria

1. WHEN 사용자가 MenuHub에서 MenuCard를 탭하면, THE MenuHub SHALL MonthNavigation에 현재 표시 중인 조회 월(YYYY.MM)을 상세 화면에 전달한다.
2. THE 상세 화면 SHALL 전달받은 조회 월을 기준으로 해당 월의 카테고리별 데이터를 조회하여 표시한다.
3. IF 전달받은 조회 월에 해당하는 데이터가 존재하지 않으면, THEN THE 상세 화면 SHALL 데이터가 없음을 나타내는 안내 메시지를 표시한다.
4. WHEN 사용자가 상세 화면에서 뒤로가기로 MenuHub에 복귀하면, THE MenuHub SHALL 이전에 선택했던 조회 월을 MonthNavigation에 유지하여 표시한다.
5. THE 상세 화면 SHALL 자체적으로 조회 월을 변경하는 MonthNavigation을 포함하지 않으며, MenuHub에서 전달받은 조회 월만을 사용한다.

### Requirement 8: 코드 품질 및 빌드

**User Story:** As a 개발자, I want to 구현된 코드가 프로젝트 컨벤션을 준수하고 빌드에 성공한다, so that CI/CD 파이프라인에서 문제가 발생하지 않는다.

#### Acceptance Criteria

1. THE MenuHub 관련 컴포넌트 SHALL TypeScript strict 모드(`tsconfig.app.json`에 `"strict": true` 설정)에서 `any` 타입, `@ts-ignore`, `@ts-nocheck`, 타입 단언(`as any`, `as unknown as T`) 없이 타입 에러 0건으로 컴파일된다.
2. THE MenuHub 관련 컴포넌트 SHALL Tailwind CSS 유틸리티 클래스만 사용하며, 인라인 style 속성을 사용하지 않는다.
3. THE MenuHub 관련 컴포넌트 SHALL 색상 값으로 `src/index.css`의 `@theme` 블록에 정의된 디자인 토큰만 사용하며, Tailwind arbitrary value로 하드코딩된 색상(예: `text-[#333]`, `bg-[rgb(...)]`)을 사용하지 않는다.
4. WHEN `npm run build` 명령을 user-front 디렉토리에서 실행하면, THE 빌드 프로세스 SHALL TypeScript 컴파일 에러 0건, Vite 번들링 에러 0건으로 exit code 0을 반환하며 완료된다.
5. THE MenuHub 관련 컴포넌트 SHALL 컴포넌트 파일명은 PascalCase(예: `MenuHub.tsx`), 훅 파일명은 camelCase에 `use` 접두사(예: `useMenuData.ts`), 유틸리티 및 타입 파일명은 camelCase(예: `menuUtils.ts`, `menuTypes.ts`)를 사용한다.
6. THE MenuHub 관련 컴포넌트 SHALL API 호출은 `src/api/` 디렉토리에 정의된 함수를 통해서만 수행하며, 컴포넌트 및 훅 파일 내부에서 직접 axios 또는 fetch를 import하거나 호출하지 않는다.
7. THE MenuHub 관련 컴포넌트 SHALL API 응답 데이터(조회, 변경 요청의 결과)는 React Query(`useQuery`, `useMutation`)로 관리하고, UI 전용 상태(선택된 월, 토글 상태, 모달 열림 여부 등)는 Zustand store 또는 React의 `useState`/`useReducer`로 관리한다.
