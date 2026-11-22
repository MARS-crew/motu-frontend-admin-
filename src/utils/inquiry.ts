import type {
  AdminInquiriesParams,
  AdminInquiryItem,
  AdminInquiryResponse,
  InquiryDetail,
  InquiryFilters,
  InquirySummary,
} from '@/types/inquiry';
import { toLocalDateTime } from '@/utils/date';

export const toAdminInquiriesParams = (
  filters: InquiryFilters,
  size: number,
): AdminInquiriesParams => ({
  keyword: filters.keyword.trim() || undefined,
  status: filters.status === 'ALL' ? undefined : filters.status,
  inquiryType: filters.type === 'ALL' ? undefined : filters.type,
  page: filters.page,
  size,
});

export const toInquirySummary = (item: AdminInquiryItem): InquirySummary => ({
  inquiryId: String(item.id),
  inquiryCode: item.inquiryCode,
  type: item.inquiryType,
  status: item.status,
  createdAt: toLocalDateTime(item.createDate),
  handlerName: item.assignedAdmin?.loginId ?? null,
});

export const toInquiryDetail = (response: AdminInquiryResponse): InquiryDetail => ({
  ...toInquirySummary(response),
  replyEmail: response.replyEmail ?? '-',
  content: response.content,
  replyDraft: response.replyDraft,
  replyVersion: response.replyVersion,
  canEdit: response.canEdit,
  completedAt: response.completedAt ? toLocalDateTime(response.completedAt) : null,
  latestAttempt: response.latestReplyAttempt && {
    status: response.latestReplyAttempt.status,
    replyText: response.latestReplyAttempt.replyText,
    sentAt: toLocalDateTime(response.latestReplyAttempt.createDate),
  },
});
