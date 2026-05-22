# Requirements Document

## Introduction

S분석 리포트 진입 화면은 user-front 메인 페이지의 "S 분석 리포트" 메뉴를 통해 접근하는 소개 페이지입니다. 소상공인 고객에게 SOFIT 성장등급 리포트 서비스의 가치를 전달하고, CTA 버튼을 통해 리포트 플로우를 시작하도록 유도합니다. CTA 버튼 클릭 시 인증 여부와 My Biz Data 연결 상태에 따라 로그인 페이지, BizDataPage, 또는 성장 S등급 리포트 페이지로 분기합니다.

## Glossary

- **Intro_Page**: S분석 리포트 진입 화면 컴포넌트. 라우트 경로 `/grade-report/intro`에 매핑되는 React 페이지
- **Header**: 상단 네비게이션 영역. 뒤로가기 버튼과 페이지 타이틀을 포함
- **Feature_Section**: 서비스 특징을 설명하는 카드 형태의 UI 영역
- **CTA_Button**: "S분석 리포트 시작하기" 텍스트를 가진 하단 고정 액션 버튼
- **Auth_Hook**: `useMe` 훅을 통해 현재 사용자의 로그인 상태를 확인하는 메커니즘
- **Report_Flow**: S분석 리포트의 다음 단계 (My Biz Data 연결 확인 → 등급 조회 등)
- **My_Biz_Data**: 소상공인 사업자 데이터 (매출, 현금흐름, 업종 순위 등). 성장S등급 산출의 입력 데이터로, 최초 1회 수집하여 DB에 저장
- **BizDataPage**: My Biz Data 대시보드 페이지. 라우트 경로 `/biz-data`에 매핑되며, My Biz Data 수집 및 연결 상태를 관리하는 화면
- **Biz_Data_Status**: 사용자의 My Biz Data 연결(수집 완료) 여부를 나타내는 상태값. 서버 API를 통해 확인

## Requirements

### Requirement 1: 페이지 레이아웃 렌더링

**User Story:** As a 소상공인 고객, I want S분석 리포트 진입 화면을 볼 수 있도록, so that 서비스의 가치를 이해하고 리포트 시작 여부를 결정할 수 있다.

#### Acceptance Criteria

1. WHEN 사용자가 `/grade-report/intro` 경로에 접근하면, THE Intro_Page SHALL 상단 Header, 메인 타이틀, 서브 타이틀, 중앙 일러스트레이션, Feature_Section, CTA_Button을 포함한 전체 레이아웃을 3초 이내에 렌더링한다.
2. THE Header SHALL 좌측에 뒤로가기 버튼과 중앙에 "S분석 리포트" 타이틀 텍스트를 표시하며, WHEN 사용자가 뒤로가기 버튼을 탭하면, THE Header SHALL 이전 페이지로 네비게이션한다.
3. THE Intro_Page SHALL 메인 타이틀로 "SOFIT 성장등급 리포트" 텍스트를 font-weight 700 이상의 볼드 스타일로 표시한다.
4. THE Intro_Page SHALL 서브 타이틀로 "사장님의 성장 가능성을 봅니다." 텍스트를 표시한다.
5. THE Intro_Page SHALL 중앙 영역에 서비스를 시각적으로 표현하는 일러스트레이션 이미지를 대체 텍스트(alt 속성)와 함께 표시한다.
6. THE Feature_Section SHALL S분석 리포트 서비스의 주요 특징을 최소 2개 이상의 항목으로 나열하여 사용자에게 서비스 가치를 전달한다.
7. WHEN 사용자가 CTA_Button을 탭하면, THE Intro_Page SHALL S분석 리포트 플로우의 다음 단계 화면으로 네비게이션한다.
8. IF 일러스트레이션 이미지 로딩에 실패하면, THEN THE Intro_Page SHALL 이미지 영역의 레이아웃 높이를 유지하고 대체 텍스트를 표시하여 페이지 레이아웃이 깨지지 않도록 한다.

### Requirement 2: 서비스 특징 설명 표시

**User Story:** As a 소상공인 고객, I want S분석 리포트의 핵심 특징을 한눈에 파악할 수 있도록, so that 서비스 이용의 기대 효과를 이해할 수 있다.

#### Acceptance Criteria

