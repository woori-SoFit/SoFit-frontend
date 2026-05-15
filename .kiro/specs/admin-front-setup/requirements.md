# Requirements Document

## Introduction

SoFit admin-front React 프로젝트의 초기 세팅을 정의한다. 데스크톱 전용 단일 레이아웃(좌측 고정 사이드바 + 우측 콘텐츠 영역)을 기반으로, React Router v7, React Query v5, Zustand v5, Axios, Tailwind CSS, Vitest + RTL 기술 스택을 구성한다. 로그인 페이지 UI와 대출 현황 대시보드 테이블 목업을 포함하며, 역할별 권한 분기 없이 4개 메뉴를 모두 노출한다.

## Glossary

- **Admin_App**: admin-front React 애플리케이션 전체
- **Sidebar**: 좌측 고정 사이드바 네비게이션 컴포넌트
- **ContentArea**: 우측 메인 콘텐츠 영역
- **AdminLayout**: Sidebar와 ContentArea를 포함하는 데스크톱 전용 단일 레이아웃 컴포넌트
- **LoginPage**: 관리자 로그인 UI 페이지
- **DashboardPage**: 대출 현황 대시보드 페이지 (테이블 목업 포함)
- **Router**: createBrowserRouter 기반 라우팅 시스템
- **AxiosInstance**: 공통 Axios 인스턴스 (baseURL, withCredentials, 인터셉터 설정)
- **QueryClient**: React Query 전역 클라이언트 (staleTime 5분, retry 1, refetchOnWindowFocus false)
- **DesignToken**: index.css @theme 블록에 정의된 디자인 변수 (색상, 타이포그래피 등)

## Requirements

### Requirement 1: 프로젝트 디렉토리 구조

**User Story:** As a 개발자, I want 표준화된 디렉토리 구조를 갖춘 프로젝트를 사용하고 싶다, so that 팀원 간 일관된 코드 배치가 가능하다.

#### Acceptance Criteria

1. THE Admin_App SHALL src/ 하위에 api/, components/, pages/, router/, stores/, constants/, types/ 디렉토리를 포함한다.
2. THE Admin_App SHALL api/ 디렉토리에 AxiosInstance 모듈을 배치한다.
3. THE Admin_App SHALL router/ 디렉토리에 createBrowserRouter 기반 라우트 정의를 배치한다.
4. THE Admin_App SHALL constants/ 디렉토리에 queryKey 상수를 배치한다.
5. THE Admin_App SHALL stores/ 디렉토리에 Zustand 스토어를 배치한다.

### Requirement 2: 기술 스택 의존성 설치

**User Story:** As a 개발자, I want 필요한 라이브러리가 모두 설치된 프로젝트를 사용하고 싶다, so that 추가 설정 없이 개발을 시작할 수 있다.

#### Acceptance Criteria

1. THE Admin_App SHALL react-router-dom v7을 dependencies에 포함한다.
2. THE Admin_App SHALL @tanstack/react-query v5를 dependencies에 포함한다.
3. THE Admin_App SHALL zustand v5를 dependencies에 포함한다.
4. THE Admin_App SHALL axios를 dependencies에 포함한다.
5. THE Admin_App SHALL vitest를 devDependencies에 포함한다.
6. THE Admin_App SHALL @testing-library/react를 devDependencies에 포함한다.
7. THE Admin_App SHALL @testing-library/jest-dom을 devDependencies에 포함한다.
8. THE Admin_App SHALL jsdom을 devDependencies에 포함한다.

### Requirement 3: 엔트리포인트 및 프로바이더 구성

**User Story:** As a 개발자, I want QueryClientProvider와 RouterProvider가 올바르게 구성된 엔트리포인트를 사용하고 싶다, so that React Query 캐싱과 라우팅이 전역으로 동작한다.

#### Acceptance Criteria

