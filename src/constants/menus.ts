import menuAdminActiveIcon from '@/assets/icons/menu-admin-active.svg';
import menuAdminIcon from '@/assets/icons/menu-admin.svg';
import menuDashboardActiveIcon from '@/assets/icons/menu-dashboard-active.svg';
import menuDashboardIcon from '@/assets/icons/menu-dashboard.svg';
import menuListingActiveIcon from '@/assets/icons/menu-listing-active.svg';
import menuListingIcon from '@/assets/icons/menu-listing.svg';
import menuMemberActiveIcon from '@/assets/icons/menu-member-active.svg';
import menuMemberIcon from '@/assets/icons/menu-member.svg';
import menuMonitoringActiveIcon from '@/assets/icons/menu-monitoring-active.svg';
import menuMonitoringIcon from '@/assets/icons/menu-monitoring.svg';
import menuNoticeActiveIcon from '@/assets/icons/menu-notice-active.svg';
import menuNoticeIcon from '@/assets/icons/menu-notice.svg';
import menuProductActiveIcon from '@/assets/icons/menu-product-active.svg';
import menuProductIcon from '@/assets/icons/menu-product.svg';
import { ROUTES } from '@/constants/routes';

export type SidebarMenu = {
  label: string;
  path: string;
  icon: string;
  activeIcon: string;
};

// 로그인 후 공통 사이드바 메뉴입니다. (순서 고정)
export const SIDEBAR_MENUS: SidebarMenu[] = [
  {
    label: '대시보드',
    path: ROUTES.DASHBOARD,
    icon: menuDashboardIcon,
    activeIcon: menuDashboardActiveIcon,
  },
  {
    label: '상장 승인',
    path: ROUTES.LISTINGS,
    icon: menuListingIcon,
    activeIcon: menuListingActiveIcon,
  },
  {
    label: '상품 관리',
    path: ROUTES.PRODUCTS,
    icon: menuProductIcon,
    activeIcon: menuProductActiveIcon,
  },
  {
    label: '거래 모니터링',
    path: ROUTES.MONITORING,
    icon: menuMonitoringIcon,
    activeIcon: menuMonitoringActiveIcon,
  },
  {
    label: '공지 관리',
    path: ROUTES.NOTICES,
    icon: menuNoticeIcon,
    activeIcon: menuNoticeActiveIcon,
  },
  {
    label: '관리자 계정',
    path: ROUTES.ADMINS,
    icon: menuAdminIcon,
    activeIcon: menuAdminActiveIcon,
  },
  {
    label: '회원 관리',
    path: ROUTES.MEMBERS,
    icon: menuMemberIcon,
    activeIcon: menuMemberActiveIcon,
  },
];
