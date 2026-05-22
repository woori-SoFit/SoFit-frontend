# Design Document: S분석 리포트 진입 화면

## Overview

S분석 리포트 진입 화면(`/grade-report/intro`)은 소상공인 고객에게 SOFIT 성장등급 리포트 서비스의 가치를 소개하고, CTA 버튼을 통해 리포트 플로우를 시작하도록 유도하는 페이지입니다.

핵심 설계 포인트:
- **공개 접근**: 비로그인 사용자도 페이지 열람 가능 (서비스 소개 목적)
- **CTA 분기 로직**: 인증 상태 × My Biz Data 연결 상태에 따라 3가지 경로로 분기
- **StepLayout 활용**: 하단 탭바 없이 뒤로가기+타이틀 헤더 패턴 적용

## Architecture

```mermaid
graph TD
    A[routes.tsx] -->|/grade-report/intro| B[StepLayout]
    B --> C[GradeReportIntroPage]
    C --> D[useMe Hook]
    C --> E[useBizDataStatus Hook]
    C --> F[FeatureCard Component]
    C --> G[CtaButton Component]
    
    E --> H[bizDataApi.fetchBizDataStatus]
    H --> I[GET /api/biz-data/status]
    
    G -->|비로그인| J[/login?returnUrl=...]
    G -->|로그인+미연결| K[/biz-data]
    G -->|로그인+연결| L[/grade-report]
```

### 라우팅 변경

현재 `/grade-report`는 MainLayout 하위에 있습니다. 새로 추가할 `/grade-report/intro`는 StepLayout 하위에 배치하여 하단 탭바 없이 뒤로가기+타이틀 헤더만 표시합니다.

```typescript
// StepLayout children에 추가
{ path: "/grade-report/intro", element: <GradeReportIntroPage /> }
```

## Components and Interfaces

### 페이지 컴포넌트

#### GradeReportIntroPage

- **경로**: `src/pages/grade/GradeReportIntroPage.tsx`
- **역할**: 페이지 전체 레이아웃 조합, layoutStore 타이틀 설정, CTA 분기 로직 처리

```typescript
interface GradeReportIntroPageProps {
  // props 없음 — 내부에서 훅으로 상태 관리
}
```

**책임:**
1. `useLayoutStore`로 stepTitle을 "S분석 리포트"로 설정
2. `useMe()`로 로그인 상태 확인
3. `useBizDataStatus()`로 My Biz Data 연결 여부 확인 (로그인 시에만)
4. CTA 클릭 시 분기 로직 실행
5. 중복 클릭 방지 (isNavigating 상태)

### 하위 컴포넌트

#### FeatureCard

- **경로**: `src/components/grade/FeatureCard.tsx`
- **역할**: 서비스 특징 카드 단일 항목 렌더링

```typescript
interface FeatureCardProps {
  icon: React.ReactNode;
  iconAlt: string;
  title: string;
  description: string;
}
```

#### CtaButton

- **경로**: `src/components/grade/CtaButton.tsx`  
- **역할**: 하단 고정 CTA 버튼 렌더링

```typescript
interface CtaButtonProps {
  label: string;
  onClick: () => void;
  isLoading: boolean;
  disabled: boolean;
}
```

### 커스텀 훅

#### useBizDataStatus

- **경로**: `src/hooks/useBizDataStatus.ts`
- **역할**: My Biz Data 연결(수집 완료) 여부를 서버에서 조회

```typescript
interface UseBizDataStatusReturn {
  /** My Biz Data가 연결(수집 완료)되었는지 여부 */
  isConnected: boolean;
  /** 조회 중 여부 */
  isLoading: boolean;
  /** 에러 발생 여부 */
  isError: boolean;
}

function useBizDataStatus(enabled: boolean): UseBizDataStatusReturn;
```

- `enabled` 파라미터: 로그인 상태일 때만 true로 전달하여 불필요한 API 호출 방지
- queryKey: `BIZ_DATA_KEYS.dashboard()` 활용

#### useCtaNavigation

- **경로**: `src/hooks/useCtaNavigation.ts`
- **역할**: CTA 버튼의 분기 네비게이션 로직을 캡슐화

```typescript
interface UseCtaNavigationReturn {
  /** CTA 클릭 핸들러 */
  handleCtaClick: () => void;
  /** 네비게이션 진행 중 여부 */
  isNavigating: boolean;
  /** Biz Data 상태 로딩 중 여부 */
  isStatusLoading: boolean;
}

function useCtaNavigation(): UseCtaNavigationReturn;
```

**분기 로직:**
1. `isLoggedIn === false` → `navigate('/login?returnUrl=/grade-report/intro')`
2. `isLoggedIn && !isConnected` → `navigate('/biz-data')`
3. `isLoggedIn && isConnected` → `navigate('/grade-report')`

### API 레이어

#### bizDataApi

- **경로**: `src/api/bizDataApi.ts`

```typescript
import axiosInstance from "./axiosInstance";
import type { BizDataStatusResponse } from "@/types/bizData";

/** My Biz Data 연결 상태 조회 */
export async function fetchBizDataStatus(): Promise<BizDataStatusResponse> {
  const res = await axiosInstance.get<BizDataStatusResponse>("/biz-data/status");
  return res.data;
}
```

