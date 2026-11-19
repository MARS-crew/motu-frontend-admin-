import { ACTIVITY_ACTION_LABELS } from '@/constants/admin';
import { PRODUCT_TRADE_STATUS_DESCRIPTIONS } from '@/constants/product';
import type { AdminActivityLogItem, AdminActivityLogResponse } from '@/types/admin';
import type {
  AdminStockItem,
  AdminStockResponse,
  AdminStocksParams,
  ProductDetail,
  ProductFilters,
  ProductHistory,
  ProductHistoryDetail,
  ProductSummary,
} from '@/types/product';
import { toLocalDateTime } from '@/utils/date';

// 화면 표시용 상품 ID: 18 → PRD-018
export const formatProductCode = (stockId: number) => `PRD-${String(stockId).padStart(3, '0')}`;

// 화면 검색 조건 → 목록 API 파라미터
export const toAdminStocksParams = (filters: ProductFilters, size: number): AdminStocksParams => ({
  keyword: filters.keyword.trim() || undefined,
  tradeStatus: filters.tradeStatus === 'ALL' ? undefined : filters.tradeStatus,
  sectorCode: filters.sectorCode === 'ALL' ? undefined : Number(filters.sectorCode),
  visibility: filters.exposure === 'ALL' ? undefined : filters.exposure,
  page: filters.page,
  size,
});

export const toProductSummary = (item: AdminStockItem): ProductSummary => ({
  productId: String(item.stockId),
  productCode: formatProductCode(item.stockId),
  productName: item.name,
  sectorCode: item.sectorCode,
  sectorName: item.sectorName,
  tradeStatus: item.tradeStatus,
  tradeStartAt: toLocalDateTime(item.listingDate),
  currentPrice: item.currentPrice,
  exposure: item.isPublic ? 'PUBLIC' : 'PRIVATE',
});

export const toProductDetail = (response: AdminStockResponse): ProductDetail => ({
  ...toProductSummary(response),
  operatorName: response.operatorName,
  officialUrl: response.officialUrl ?? '',
  summary: response.summary,
  intro: response.description ?? '',
  totalSupply: response.listedShares,
  openOrderCount: response.openOrderCount,
  tradeStatusDescription: PRODUCT_TRADE_STATUS_DESCRIPTIONS[response.tradeStatus],
  statusNotice: response.statusNotice,
  metrics: {
    mau: response.metrics.mau,
    transactionAmount: response.metrics.transactionVolume,
    baseDate: response.metrics.baseDate,
  },
});

export const toProductHistory = (log: AdminActivityLogItem): ProductHistory => ({
  historyId: log.activityLogId,
  processedAt: toLocalDateTime(log.createDate),
  actionType: ACTIVITY_ACTION_LABELS[log.action] ?? log.action,
  adminId: log.adminLoginId,
  summary: log.summary,
});

const formatLogValue = (value: unknown) => {
  if (value === null || value === undefined || value === '') return '-';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
};

// { 항목: 값 } 형태의 변경 전·후 값을 항목 순서대로 ' / ' 로 이어 붙입니다.
const formatLogValues = (fields: string[], values: Record<string, unknown> | null) =>
  fields.map((field) => formatLogValue(values?.[field])).join(' / ') || '-';

export const toProductHistoryDetail = (log: AdminActivityLogResponse): ProductHistoryDetail => {
  const fields = [...new Set([...Object.keys(log.before ?? {}), ...Object.keys(log.after ?? {})])];
  return {
    changedField: fields.join(', ') || '-',
    before: formatLogValues(fields, log.before),
    after: formatLogValues(fields, log.after),
    reason: log.reason || '-',
  };
};
