export const ROUTES = {
  LOGIN: '/login',
  PASSWORD_RESET: '/password/reset',
  // 재설정 메일의 일회용 링크로 들어옵니다. (?token=...)
  PASSWORD_RESET_CONFIRM: '/password/reset/confirm',
  // 임시 비밀번호로 최초 로그인했을 때 강제로 이동합니다.
  PASSWORD_CHANGE: '/password/change',
  BLOCKED: '/blocked',
  DASHBOARD: '/',
  // 대시보드 > 처리 대기 > 계정·인증 문의
  INQUIRIES: '/inquiries',
  LISTINGS: '/listings',
  LISTING_DETAIL: '/listings/:applicationId',
  PRODUCTS: '/products',
  MONITORING: '/monitoring',
  NOTICES: '/notices',
  ADMINS: '/admins',
  MEMBERS: '/members',
} as const;

export const getListingDetailPath = (applicationId: string) =>
  ROUTES.LISTING_DETAIL.replace(':applicationId', encodeURIComponent(applicationId));