## Data Models

### 타입 정의

#### `src/types/bizData.ts`

```typescript
/** My Biz Data 연결 상태 응답 */
export interface BizDataStatusResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: BizDataStatus | null;
}

export interface BizDataStatus {
  /** My Biz Data 수집 완료 여부 */
  isConnected: boolean;
  /** 수집 완료 일시 (ISO 8601) */
  connectedAt: string | null;
}
```

### 상태 관리 전략

| 상태 | 관리 방식 | 설명 |
|------|-----------|------|
| 로그인 여부 | React Query (`AUTH_KEYS.me`) | `useMe()` 훅으로 조회 |
| Biz Data 연결 여부 | React Query (`BIZ_DATA_KEYS.dashboard()`) | `useBizDataStatus()` 훅으로 조회 |
| stepTitle | Zustand (`layoutStore`) | 페이지 마운트 시 설정 |
| isNavigating | useState (로컬) | 중복 클릭 방지용 |

### queryKey 확장

기존 `BIZ_DATA_KEYS`에 status 키 추가:

```typescript
export const BIZ_DATA_KEYS = {
  all: ["bizData"] as const,
  dashboard: () => [...BIZ_DATA_KEYS.all, "dashboard"] as const,
  status: () => [...BIZ_DATA_KEYS.all, "status"] as const,
} as const;
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: CTA 분기 로직 정합성

*For any* 사용자 상태 조합 (로그인 여부: boolean, bizData 연결 여부: boolean), CTA 버튼 클릭 시 네비게이션 대상 경로는 다음 규칙을 만족해야 한다:
- 비로그인 → `/login` 경로 (returnUrl 파라미터 포함)
- 로그인 + 미연결 → `/biz-data` 경로
- 로그인 + 연결 → `/grade-report` 경로

**Validates: Requirements 1.7, 3.2, 3.3, 3.4**

### Property 2: 리턴 URL 보존

*For any* 현재 페이지 경로에서 비로그인 사용자가 CTA 버튼을 클릭할 때, 네비게이션 대상 URL은 반드시 `returnUrl` 쿼리 파라미터에 현재 경로(`/grade-report/intro`)를 포함해야 한다.

**Validates: Requirements 4.2**

## Error Handling

| 시나리오 | 처리 방식 |
|----------|-----------|
| `useMe()` 로딩 중 | CTA 버튼 로딩 상태 표시, 클릭 비활성화 |
| `useBizDataStatus()` 로딩 중 | CTA 버튼 로딩 상태 표시, 클릭 비활성화 |
| `useBizDataStatus()` API 에러 | 에러 무시하고 `/biz-data`로 안전하게 분기 (미연결로 간주) |
| 일러스트레이션 이미지 로딩 실패 | 이미지 영역 높이 유지, alt 텍스트 표시 |
| 네비게이션 중 추가 클릭 | `isNavigating` 플래그로 무시 |
| 401 응답 (세션 만료) | axiosInstance 인터셉터에서 `/login` 리다이렉트 (기존 로직) |

### 에러 시 안전한 기본값 전략

`useBizDataStatus` 훅에서 API 에러 발생 시 `isConnected: false`로 처리합니다. 이렇게 하면 사용자는 `/biz-data` 페이지로 이동하게 되며, 해당 페이지에서 실제 연결 상태를 다시 확인할 수 있습니다.

## Testing Strategy

### 단위 테스트 (Vitest + React Testing Library)

| 테스트 대상 | 검증 내용 |
|-------------|-----------|
| `GradeReportIntroPage` 렌더링 | 모든 UI 요소(타이틀, 서브타이틀, 일러스트, 카드, CTA) 존재 확인 |
| `FeatureCard` | props에 따른 아이콘, 제목, 설명 렌더링 |
| `CtaButton` | label 표시, disabled/loading 상태 반영, onClick 호출 |
| `useBizDataStatus` | enabled=false 시 API 미호출, 응답 파싱 정확성 |
| `useCtaNavigation` | 각 상태 조합별 올바른 경로 반환 |
| 이미지 로딩 실패 | onError 시 레이아웃 유지 및 alt 표시 |
| 중복 클릭 방지 | 첫 클릭 후 isNavigating=true 시 추가 클릭 무시 |

### Property 기반 테스트 (Vitest + fast-check)

- **라이브러리**: `fast-check` (TypeScript PBT 라이브러리)
- **최소 반복**: 100회
- **태그 형식**: `Feature: s-report-intro, Property {number}: {property_text}`

| Property | 테스트 전략 |
|----------|-------------|
| Property 1: CTA 분기 로직 정합성 | `fc.record({ isLoggedIn: fc.boolean(), isConnected: fc.boolean() })`로 상태 조합 생성, 각 조합에 대해 `getTargetPath()` 함수의 반환값이 규칙과 일치하는지 검증 |
| Property 2: 리턴 URL 보존 | `fc.webPath()`로 다양한 경로 생성, 비로그인 상태에서 생성된 URL에 returnUrl 파라미터가 포함되는지 검증 |

### 통합 테스트

- 로그인 후 returnUrl로 자동 이동 (E2E 범위)
- StepLayout과의 통합 (타이틀 설정, 뒤로가기 동작)
