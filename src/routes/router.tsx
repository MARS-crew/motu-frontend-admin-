import { createBrowserRouter } from 'react-router';

import { AdminLayout } from '@/components/layout/AdminLayout';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { ROUTES } from '@/constants/routes';
import AdminsPage from '@/pages/admins/AdminsPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import ListingsPage from '@/pages/listings/ListingsPage';
import LoginPage from '@/pages/login/LoginPage';
import MembersPage from '@/pages/members/MembersPage';
import MonitoringPage from '@/pages/monitoring/MonitoringPage';
import NotFoundPage from '@/pages/not-found/NotFoundPage';
import NoticesPage from '@/pages/notices/NoticesPage';
import ProductsPage from '@/pages/products/ProductsPage';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { PublicOnlyRoute } from '@/routes/PublicOnlyRoute';
import type { RouteHandle } from '@/routes/routeHandle';

// handle.title 은 헤더에 표시되는 페이지 제목입니다.
const title = (value: string): RouteHandle => ({ title: value });

export const router = createBrowserRouter([
  {
    element: <PublicOnlyRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [{ path: ROUTES.LOGIN, element: <LoginPage />, handle: title('관리자 로그인') }],
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
          { path: ROUTES.LISTINGS, element: <ListingsPage />, handle: title('상장 신청 목록') },
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
