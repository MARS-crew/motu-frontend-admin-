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
  // 관리자 활동 이력 (ADM-MON-04)
  ACTIVITY_LOGS: '/monitoring/activity-logs',
  MONITORING_DETAIL: '/monitoring/:alertId',
  NOTICES: '/notices',
  // 공지 작성 및 수정 (ADM-NTC-02)
  NOTICE_NEW: '/notices/new',
  NOTICE_EDIT: '/notices/:noticeId/edit',
  // 공지 비공개·삭제 확인 (ADM-NTC-04)
  NOTICE_DELETE: '/notices/:noticeId/delete',
  ADMINS: '/admins',
  // 관리자 계정 생성·상태 변경 (ADM-ACC-02), ?target=아이디
  ADMIN_MANAGE: '/admins/manage',
  MEMBERS: '/members',
  // 초기 지급 포인트 설정 (ADM-MBR-03)
  MEMBER_INITIAL_POINTS: '/members/initial-points',
  MEMBER_DETAIL: '/members/:memberId',
  // 회원 상태 변경 (ADM-MBR-02-01)
  MEMBER_STATUS: '/members/:memberId/status',
  // 계정 잠금 해제 (ADM-MBR-02-02)
  MEMBER_UNLOCK: '/members/:memberId/unlock',
  // 회원 포인트 지급·회수 (ADM-MBR-02-03)
  MEMBER_POINTS: '/members/:memberId/points',
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

export const getNoticeEditPath = (noticeId: string) =>
  withParam(ROUTES.NOTICE_EDIT, 'noticeId', noticeId);

export const getNoticeDeletePath = (noticeId: string) =>
  withParam(ROUTES.NOTICE_DELETE, 'noticeId', noticeId);

export const getMemberDetailPath = (memberId: string) =>
  withParam(ROUTES.MEMBER_DETAIL, 'memberId', memberId);

export const getMemberStatusPath = (memberId: string) =>
  withParam(ROUTES.MEMBER_STATUS, 'memberId', memberId);

export const getMemberUnlockPath = (memberId: string) =>
  withParam(ROUTES.MEMBER_UNLOCK, 'memberId', memberId);

export const getMemberPointsPath = (memberId: string) =>
  withParam(ROUTES.MEMBER_POINTS, 'memberId', memberId);

export const getAdminManagePath = (loginId: string) =>
  `${ROUTES.ADMIN_MANAGE}?target=${encodeURIComponent(loginId)}`;
