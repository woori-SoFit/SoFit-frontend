# fe-conventions

# SoFit FE 개발 컨벤션

## 프로젝트 구조 (모노레포)

```java
SoFit-frontend/
├── user/              # 고객용 앱 (USER)
├── admin/             # 은행원+개발자용 앱 (BANK_ADMIN, DEV_ADMIN)
├── Jenkinsfile
├── package.json
└── turbo.json
```

## 상태 관리

- **React Query**: 서버 상태 (API 데이터, 캐싱, 로딩/에러 처리)
- **Zustand**: 클라이언트 상태 (UI 상태, 화면 진행 상태, 제출 전 임시 상태)
- Redux 사용 금지

```tsx
// React Query 예시
const { data, isLoading } = useQuery({
  queryKey: ['loanApplications'],
  queryFn: fetchLoanApplications
})

// Zustand 예시
const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user })
}))
```

## 스타일링

- Tailwind CSS 사용
- 인라인 style 속성 사용 금지
- user와 admin은 별도 디자인 시스템을 가진다.
- 각 앱의 디자인 토큰은 각 앱의 `src/index.css`에서 관리한다.

## 코딩 규칙

- TypeScript 필수, `any` 타입 사용 금지
- 컴포넌트명: PascalCase
- 훅명: camelCase, `use` 접두사
- 파일명: PascalCase (컴포넌트), camelCase (훅, 유틸)
- API 호출 함수는 `services/` 또는 `api/` 디렉토리에서 관리
- React Query queryKey는 도메인별 상수로 정의
- GET 요청은 `useQuery`, POST/PATCH/DELETE 요청은 `useMutation` 사용
- mutation 성공 후 관련 queryKey invalidate 처리
- 폴링 API는 완료/실패 상태 도달 시 반드시 중단
- 전역 상태는 Zustand로 관리하되, 서버 데이터는 React Query로 관리
- 모든 API 요청은 공통 axiosInstance를 통해 호출
- axiosInstance에서 baseURL, withCredentials, 공통 에러 처리를 관리
- 컴포넌트 내부에서 직접 axios/fetch 호출 금지

## 인증 / 세션 규칙

- 인증 방식은 Session-Cookie 기반으로 관리
- 프론트에서는 accessToken/JWT를 저장하거나 관리하지 않음
- API 요청 시 `credentials: 'include'` 또는 Axios `withCredentials: true` 설정 필수
- 로그인 사용자 정보는 `/api/auth/me` 또는 `/api/members/me`를 React Query로 조회한다.
- Zustand에는 인증 모달, UI 상태 등 클라이언트 상태만 저장한다.
- 서버에서 내려온 회원 정보 원본은 Zustand에 중복 저장하지 않는다.
- 로그아웃 시 서버 세션 삭제 요청 후 클라이언트 상태 초기화
- 민감정보 입력값은 검증 요청 후 즉시 초기화

## 주요 비즈니스 규칙

- 고객용(user)과 은행원용(admin)은 완전히 별개 앱으로 빌드
- SHAP 설명: 고객 화면에서 내부 파생 변수 노출 금지, 친화적 용어만 표시
- 심사 상태 조회는 폴링 방식 (알림 방식 추후 결정)
- S분석 리포트 생성 중 화면: 배치 결과 폴링