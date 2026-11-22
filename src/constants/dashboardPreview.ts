import type { TradeMetric, TradeTrend } from '@/types/dashboard';

// TODO(MOTU-19-2): 거래 추이 API 연동 후 제거합니다.
// 퍼블리싱 확인용 예시 데이터입니다. (Figma 17 · 관리자 대시보드)

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
