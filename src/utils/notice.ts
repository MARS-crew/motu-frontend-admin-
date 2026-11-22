import { NOTICE_API_TYPES } from '@/constants/notice';
import type { NoticeForm } from '@/schemas/noticeSchema';
import type {
  AdminNoticeItem,
  AdminNoticeRequest,
  AdminNoticeResponse,
  AdminNoticesParams,
  NoticeDetail,
  NoticeFilters,
  NoticeSummary,
} from '@/types/notice';
import {
  addDays,
  parseISODate,
  toISODate,
  toKSTDateTime,
  toKSTStartOfDay,
  toLocalDateTime,
} from '@/utils/date';
import { formatProductCode } from '@/utils/product';

// 화면 검색 조건 → 목록 API 파라미터 (게시 기간 종료일은 그날 하루를 포함합니다)
export const toAdminNoticesParams = (filters: NoticeFilters, size: number): AdminNoticesParams => {
  const to = parseISODate(filters.to);
  return {
    keyword: filters.keyword.trim() || undefined,
    type: filters.type === 'ALL' ? undefined : NOTICE_API_TYPES[filters.type],
    status: filters.status === 'ALL' ? undefined : filters.status,
    from: filters.from ? toKSTStartOfDay(filters.from) : undefined,
    to: to ? toKSTStartOfDay(toISODate(addDays(to, 1))) : undefined,
    page: filters.page,
    size,
  };
};

export const toNoticeSummary = (item: AdminNoticeItem): NoticeSummary => ({
  noticeId: String(item.noticeId),
  type: item.type === 'STOCK' ? 'PRODUCT' : 'SERVICE',
  title: item.title,
  productId: item.stockId === null ? null : String(item.stockId),
  productCode: item.stockId === null ? null : formatProductCode(item.stockId),
  productName: item.stockName,
  status: item.status,
  startAt: item.postStartDate ? toLocalDateTime(item.postStartDate) : null,
  endAt: item.postEndDate ? toLocalDateTime(item.postEndDate) : null,
  isImportant: item.isImportant,
});

export const toNoticeDetail = (response: AdminNoticeResponse): NoticeDetail => ({
  ...toNoticeSummary(response),
  content: response.content,
});

// 비어 있으면 null 로 보냅니다.
const toOptionalKSTDateTime = (value: string) => (value ? toKSTDateTime(value) : null);

// 작성 폼 → 공지 요청 본문 (전체 공지는 대상 상품을 보내지 않습니다)
export const toAdminNoticeRequest = (form: NoticeForm): AdminNoticeRequest => ({
  type: NOTICE_API_TYPES[form.type],
  stockId: form.type === 'PRODUCT' && form.productId ? Number(form.productId) : null,
  title: form.title.trim(),
  content: form.content,
  isImportant: form.isImportant,
  postStartDate: toOptionalKSTDateTime(form.startAt),
  postEndDate: toOptionalKSTDateTime(form.endAt),
});