1. THE Admin_App SHALL main.tsx에서 QueryClientProvider로 전체 앱을 감싼다.
2. THE Admin_App SHALL QueryClient defaultOptions에 staleTime을 300000ms(5분)로 설정한다.
3. THE Admin_App SHALL QueryClient defaultOptions에 retry를 1로 설정한다.
4. THE Admin_App SHALL QueryClient defaultOptions에 refetchOnWindowFocus를 false로 설정한다.
5. THE Admin_App SHALL main.tsx에서 RouterProvider에 createBrowserRouter로 생성한 router를 전달한다.

### Requirement 4: 공통 Axios 인스턴스

**User Story:** As a 개발자, I want 공통 설정이 적용된 Axios 인스턴스를 사용하고 싶다, so that 모든 API 요청에 일관된 baseURL과 인증 설정이 적용된다.

#### Acceptance Criteria

1. THE AxiosInstance SHALL baseURL을 환경변수 VITE_API_BASE_URL에서 읽어 설정한다.
2. THE AxiosInstance SHALL withCredentials를 true로 설정한다.
3. THE AxiosInstance SHALL Content-Type 헤더를 "application/json"으로 설정한다.
4. WHEN 응답 상태 코드가 401인 경우, THE AxiosInstance SHALL window.location.href를 "/login"으로 변경하여 로그인 페이지로 리다이렉트한다.

### Requirement 5: 데스크톱 전용 단일 레이아웃

**User Story:** As a 관리자, I want 좌측 고정 사이드바와 우측 콘텐츠 영역으로 구성된 레이아웃을 사용하고 싶다, so that 메뉴 탐색과 콘텐츠 확인을 동시에 할 수 있다.

#### Acceptance Criteria

