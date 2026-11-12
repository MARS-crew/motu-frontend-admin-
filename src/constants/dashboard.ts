import type { TradeMetric, TradeRange } from '@/types/dashboard';

export const TRADE_METRIC_OPTIONS: { value: TradeMetric; label: string }[] = [
  { value: 'volume', label: '거래량' },
  { value: 'amount', label: '거래대금' },
];

// 집계 단위(KST): 1시간→5분, 6시간→30분, 1일→3시간, 1주·1개월→일별, 전체→월별
// 직접 설정은 1일 이내 1시간, 31일 이내 일별, 초과 시 월별
export const TRADE_RANGE_OPTIONS: { value: TradeRange; label: string }[] = [
  { value: '1h', label: '1시간' },
  { value: '6h', label: '6시간' },
  { value: '1d', label: '1일' },
  { value: '1w', label: '1주' },
  { value: '1m', label: '1개월' },
  { value: 'all', label: '전체' },
  { value: 'custom', label: '직접 설정' },
];

export const TRADE_METRIC_TEXTS: Record<
  TradeMetric,
  { title: string; totalLabel: string; unitLabel: string }
> = {
  volume: { title: '거래량 추이', totalLabel: '선택 구간 거래량', unitLabel: '단위: 주' },
  amount: {
    title: '거래대금 추이',
    totalLabel: '선택 구간 거래대금',
    unitLabel: '단위: 포인트(P)',
  },
};
