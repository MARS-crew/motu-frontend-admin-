import { createBrowserRouter } from 'react-router';

import { AdminLayout } from '@/components/layout/AdminLayout';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { ROUTES } from '@/constants/routes';
import AdminsPage from '@/pages/admins/AdminsPage';
import BlockedPage from '@/pages/blocked/BlockedPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import InquiriesPage from '@/pages/inquiries/InquiriesPage';
import ListingDetailPage from '@/pages/listings/ListingDetailPage';
import ListingReviewPage from '@/pages/listings/ListingReviewPage';
import ListingsPage from '@/pages/listings/ListingsPage';
import LoginPage from '@/pages/login/LoginPage';
import MembersPage from '@/pages/members/MembersPage';
import MonitoringPage from '@/pages/monitoring/MonitoringPage';
import NotFoundPage from '@/pages/not-found/NotFoundPage';
import NoticesPage from '@/pages/notices/NoticesPage';
import PasswordChangePage from '@/pages/password-change/PasswordChangePage';
import PasswordResetConfirmPage from '@/pages/password-reset/PasswordResetConfirmPage';
import PasswordResetRequestPage from '@/pages/password-reset/PasswordResetRequestPage';
import ProductsPage from '@/pages/products/ProductsPage';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { PublicOnlyRoute } from '@/routes/PublicOnlyRoute';
import type { RouteHandle } from '@/routes/routeHandle';

// handle.title 은 헤더(와 브라우저 탭)에 표시되는 페이지 제목입니다.
const title = (value: string): RouteHandle => ({ title: value });

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      // 로그인 전에만 접근
      {
        element: <PublicOnlyRoute />,
        children: [
          { path: ROUTES.LOGIN, element: <LoginPage />, handle: title('관리자 로그인') },
          {
            path: ROUTES.PASSWORD_RESET,
            element: <PasswordResetRequestPage />,
            handle: title('비밀번호 재설정'),
          },
        ],
      },
      // 로그인 여부와 관계없이 접근 (메일 링크, 차단 안내)
      {
        path: ROUTES.PASSWORD_RESET_CONFIRM,
        element: <PasswordResetConfirmPage />,
        handle: title('새 비밀번호 설정'),
      },
      { path: ROUTES.BLOCKED, element: <BlockedPage />, handle: title('접근 차단') },
      // 로그인 후, 사이드바·헤더 없이 표시
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: ROUTES.PASSWORD_CHANGE,
            element: <PasswordChangePage />,
            handle: title('최초 비밀번호 변경'),
          },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: ROUTES.DASHBOARD, element: <DashboardPage />, handle: title('운영 현황') },
          {
            path: ROUTES.INQUIRIES,
            element: <InquiriesPage />,
            handle: title('계정·인증 문의 관리'),
          },
          { path: ROUTES.LISTINGS, element: <ListingsPage />, handle: title('상장 신청 목록') },
          {
            path: ROUTES.LISTING_DETAIL,
            element: <ListingDetailPage />,
            handle: title('상장 신청 상세 심사'),
          },
          {
            path: ROUTES.LISTING_REVIEW,
            element: <ListingReviewPage />,
            handle: title('승인·반려·보완 요청'),
          },
          { path: ROUTES.PRODUCTS, element: <ProductsPage />, handle: title('상장 상품 목록') },
          {
            path: ROUTES.MONITORING,
            element: <MonitoringPage />,
            handle: title('거래 및 주문 모니터링'),
          },
          { path: ROUTES.NOTICES, element: <NoticesPage />, handle: title('공지 목록') },
          { path: ROUTES.ADMINS, element: <AdminsPage />, handle: title('관리자 계정 목록') },
          { path: ROUTES.MEMBERS, element: <MembersPage />, handle: title('회원 관리') },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);
