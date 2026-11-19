import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getAdminNotice, getAdminNotices } from '@/apis/adminNotice';
import { NOTICE_PAGE_SIZE } from '@/constants/notice';
import type { NoticeFilters } from '@/types/notice';
import { toAdminNoticesParams, toNoticeDetail, toNoticeSummary } from '@/utils/notice';

export const NOTICES_QUERY_KEY = ['admin', 'notices'];

export const useNoticesQuery = (filters: NoticeFilters) =>
  useQuery({
    queryKey: [...NOTICES_QUERY_KEY, 'list', filters],
    queryFn: () => getAdminNotices(toAdminNoticesParams(filters, NOTICE_PAGE_SIZE)),
    select: (data) => ({
      notices: data.items.map(toNoticeSummary),
      totalPages: Math.max(Math.ceil(data.totalCount / NOTICE_PAGE_SIZE), 1),
    }),
    // 페이지·조회 조건을 바꾸는 동안 이전 목록을 유지해 깜빡이지 않게 합니다.
    placeholderData: keepPreviousData,
  });

// 공지 상세 (주소의 공지 ID 가 숫자가 아니면 조회하지 않습니다)
export const useNoticeDetailQuery = (noticeId: number) =>
  useQuery({
    queryKey: [...NOTICES_QUERY_KEY, 'detail', noticeId],
    queryFn: () => getAdminNotice(noticeId),
    select: toNoticeDetail,
    enabled: Number.isInteger(noticeId) && noticeId > 0,
  });