1. THE AdminLayout SHALL 좌측에 고정 위치의 Sidebar를 렌더링한다.
2. THE AdminLayout SHALL 우측에 ContentArea를 렌더링한다.
3. THE ContentArea SHALL 흰색 배경(#ffffff)을 적용한다.
4. THE Sidebar SHALL 진한 남색 배경을 적용한다.
5. THE AdminLayout SHALL 데스크톱 전용으로 설계하며 반응형 브레이크포인트를 포함하지 않는다.

### Requirement 6: 사이드바 네비게이션

**User Story:** As a 관리자, I want 사이드바에서 모든 메뉴에 접근하고 싶다, so that 원하는 기능으로 빠르게 이동할 수 있다.

#### Acceptance Criteria

1. THE Sidebar SHALL 상단에 src/assets/main-logo.svg 로고를 표시한다.
2. THE Sidebar SHALL "대출 현황 대시보드" 메뉴 항목을 표시한다.
3. THE Sidebar SHALL "사용자 관리" 메뉴 항목을 표시한다.
4. THE Sidebar SHALL "API 로그" 메뉴 항목을 표시한다.
5. THE Sidebar SHALL "S등급 배치 관리" 메뉴 항목을 표시한다.
6. THE Sidebar SHALL 4개 메뉴를 역할 구분 없이 모두 노출한다.
7. WHEN 메뉴 항목을 클릭하면, THE Sidebar SHALL 해당 경로로 라우팅을 수행한다.
8. THE Sidebar SHALL 현재 활성화된 메뉴 항목을 시각적으로 구분하여 표시한다.

### Requirement 7: 라우팅 구성

**User Story:** As a 개발자, I want 페이지별 라우트가 정의된 라우터를 사용하고 싶다, so that URL 기반 페이지 전환이 동작한다.

#### Acceptance Criteria

1. THE Router SHALL /login 경로에 LoginPage를 매핑한다.
2. THE Router SHALL / 경로에 AdminLayout을 적용한다.
3. THE Router SHALL /dashboard 경로에 DashboardPage를 매핑한다.
4. THE Router SHALL /users 경로에 사용자 관리 placeholder 페이지를 매핑한다.
5. THE Router SHALL /api-logs 경로에 API 로그 placeholder 페이지를 매핑한다.
6. THE Router SHALL /batch 경로에 S등급 배치 관리 placeholder 페이지를 매핑한다.
7. WHEN 루트 경로(/)에 접근하면, THE Router SHALL /dashboard로 리다이렉트한다.

### Requirement 8: 로그인 페이지 UI

**User Story:** As a 관리자, I want 로그인 페이지에서 아이디와 비밀번호를 입력할 수 있는 UI를 사용하고 싶다, so that 인증 절차를 진행할 수 있다.

#### Acceptance Criteria

1. THE LoginPage SHALL 아이디 입력 필드를 표시한다.
2. THE LoginPage SHALL 비밀번호 입력 필드를 표시한다.
3. THE LoginPage SHALL 로그인 버튼을 표시한다.
4. THE LoginPage SHALL AdminLayout 없이 독립된 전체 화면으로 렌더링한다.
5. THE LoginPage SHALL src/assets/main-logo.svg 로고를 표시한다.

### Requirement 9: 대출 현황 대시보드 테이블 목업

**User Story:** As a 관리자, I want 대출 현황 대시보드에서 테이블 형태의 데이터를 확인하고 싶다, so that 대출 신청 현황을 한눈에 파악할 수 있다.

#### Acceptance Criteria

1. THE DashboardPage SHALL 테이블 헤더(컬럼명)를 포함한 테이블 구조를 렌더링한다.
2. THE DashboardPage SHALL 데이터가 없는 경우 빈 상태 메시지를 표시한다.
3. THE DashboardPage SHALL 테이블 기반 레이아웃을 사용한다.
4. THE DashboardPage SHALL 페이지 제목으로 "대출 현황 대시보드"를 표시한다.

### Requirement 10: Placeholder 페이지

**User Story:** As a 개발자, I want 미구현 페이지에 placeholder를 표시하고 싶다, so that 라우팅 동작을 확인하고 추후 기능을 구현할 수 있다.

#### Acceptance Criteria

1. THE Admin_App SHALL 사용자 관리 페이지에 "사용자 관리" 제목을 포함한 placeholder를 표시한다.
2. THE Admin_App SHALL API 로그 페이지에 "API 로그" 제목을 포함한 placeholder를 표시한다.
3. THE Admin_App SHALL S등급 배치 관리 페이지에 "S등급 배치 관리" 제목을 포함한 placeholder를 표시한다.

### Requirement 11: 디자인 토큰 및 스타일 설정

**User Story:** As a 개발자, I want @theme 기반 디자인 토큰이 정의된 index.css를 사용하고 싶다, so that 일관된 색상과 타이포그래피를 Tailwind CSS에서 활용할 수 있다.

#### Acceptance Criteria

1. THE Admin_App SHALL index.css에 @theme 블록으로 디자인 토큰을 정의한다.
2. THE DesignToken SHALL 진한 남색 사이드바 색상을 포함한다.
3. THE DesignToken SHALL 브랜드 primary 색상(#0067AC)을 포함한다.
4. THE DesignToken SHALL 폰트 패밀리로 Pretendard 기반 sans-serif를 정의한다.
5. THE Admin_App SHALL user-front와 독립된 디자인 토큰 체계를 유지한다.

### Requirement 12: QueryKey 상수 정의

**User Story:** As a 개발자, I want 도메인별 queryKey 상수를 사용하고 싶다, so that React Query 캐시 키를 일관되게 관리할 수 있다.

#### Acceptance Criteria

1. THE Admin_App SHALL constants/ 디렉토리에 queryKeys 상수 파일을 포함한다.
2. THE Admin_App SHALL 인증 도메인 queryKey를 정의한다.
3. THE Admin_App SHALL 대출 도메인 queryKey를 정의한다.

### Requirement 13: 테스트 환경 구성

**User Story:** As a 개발자, I want Vitest와 React Testing Library가 설정된 테스트 환경을 사용하고 싶다, so that 컴포넌트 단위 테스트를 작성하고 실행할 수 있다.

#### Acceptance Criteria

1. THE Admin_App SHALL vite.config.ts 또는 vitest.config.ts에 test 환경을 jsdom으로 설정한다.
2. THE Admin_App SHALL package.json scripts에 test 명령어를 포함한다.
3. THE Admin_App SHALL @testing-library/jest-dom matchers를 전역으로 설정한다.