1. THE Feature_Section SHALL "입체적 성장 분석" 항목을 첫 번째 카드로 표시하되, 차트 아이콘(대체 텍스트: "성장 분석 아이콘")과 제목 "입체적 성장 분석", 설명 텍스트 "리뷰, SNS, 상권 트렌드 등 숨은 성장 기세를 분석합니다."를 포함한다.
2. THE Feature_Section SHALL "맞춤형 우대 혜택" 항목을 두 번째 카드로 표시하되, S 뱃지 아이콘(대체 텍스트: "우대 혜택 아이콘")과 제목 "맞춤형 우대 혜택", 설명 텍스트 "발굴된 성장 등급에 따라 더 높은 한도와 낮은 금리를 설계합니다."를 포함한다.
3. THE Feature_Section SHALL 각 항목을 개별 카드 컨테이너로 감싸고, 카드 간 간격을 두어 세로 방향으로 순서대로 배치한다.
4. THE Feature_Section SHALL 총 2개의 특징 항목만 표시하며, 각 카드는 아이콘, 제목, 설명 텍스트의 동일한 구조를 유지한다.

### Requirement 3: CTA 버튼 동작 (분기 로직)

**User Story:** As a 소상공인 고객, I want "S분석 리포트 시작하기" 버튼을 눌렀을 때 인증 상태와 My Biz Data 연결 여부에 따라 적절한 화면으로 이동할 수 있도록, so that 리포트 조회에 필요한 사전 조건을 순서대로 충족할 수 있다.

#### Acceptance Criteria

1. THE CTA_Button SHALL 화면 하단에 고정(fixed) 배치되며 "S분석 리포트 시작하기" 텍스트를 표시한다.
2. IF 사용자가 비로그인 상태에서 CTA_Button을 클릭하면, THEN THE Intro_Page SHALL 로그인 페이지(`/login`)로 네비게이션한다.
3. WHILE 사용자가 로그인 상태이고 My_Biz_Data가 미연결(미수집) 상태일 때, WHEN CTA_Button을 클릭하면, THE Intro_Page SHALL BizDataPage(`/biz-data`) 경로로 네비게이션한다.
4. WHILE 사용자가 로그인 상태이고 My_Biz_Data가 연결(수집 완료) 상태일 때, WHEN CTA_Button을 클릭하면, THE Intro_Page SHALL `/grade-report` 경로로 네비게이션한다.
5. WHILE 네비게이션이 진행 중일 때, THE CTA_Button SHALL 추가 클릭 입력을 무시한다.
6. WHILE Biz_Data_Status 조회가 진행 중일 때, THE CTA_Button SHALL 로딩 상태를 표시하고 클릭 입력을 무시한다.

### Requirement 4: CTA 버튼 동작 (비로그인 사용자)

**User Story:** As a 비로그인 소상공인 고객, I want "S분석 리포트 시작하기" 버튼을 눌렀을 때 로그인 페이지로 안내받을 수 있도록, so that 인증 후 리포트 서비스를 이용할 수 있다.

#### Acceptance Criteria

1. WHEN 비로그인 사용자가 CTA_Button을 클릭하면, THE Intro_Page SHALL 로그인 페이지(`/login`)로 리다이렉트하며, 리다이렉트는 1초 이내에 완료되어야 한다.
2. WHEN 비로그인 사용자가 CTA_Button 클릭으로 로그인 페이지에 리다이렉트될 때, THE Intro_Page SHALL 현재 페이지 경로를 리턴 URL 파라미터로 포함하여 전달한다.
3. WHEN 리턴 URL이 포함된 로그인 페이지에서 사용자가 로그인에 성공하면, THE System SHALL 리턴 URL에 해당하는 페이지로 자동 이동한다.

### Requirement 5: 공개 접근성

**User Story:** As a 소상공인 고객, I want 로그인하지 않아도 S분석 리포트 진입 화면에 접근할 수 있도록, so that 서비스 내용을 미리 확인하고 가입 여부를 결정할 수 있다.

#### Acceptance Criteria

1. THE Intro_Page SHALL 인증 여부와 관계없이 모든 사용자(로그인 사용자 및 비로그인 사용자)에게 로그인 리다이렉트 없이 접근을 허용한다.
2. WHILE 사용자가 비로그인 상태일 때, THE Intro_Page SHALL 로그인 사용자에게 표시되는 것과 동일한 페이지 콘텐츠(서비스 소개, S등급 설명, 분석 시작 버튼)를 렌더링한다.
3. IF 비로그인 사용자가 Intro_Page에서 로그인이 필요한 기능(분석 시작 등)을 시도하면, THEN THE System SHALL 로그인 페이지로 이동시킨다.

### Requirement 6: 뒤로가기 네비게이션

**User Story:** As a 소상공인 고객, I want 뒤로가기 버튼을 눌러 이전 화면으로 돌아갈 수 있도록, so that 자유롭게 화면을 탐색할 수 있다.

#### Acceptance Criteria

1. WHEN 사용자가 Header의 뒤로가기 버튼을 클릭하면, THE 시스템 SHALL 브라우저 히스토리의 이전 페이지로 네비게이션한다.
2. IF 브라우저 히스토리에 이전 페이지가 존재하지 않는 경우, THEN THE 시스템 SHALL 홈 화면(/)으로 네비게이션한다.
