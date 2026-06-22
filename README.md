# SoFit Frontend
소상공인 대출 플랫폼 **SoFit**의 프론트엔드 모노레포입니다.
<br />
**SoFit**은 기존 신용평가 체계에서 소외된 소상공인에게 ML 기반 성장 S등급을 활용하여 대출 접근성을 높이는 플랫폼입니다.


<img width="320" alt="우리FISA 6기 - SOFIT 최종발표" src="https://github.com/user-attachments/assets/3ab43e04-48d5-4de2-8690-265d88f684dd" />
<img width="320" alt="우리FISA 6기 - SOFIT 최종발표 (1)" src="https://github.com/user-attachments/assets/6e25cf39-ede9-4f25-999e-e0fb2ca0935a" />

## 프로젝트 구조

```
SoFit-frontend/
├── user-front/          # 고객용 앱 (소상공인)
├── admin-front/         # 관리자용 앱 (은행원 / 개발자)
├── turbo.json           # Turborepo 설정
├── Jenkinsfile          # CI/CD 파이프라인
└── package.json         # 워크스페이스 루트
```

### user-front (고객용 앱)

소상공인 고객이 사용하는 모바일 웹 앱입니다.

| 기능 | 설명 |
|------|------|
| 회원가입 / 로그인 | KYC 인증, 금융인증서 기반 인증 |
| 대출 신청 | 상품 조회, 대출 신청, 약정 체결, 대출 실행 |
| 대출 관리 | 심사 진행 현황 조회, 승인/거절 결과 확인 |
| My Biz Data | 사업자 데이터 수집 및 대시보드 조회 |
| 성장 S등급 리포트 | ML 기반 성장등급 조회, SHAP 기반 상세 리포트 |
| 마이페이지 | 내 정보, 사업자 정보, 알림, 회원 탈퇴 |

### admin-front (관리자용 앱)

은행원(BANK_ADMIN)과 개발자(DEV_ADMIN)가 사용하는 관리 대시보드입니다.

| 기능 | 설명 |
|------|------|
| 대출 심사 대시보드 | 대출 신청 목록 조회, 상태별 필터링 |
| 대출 상세 심사 | 신청자 정보, S등급, SHAP 분석, 승인/거절 처리 |
| 배치 관리 | 일일/월별 배치 실행 상태 모니터링 |
| 사용자 관리 | 회원 목록 조회 및 관리 |
| 에러 로그 | API 에러 로그 조회 |
| 서버 상태 | 서버 헬스체크 대시보드 |

## 기술 스택

- React 19, TypeScript
- Vite, Turborepo (npm workspaces)
- TanStack React Query, Zustand
- Tailwind CSS 4
- Vitest, Playwright
- Docker, Jenkins

<img width="320" alt="우리FISA 6기 - SOFIT 최종발표 (2)" src="https://github.com/user-attachments/assets/65a9f1bb-5c48-42c3-b95b-f741f96e90cf" />
<img width="320" alt="우리FISA 6기 - SOFIT 최종발표 (3)" src="https://github.com/user-attachments/assets/ab6957c8-8d6d-47f1-b750-85e66f740fcf" />

## 시작하기

```bash
# 사전 요구사항: Node.js 20+, npm 10+

# 설치
npm install

# 개발 서버 실행
npm run dev:user          # 고객용 앱
npm run dev:admin         # 관리자용 앱

# 빌드
npm run build             # 전체 빌드
npm run build:user        # user-front만
npm run build:admin       # admin-front만

# 테스트
npm run test --workspace=user-front
npm run test --workspace=admin-front
npm run test:coverage --workspace=user-front

# 린트
npm run lint
```

### 환경 변수

```bash
# .env.development
VITE_API_BASE_URL=/api

# .env.local
VITE_DEV_API_PROXY_TARGET=http://백엔드서버주소:포트
```

## 배포

### CI/CD Pipeline

Jenkins를 통해 자동 배포됩니다.

```
Code Push → SonarQube Analysis → Docker Build & Push → Deploy
```

## 관련 레포지토리

| 레포지토리 | 설명 |
|------------|------|
| SoFit-backend | Spring Boot 백엔드 (user-backend, admin-backend, common) |
| SoFit-AI | FastAPI + LightGBM AI 서버 |
| SoFit-DevOps | Docker Compose, 인프라 설정 |
| SoFit-external-mock | 국세청, CB사, 금융인증서 Mock API |

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or modification is strictly prohibited.
