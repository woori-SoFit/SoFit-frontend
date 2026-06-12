import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

import { PublicLayout } from "@/components/common/PublicLayout";
import { MainLayout } from "@/components/common/MainLayout";
import { StepLayout } from "@/components/common/StepLayout";
import { CharacterLoadingSpinner } from "@/components/common/CharacterLoadingSpinner";

// Auth
import LoginPage from "@/pages/auth/LoginPage";

// Home (첫 화면 — 즉시 로딩)
import HomePage from "@/pages/home/HomePage";

// 지연 로딩 페이지 (lottie-react, 대형 라이브러리 포함)
const SignupPage = lazy(() => import("@/pages/auth/SignupPage"));
const LoanListPage = lazy(() => import("@/pages/loan/LoanListPage"));
const LoanDetailPage = lazy(() => import("@/pages/loan/LoanDetailPage"));
const LoanApplyPage = lazy(() => import("@/pages/loan/LoanApplyPage"));
const LoanPreApplyPage = lazy(() => import("@/pages/loan/LoanPreApplyPage"));
const LoanReviewPage = lazy(() => import("@/pages/loan/LoanReviewPage"));
const LoanResultPage = lazy(() => import("@/pages/loan/LoanResultPage"));
const LoanAgreementPage = lazy(() => import("@/pages/loan/LoanAgreementPage"));
const LoanExecutionPage = lazy(() => import("@/pages/loan/LoanExecutionPage"));
const LoanProgressPage = lazy(() => import("@/pages/loan/LoanProgressPage"));
const BizDataPage = lazy(() => import("@/pages/bizData/BizDataPage"));
const BizDataCollectPage = lazy(() => import("@/pages/bizData/BizDataCollectPage"));
const BizDashboardPage = lazy(() => import("@/pages/bizData/BizDashboardPage"));
const GradeReportPage = lazy(() => import("@/pages/grade/GradeReportPage"));
const GradeReportDetailPage = lazy(() => import("@/pages/grade/GradeReportDetailPage"));
const LoanManagementPage = lazy(() => import("@/pages/loan/LoanManagementPage"));
const MyPage = lazy(() => import("@/pages/mypage/MyPage"));
const ProfilePage = lazy(() => import("@/pages/mypage/ProfilePage"));
const BusinessInfoPage = lazy(() => import("@/pages/mypage/BusinessInfoPage"));
const WithdrawPage = lazy(() => import("@/pages/mypage/WithdrawPage"));
const NotificationsPage = lazy(() => import("@/pages/notification/NotificationsPage"));
const NotFoundPage = lazy(() => import("@/pages/error/NotFoundPage"));

/** 지연 로딩 페이지를 Suspense로 감싸는 헬퍼 */
function Lazy({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<CharacterLoadingSpinner />}>{children}</Suspense>;
}

export const router = createBrowserRouter([
  /**
   * PublicLayout — 비인증 화면 (로그인, 회원가입)
   */
  {
    element: <PublicLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
    ],
  },

  /**
   * StepLayout — 다단계 흐름 화면 (하단 네비 없음)
   * 대출 신청, My Biz Data 수집, 대출 약정
   */
  {
    element: <StepLayout />,
    children: [
      // 회원가입
      { path: "/signup", element: <Lazy><SignupPage /></Lazy> },

      // 대출 신청 — /loan/apply 내부에서 step 기반 흐름
      { path: "/loan/apply", element: <Lazy><LoanApplyPage /></Lazy> },

      // 대출 사전 입력
      { path: "/loan/pre-apply/:productId", element: <Lazy><LoanPreApplyPage /></Lazy> },

      // 대출 상품
      { path: "/loan", element: <Lazy><LoanListPage /></Lazy> },
      { path: "/loan/:productId", element: <Lazy><LoanDetailPage /></Lazy> },

      // My Biz Data 대시보드 + 수집
      { path: "/biz-data", element: <Lazy><BizDataPage /></Lazy> },
      { path: "/biz-data/dashboard", element: <Lazy><BizDashboardPage /></Lazy> },
      { path: "/biz-data/collect", element: <Lazy><BizDataCollectPage /></Lazy> },

      // 대출 약정 (약관 동의 → PIN → 계좌 설정)
      { path: "/loan/agreement/:applicationId", element: <Lazy><LoanAgreementPage /></Lazy> },

      // 심사 이후 — route 기반 분리
      { path: "/loan-applications", element: <Lazy><LoanProgressPage /></Lazy> },
      { path: "/loan/review/:applicationId", element: <Lazy><LoanReviewPage /></Lazy> },
      { path: "/loan/result/:applicationId", element: <Lazy><LoanResultPage /></Lazy> },
      { path: "/loan/execution/:applicationId", element: <Lazy><LoanExecutionPage /></Lazy> },

      // 마이페이지
      { path: "/mypage", element: <Lazy><MyPage /></Lazy> },
      { path: "/mypage/profile", element: <Lazy><ProfilePage /></Lazy> },
      { path: "/mypage/business", element: <Lazy><BusinessInfoPage /></Lazy> },
      { path: "/mypage/withdraw", element: <Lazy><WithdrawPage /></Lazy> },

      // 알림
      { path: "/notifications", element: <Lazy><NotificationsPage /></Lazy> },

      // S분석 리포트 — step 기반 흐름
      { path: "/grade-report", element: <Lazy><GradeReportPage /></Lazy> },
      { path: "/grade-report/detail", element: <Lazy><GradeReportDetailPage /></Lazy> },

      // 대출 관리
      { path: "/loan-management", element: <Lazy><LoanManagementPage /></Lazy> },
    ],
  },

  /**
   * MainLayout — 인증된 사용자 화면 (하단 네비 포함)
   */
  {
    element: <MainLayout />,
    children: [
      // 홈
      { path: "/", element: <HomePage /> },
    ],
  },

  // 404
  { path: "*", element: <Lazy><NotFoundPage /></Lazy> },
]);
