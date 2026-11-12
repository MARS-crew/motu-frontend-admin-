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
  LISTING_REVIEW: '/listings/:applicationId/review',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:productId',
  PRODUCT_EDIT: '/products/:productId/edit',
  // 거래 중지 및 재개
  PRODUCT_TRADING: '/products/:productId/trading',
  // 상품 종료 확인
  PRODUCT_CLOSE: '/products/:productId/close',
  MONITORING: '/monitoring',
  // 서비스 주요 지표 (ADM-MON-03)
  MONITORING_METRICS: '/monitoring/metrics',
  // 이상 거래 상세 (ADM-MON-02)
  MONITORING_DETAIL: '/monitoring/:alertId',
  NOTICES: '/notices',
  ADMINS: '/admins',
  MEMBERS: '/members',
} as const;

const withParam = (pattern: string, name: string, value: string) =>
  pattern.replace(`:${name}`, encodeURIComponent(value));

export const getListingDetailPath = (applicationId: string) =>
  withParam(ROUTES.LISTING_DETAIL, 'applicationId', applicationId);

export const getListingReviewPath = (applicationId: string) =>
  withParam(ROUTES.LISTING_REVIEW, 'applicationId', applicationId);

export const getProductDetailPath = (productId: string) =>
  withParam(ROUTES.PRODUCT_DETAIL, 'productId', productId);

export const getProductEditPath = (productId: string) =>
  withParam(ROUTES.PRODUCT_EDIT, 'productId', productId);

export const getProductTradingPath = (productId: string) =>
  withParam(ROUTES.PRODUCT_TRADING, 'productId', productId);

export const getProductClosePath = (productId: string) =>
  withParam(ROUTES.PRODUCT_CLOSE, 'productId', productId);

export const getMonitoringDetailPath = (alertId: string) =>
  withParam(ROUTES.MONITORING_DETAIL, 'alertId', alertId);
