import { createBrowserRouter } from "react-router-dom";

import { PublicLayout } from "@/components/common/PublicLayout";
import { MainLayout } from "@/components/common/MainLayout";
import { StepLayout } from "@/components/common/StepLayout";

// Auth
import LoginPage from "@/pages/auth/LoginPage";
import SignupPage from "@/pages/auth/SignupPage";

// Home
import HomePage from "@/pages/home/HomePage";

// Loan
import LoanListPage from "@/pages/loan/LoanListPage";
import LoanDetailPage from "@/pages/loan/LoanDetailPage";
import LoanApplyPage from "@/pages/loan/LoanApplyPage";
import LoanPreApplyPage from "@/pages/loan/LoanPreApplyPage";
import LoanReviewPage from "@/pages/loan/LoanReviewPage";
import LoanResultPage from "@/pages/loan/LoanResultPage";
import LoanAgreementPage from "@/pages/loan/LoanAgreementPage";
import LoanExecutionPage from "@/pages/loan/LoanExecutionPage";
import LoanProgressPage from "@/pages/loan/LoanProgressPage";

// Biz Data
import BizDataPage from "@/pages/bizData/BizDataPage";
import BizDataCollectPage from "@/pages/bizData/BizDataCollectPage";

// Grade Report
import GradeReportPage from "@/pages/grade/GradeReportPage";
import GradeReportIntroPage from "@/pages/grade/GradeReportIntroPage";

// Calculate
import CalculatePage from "@/pages/calculator/CalculatorPage";

// Mypage
import MyPage from "@/pages/mypage/MyPage";
import ProfilePage from "@/pages/mypage/ProfilePage";
import BusinessInfoPage from "@/pages/mypage/BusinessInfoPage";
import NotificationsPage from "@/pages/mypage/NotificationsPage";

// Error
import NotFoundPage from "@/pages/error/NotFoundPage";

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
      { path: "/signup", element: <SignupPage /> },

      // 대출 신청 — /loan/apply 내부에서 step 기반 흐름
      { path: "/loan/apply", element: <LoanApplyPage /> },

      // 대출 사전 입력
      { path: "/loan/pre-apply/:productId", element: <LoanPreApplyPage /> },

      // 대출 상품
      { path: "/loan", element: <LoanListPage /> },
      { path: "/loan/:productId", element: <LoanDetailPage /> },

      // My Biz Data 수집
      { path: "/biz-data/collect", element: <BizDataCollectPage /> },

      // 대출 약정 (약관 동의 → PIN → 계좌 설정)
      { path: "/loan/agreement/:applicationId", element: <LoanAgreementPage /> },

      // S분석 리포트 진입 (공개 접근 허용)
      { path: "/grade-report/intro", element: <GradeReportIntroPage /> },
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

      // 심사 이후 — route 기반 분리
      { path: "/loan-applications", element: <LoanProgressPage />},
      { path: "/loan/review/:applicationId", element: <LoanReviewPage /> },
      { path: "/loan/result/:applicationId", element: <LoanResultPage /> },
      { path: "/loan/execution/:applicationId", element: <LoanExecutionPage /> },

      // My Biz Data 대시보드
      { path: "/biz-data", element: <BizDataPage /> },

      // 성장 S등급 분석 리포트
      { path: "/grade-report", element: <GradeReportPage /> },

      // 사전계산기
      { path: "/calculate", element: <CalculatePage />},

      // 마이페이지
      { path: "/mypage", element: <MyPage /> },
      { path: "/mypage/profile", element: <ProfilePage /> },
      { path: "/mypage/business", element: <BusinessInfoPage /> },
      { path: "/mypage/notifications", element: <NotificationsPage /> },
    ],
  },

  // 404
  { path: "*", element: <NotFoundPage /> },
]);
