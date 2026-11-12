import type { AdminActivity, DashboardStats, TradeMetric, TradeTrend } from '@/types/dashboard';

// TODO(MOTU-19-1, MOTU-19-2): 대시보드 API 연동 후 제거합니다.
// 퍼블리싱 확인용 예시 데이터입니다. (Figma 17 · 관리자 대시보드)

export const DASHBOARD_STATS_PREVIEW: DashboardStats = {
  memberCount: 12480,
  memberChangeRate: 2.1,
  listedProductCount: 36,
  listedProductChange: 3,
  pendingCount: 8,
  pendingChange: -2,
  pendingListingCount: 5,
  pendingInquiryCount: 3,
  abnormalTradeCount: 3,
  abnormalTradeChange: 1,
};

const HOURLY_X_LABELS = ['00시', '06시', '12시', '18시', '24시'];

export const TRADE_TREND_PREVIEW: Record<TradeMetric, TradeTrend> = {
  volume: {
    total: 82400,
    periodLabel: '2026.09.11 00:00 ~ 24:00',
    values: [26400, 43200, 33600, 60000, 50400, 81600, 67200, 88800],
    xLabels: HOURLY_X_LABELS,
  },
  amount: {
    total: 480000000,
    periodLabel: '2026.09.11 00:00 ~ 24:00',
    values: [
      132000000, 216000000, 168000000, 300000000, 252000000, 408000000, 336000000, 444000000,
    ],
    xLabels: HOURLY_X_LABELS,
  },
};

export const RECENT_ACTIVITIES_PREVIEW: AdminActivity[] = [
  {
    id: '1',
    time: '22:18',
    adminName: '김관리',
    targetId: 'LST-018',
    action: '상장 보완요청',
    result: '완료',
  },
  {
    id: '2',
    time: '21:42',
    adminName: '박운영',
    targetId: 'USR-1024',
    action: '회원 잠금 해제',
    result: '완료',
  },
  {
    id: '3',
    time: '20:30',
    adminName: '김관리',
    targetId: 'LST-015',
    action: '상장 승인',
    result: '완료',
  },
  {
    id: '4',
    time: '19:10',
    adminName: '이기획',
    targetId: 'admin03',
    action: '관리자 정지',
    result: '완료',
  },
];
