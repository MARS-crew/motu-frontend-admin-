import type { BadgeTone } from '@/components/common/Badge';
import type { SelectOption } from '@/components/common/Select';
import type {
  AbnormalTradeAction,
  AbnormalTradeStatus,
  AbnormalTradeType,
  MonitoringPeriod,
} from '@/types/monitoring';

// 드롭다운과 목록에 같은 명칭을 사용합니다.
export const ABNORMAL_TRADE_TYPE_LABELS: Record<AbnormalTradeType, string> = {
  LARGE_ORDER: '대량 주문',
  REPEATED_ORDER: '반복 주문',
  ABNORMAL_PRICE: '비정상 가격 체결',
  ORDER_FAILURE: '주문 처리 실패',
  BALANCE_MISMATCH: '잔액 불일치',
};

export const ABNORMAL_TRADE_STATUS_LABELS: Record<AbnormalTradeStatus, string> = {
  UNPROCESSED: '미처리',
  CHECKING: '확인중',
  DONE: '처리완료',
};

export const ABNORMAL_TRADE_STATUS_TONES: Record<AbnormalTradeStatus, BadgeTone> = {
  UNPROCESSED: 'danger',
  CHECKING: 'neutral',
  DONE: 'success',
};

export const ABNORMAL_TRADE_TYPE_FILTER_OPTIONS: SelectOption<AbnormalTradeType | 'ALL'>[] = [
  { value: 'ALL', label: '전체' },
  ...(Object.keys(ABNORMAL_TRADE_TYPE_LABELS) as AbnormalTradeType[]).map((value) => ({
    value,
    label: ABNORMAL_TRADE_TYPE_LABELS[value],
  })),
];

export const ABNORMAL_TRADE_STATUS_FILTER_OPTIONS: SelectOption<AbnormalTradeStatus | 'ALL'>[] = [
  { value: 'ALL', label: '전체' },
  ...(Object.keys(ABNORMAL_TRADE_STATUS_LABELS) as AbnormalTradeStatus[]).map((value) => ({
    value,
    label: ABNORMAL_TRADE_STATUS_LABELS[value],
  })),
];

// 기본 기간은 최근 24시간입니다.
export const MONITORING_PERIOD_PRESETS: {
  value: Exclude<MonitoringPeriod, 'custom'>;
  label: string;
}[] = [
  { value: '24h', label: '최근 24시간' },
  { value: '7d', label: '최근 7일' },
  { value: '30d', label: '최근 30일' },
];

export const ABNORMAL_TRADE_ACTION_OPTIONS: SelectOption<AbnormalTradeAction>[] = [
  { value: 'PAUSE_PRODUCT', label: '상품 거래 중지' },
  { value: 'SUSPEND_MEMBER', label: '회원 정지' },
  { value: 'NO_ISSUE', label: '이상 없음' },
];
